"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useId,
} from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  TableInstance,
  TableState,
  ColumnInstance,
} from "react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilterX,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ColumnFilterMenu from "./ColumnFilterMenu";
import BulkSearchMenu from "./BulkSearchMenu";
import {
  BulkSearch,
  DataTableColumn,
  FilterEntry,
  compareEntries,
  flattenColumns,
  getColumnId,
  getFilterEntry,
  getNestedValue,
  normalizeText,
  phoneDigits,
} from "./columnFilter";

const DEFAULT_PAGE_SIZE = 2000;

// react-table's default reverses tied rows when sorting descending; keep their
// original order in both directions, like Excel
const stableOrderByFn = (rows: any[], sortFns: any[], directions: any[]) =>
  [...rows].sort((rowA, rowB) => {
    for (let i = 0; i < sortFns.length; i += 1) {
      const desc = directions[i] === false || directions[i] === "desc";
      const result = sortFns[i](rowA, rowB);
      if (result !== 0) return desc ? -result : result;
    }
    return rowA.index - rowB.index;
  });

interface ExtendedColumnInstance<T extends object> extends ColumnInstance<T> {
  isSorted?: boolean;
  isSortedDesc?: boolean;
  getSortByToggleProps?: () => any;
  toggleSortBy?: (descending?: boolean, multi?: boolean) => void;
}

export interface DataTableSelection<T> {
  selected: string[];
  onChange: (ids: string[]) => void;
  getRowId: (row: T) => string;
  // Shown next to the selected count, e.g. a "Delete Selected" button
  actions?: React.ReactNode;
}

interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[];
  data: T[];
  // false shows every row (for pages that page on the server)
  paginate?: boolean;
  extendWidth?: boolean;
  bulkSearch?: boolean;
  selection?: DataTableSelection<T>;
}

const DataTable = <T extends object>({
  columns,
  data,
  paginate = false,
  extendWidth,
  bulkSearch: bulkSearchEnabled = true,
  selection,
}: DataTableProps<T>) => {
  const rowsInputId = useId();
  // column id -> checked values (Excel-style filters)
  const [columnFilters, setColumnFilters] = useState<
    Record<string, Set<string>>
  >({});
  const [bulkSearch, setBulkSearch] = useState<BulkSearch | null>(null);
  const [rowsInput, setRowsInput] = useState<string>(
    String(DEFAULT_PAGE_SIZE)
  );
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const columnsById = useMemo(() => {
    const map = new Map<string, DataTableColumn<T>>();
    flattenColumns(columns).forEach((col) => {
      const id = getColumnId(col);
      if (id) map.set(id, col);
    });
    return map;
  }, [columns]);
  // Some pages rebuild `columns` on every render. Keying on the column ids
  // keeps the table data stable, so sorting and paging don't reset.
  const columnsKey = Array.from(columnsById.keys()).join("\n");
  const columnsByIdRef = useRef(columnsById);
  columnsByIdRef.current = columnsById;

  // Filter values are derived from rendered cells, so cache them per row
  const entryCache = useMemo(
    () => new WeakMap<object, Map<string, FilterEntry>>(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnsKey]
  );
  const entryOf = useCallback(
    (row: T, col: DataTableColumn<T>): FilterEntry => {
      let rowEntries = entryCache.get(row);
      if (!rowEntries) {
        rowEntries = new Map();
        entryCache.set(row, rowEntries);
      }
      const id = getColumnId(col) ?? "";
      let entry = rowEntries.get(id);
      if (!entry) {
        entry = getFilterEntry(row, col);
        rowEntries.set(id, entry);
      }
      return entry;
    },
    [entryCache]
  );

  // Columns the filters and the bulk search work on
  const searchColumns = Array.from(columnsById.entries())
    .filter(([, col]) => !col.disableFilter)
    .map(([id, col]) => ({
      id,
      title: typeof col.Header === "string" && col.Header ? col.Header : id,
    }));

  // Rows matching the pasted values, and the values found in no row
  const bulkResult = useMemo(() => {
    if (!bulkSearch) return null;
    // normalized value -> spelling as pasted
    const byKey = new Map(
      bulkSearch.terms.map((term) => [normalizeText(term), term])
    );
    const keys = Array.from(byKey.keys());
    // Phone-like values also match by digits: 03001234567 = +92 3001234567
    const byPhone = new Map(
      keys
        .filter((key) => /^[\d\s+()-]+$/.test(key))
        .map((key) => [phoneDigits(key), key] as const)
        .filter(([digits]) => digits.length >= 7)
    );
    // "All columns" skips computed columns such as Actions or Screenshot
    const cols = Array.from(columnsByIdRef.current.entries())
      .filter(
        ([id, col]) =>
          !col.disableFilter &&
          (bulkSearch.columnId ? id === bulkSearch.columnId : !col.filterValue)
      )
      .map(([, col]) => col);
    const containsPattern =
      bulkSearch.mode === "contains"
        ? new RegExp(
            keys
              .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join("|")
          )
        : null;
    const found = new Set<string>();
    const rows = new Set<T>();
    const matchedLabels: string[] = [];
    data.forEach((row) =>
      cols.forEach((col) => {
        const entry = entryOf(row, col);
        if (entry.type === "blank") return;
        const label = normalizeText(entry.label);
        if (containsPattern) {
          if (containsPattern.test(label)) {
            rows.add(row);
            matchedLabels.push(label);
          }
          return;
        }
        let key = byKey.has(label) ? label : undefined;
        if (!key && byPhone.size) key = byPhone.get(phoneDigits(label));
        if (key) {
          found.add(key);
          rows.add(row);
        }
      })
    );
    if (containsPattern) {
      // a value is found if some matched cell contains it
      const matchedText = matchedLabels.join("\n");
      keys.forEach((key) => {
        if (matchedText.includes(key)) found.add(key);
      });
    }
    return {
      rows,
      notFound: keys
        .filter((key) => !found.has(key))
        .map((key) => byKey.get(key) as string),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, bulkSearch, entryOf, columnsKey]);

  const passesFilters = useCallback(
    (row: T, skipId?: string) =>
      (!bulkResult || bulkResult.rows.has(row)) &&
      Object.entries(columnFilters).every(([id, keys]) => {
        const col = columnsByIdRef.current.get(id);
        return id === skipId || !col || keys.has(entryOf(row, col).key);
      }),
    [bulkResult, columnFilters, entryOf]
  );

  const filtersActive = Object.keys(columnFilters).length > 0 || !!bulkResult;
  const filteredData = useMemo(
    () => (filtersActive ? data.filter((row) => passesFilters(row)) : data),
    [data, filtersActive, passesFilters]
  );

  // Like Excel, a column lists the values left after the other columns' filters
  const getOptions = (id: string): FilterEntry[] => {
    const col = columnsById.get(id);
    if (!col) return [];
    const unique = new Map<string, FilterEntry>();
    data.forEach((row) => {
      if (!passesFilters(row, id)) return;
      const entry = entryOf(row, col);
      if (!unique.has(entry.key)) unique.set(entry.key, entry);
    });
    return Array.from(unique.values()).sort(compareEntries);
  };

  const applyFilter = (id: string, keys: Set<string> | null) =>
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (keys) next[id] = keys;
      else delete next[id];
      return next;
    });

  const clearAllFilters = () => {
    setColumnFilters({});
    setBulkSearch(null);
  };

  // Row selection (only for tables that pass `selection`)
  const selectedIds = useMemo(
    () => new Set(selection?.selected ?? []),
    [selection?.selected]
  );
  const visibleIds = selection ? filteredData.map(selection.getRowId) : [];
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));

  const toggleAllVisible = () =>
    selection?.onChange(allVisibleSelected ? [] : visibleIds);
  const toggleRow = (id: string) => {
    if (!selection) return;
    selection.onChange(
      selectedIds.has(id)
        ? selection.selected.filter((selectedId) => selectedId !== id)
        : [...selection.selected, id]
    );
  };

  // Only rows the filters show stay selected, so a bulk action never
  // touches rows that are hidden (or gone after a reload)
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  useEffect(() => {
    const current = selectionRef.current;
    if (!current || current.selected.length === 0) return;
    const visible = new Set(filteredData.map(current.getRowId));
    const kept = current.selected.filter((id) => visible.has(id));
    if (kept.length !== current.selected.length) current.onChange(kept);
  }, [filteredData]);

  // Sort by what the cells show (dates and numbers by value)
  const memoizedColumns = useMemo(() => {
    const withSort = (cols: DataTableColumn<T>[]): any[] =>
      cols.map((col) =>
        col.columns
          ? { ...col, columns: withSort(col.columns) }
          : {
              ...col,
              sortType: (
                rowA: any,
                rowB: any,
                _columnId: string,
                desc?: boolean
              ) => {
                const a = entryOf(rowA.original, col);
                const b = entryOf(rowB.original, col);
                // (Blanks) stay at the bottom in both directions, like Excel
                if ((a.type === "blank") !== (b.type === "blank"))
                  return (a.type === "blank" ? 1 : -1) * (desc ? -1 : 1);
                return compareEntries(a, b);
              },
            }
      );
    return withSort(columns);
  }, [columns, entryOf]);
  const memoizedData = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageCount,
    state,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize: setReactTablePageSize,
  } = useTable<T>(
    {
      columns: memoizedColumns as any,
      data: memoizedData,
      // like Excel, keep the sort when filters change or data reloads
      autoResetSortBy: false,
      orderByFn: stableOrderByFn,
      initialState: {
        pageIndex: 0,
        pageSize: DEFAULT_PAGE_SIZE,
      } as Partial<TableState<T>>,
    } as any,
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: any[];
    pageCount: number;
    state: { pageIndex: number };
    canPreviousPage: boolean;
    canNextPage: boolean;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (size: number) => void;
  };

  useEffect(() => {
    const value = parseInt(rowsInput);
    if (!isNaN(value) && value > 0) {
      setPageSize(value);
    }
  }, [rowsInput]);

  useEffect(() => {
    setReactTablePageSize(pageSize);
  }, [pageSize, setReactTablePageSize]);

  const rowsToRender = paginate ? page : rows;
  const showPager = paginate && pageCount > 1;

  const handleDownloadCSV = () => {
    const csvRows = [];

    const headers = columns.map((col) => col.Header);
    csvRows.push(headers.join(","));

    // filtered rows in the order shown on screen (all pages)
    rows.forEach(({ original: row }: any) => {
      const values = columns.map((col) => {
        if (col.exportValue) {
          return `"${col.exportValue(row)}"`;
        }

        const accessor = col.accessor as string;
        const val = getNestedValue(row, accessor);
        return typeof val === "string"
          ? `"${val.replace(/"/g, '""')}"`
          : val ?? "-";
      });

      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        className={cn("w-[95vw] md:w-full overflow-x-auto scrollbar-custom")}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {paginate && (
              <>
                <label htmlFor={rowsInputId}>Rows per page:</label>
                <input
                  id={rowsInputId}
                  type="number"
                  min={1}
                  value={rowsInput}
                  onChange={(e) => setRowsInput(e.target.value)}
                  className="border rounded-md px-2 py-1 w-24 text-sm"
                />
              </>
            )}
            {showPager && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  aria-label="Previous page"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <MoveLeft className="w-4 h-4" />
                </Button>
                <span>
                  Page {state.pageIndex + 1} of {pageCount}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  aria-label="Next page"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <MoveRight className="w-4 h-4" />
                </Button>
              </>
            )}
            {selection && selection.selected.length > 0 && (
              <>
                <span className="font-medium text-foreground">
                  {selection.selected.length} selected
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 underline"
                  onClick={() => selection.onChange([])}
                >
                  Clear selection
                </Button>
                {selection.actions}
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1">
            {filtersActive && (
              <>
                <span className="text-xs text-muted-foreground">
                  Showing {filteredData.length} of {data.length} rows
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllFilters}
                  className="rounded-none border-none underline"
                >
                  <FilterX className="w-4 h-4 mr-2" />
                  Clear all filters
                </Button>
              </>
            )}
            {bulkSearchEnabled && (
              <BulkSearchMenu
                columns={searchColumns}
                value={bulkSearch}
                onApply={setBulkSearch}
                matchedRows={bulkResult?.rows.size ?? 0}
                notFound={bulkResult?.notFound ?? []}
              />
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadCSV}
              className="rounded-none border-none underline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
        <Table
          {...getTableProps()}
          className={cn("w-full", extendWidth && "table-fixed")}
        >
          <TableHeader>
            {headerGroups.map((headerGroup, i) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                {selection && (
                  <TableHead className="w-10 bg-primary/10">
                    {i === headerGroups.length - 1 && (
                      <input
                        type="checkbox"
                        aria-label="Select all rows"
                        title="Select all rows shown by the filters"
                        className="h-4 w-4 cursor-pointer accent-primary"
                        checked={allVisibleSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              someVisibleSelected && !allVisibleSelected;
                        }}
                        onChange={toggleAllVisible}
                      />
                    )}
                  </TableHead>
                )}
                {headerGroup.headers.map((column, j) => {
                  const extendedColumn = column as ExtendedColumnInstance<T>;
                  const id = extendedColumn.id;
                  const colDef = columnsById.get(id);
                  // only leaf columns get a filter, not grouped headers
                  const canFilter =
                    !!colDef &&
                    !colDef.disableFilter &&
                    !extendedColumn.columns;
                  const title =
                    typeof colDef?.Header === "string" ? colDef.Header : id;

                  return (
                    // Like Excel, sorting is in the column's filter menu, not
                    // on a heading click
                    <TableHead
                      {...extendedColumn.getHeaderProps()}
                      key={j}
                      className="relative bg-primary/10 select-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          {extendedColumn.render("Header")}
                          {extendedColumn.isSorted &&
                            (extendedColumn.isSortedDesc ? (
                              <ArrowDown className="ml-1 w-3.5 h-3.5" />
                            ) : (
                              <ArrowUp className="ml-1 w-3.5 h-3.5" />
                            ))}
                        </span>
                        {canFilter && (
                          <ColumnFilterMenu
                            title={title}
                            getOptions={() => getOptions(id)}
                            selected={columnFilters[id]}
                            onApply={(keys) => applyFilter(id, keys)}
                            sorted={
                              extendedColumn.isSorted
                                ? extendedColumn.isSortedDesc
                                  ? "desc"
                                  : "asc"
                                : false
                            }
                            onSort={(desc) =>
                              extendedColumn.toggleSortBy?.(desc, false)
                            }
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {rowsToRender.map((row: any, i: number) => {
              prepareRow(row);
              const rowId = selection?.getRowId(row.original);
              return (
                <TableRow {...row.getRowProps()} key={i}>
                  {selection && (
                    <TableCell className="w-10 py-3">
                      {rowId !== undefined && (
                        <input
                          type="checkbox"
                          aria-label="Select row"
                          className="h-4 w-4 cursor-pointer accent-primary"
                          checked={selectedIds.has(rowId)}
                          onChange={() => toggleRow(rowId)}
                        />
                      )}
                    </TableCell>
                  )}
                  {row.cells.map((cell: any, j: number) => (
                    <TableCell
                      {...cell.getCellProps()}
                      key={j}
                      className="py-3"
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {showPager && (
        <div className="pagination flex justify-between items-center gap-10 mt-3 text-farmacieGrey">
          <Button
            variant="outline"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="border-none bg-transparent"
          >
            <MoveLeft className="inline mr-2 mb-1" />
            {"Previous"}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {state.pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="border-none bg-transparent"
          >
            {"Next "}
            <MoveRight className="inline" />
          </Button>
        </div>
      )}
    </>
  );
};

export default DataTable;
