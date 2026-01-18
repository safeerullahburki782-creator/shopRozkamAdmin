"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  ChevronDown,
  ChevronUp,
  Download,
  MoveLeft,
  MoveRight,
  Search,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ExtendedColumnInstance<T extends object> extends ColumnInstance<T> {
  isSorted?: boolean;
  isSortedDesc?: boolean;
  getSortByToggleProps?: () => any;
  disableFilter?: boolean;
}

interface DataTableColumn<T> {
  Header: string;
  accessor: keyof T | string;
  disableFilter?: boolean;
  Cell?: (props: any) => React.ReactNode;
  exportValue?: (row: T) => string;
}

interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[];
  data: T[];
  paginate?: boolean;
  extendWidth?: boolean;
}

const DataTable = <T extends object>({
  columns,
  data,
  paginate = false,
  extendWidth,
}: DataTableProps<T>) => {
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [rowsInput, setRowsInput] = useState<string>(
    paginate ? "100" : data.length.toString()
  );
  const [pageSize, setPageSize] = useState<number>(parseInt(rowsInput));

  const getNestedValue = (obj: any, path: string): any => {
    try {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    } catch {
      return undefined;
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, val]) => {
        const fieldValue = getNestedValue(row, key);
        return fieldValue?.toString().toLowerCase().includes(val.toLowerCase());
      });
    });
  }, [data, filters]);

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize: setReactTablePageSize,
  } = useTable<T>(
    {
      columns: memoizedColumns as any,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
      } as Partial<TableState<T>>,
    },
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: any[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (size: number) => void;
  };

  useEffect(() => {
    const value = parseInt(rowsInput);
    if (!isNaN(value) && value > 0 && value <= data.length) {
      setPageSize(value);
    }
  }, [rowsInput, data.length]);

  useEffect(() => {
    setReactTablePageSize(pageSize);
  }, [pageSize, setReactTablePageSize]);

  const handleDownloadCSV = () => {
    const csvRows = [];

    const headers = columns.map((col) => col.Header);
    csvRows.push(headers.join(","));

    memoizedData.forEach((row) => {
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
        <div className="flex justify-end">
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
        <Table
          {...getTableProps()}
          className={cn("w-full", extendWidth && "table-fixed")}
        >
          <TableHeader>
            {headerGroups.map((headerGroup, i) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, j) => {
                  const extendedColumn = column as ExtendedColumnInstance<T>;
                  const accessor = extendedColumn.id;
                  const disableFilter =
                    (columns.find((col) => col.accessor === accessor) as any)
                      ?.disableFilter ?? false;

                  return (
                    <TableHead
                      {...extendedColumn.getHeaderProps(
                        extendedColumn.getSortByToggleProps?.() || {}
                      )}
                      key={j}
                      className={cn(
                        "relative bg-primary/10 select-none",
                        !disableFilter && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (!disableFilter) {
                          setActiveFilterCol((prev) =>
                            prev === accessor ? null : accessor
                          );
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {extendedColumn.render("Header")}
                        {extendedColumn.isSorted ? (
                          extendedColumn.isSortedDesc ? (
                            <ChevronDown className="ml-2 w-4 h-4" />
                          ) : (
                            <ChevronUp className="ml-2 w-4 h-4" />
                          )
                        ) : (
                          !disableFilter && (
                            <Search className="ml-2 w-3.5 h-3.5 opacity-60" />
                          )
                        )}
                      </div>

                      {activeFilterCol === accessor && !disableFilter && (
                        <div className="absolute top-1 left-0 mt-1 w-full z-10 bg-white shadow-sm flex rounded-md items-center border px-2 mx-1">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search..."
                            value={filters[accessor] || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [accessor]: e.target.value,
                              }))
                            }
                            className="w-full text-xs bg-transparent outline-none"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilters((prev) => ({
                                ...prev,
                                [accessor]: "",
                              }));
                              setActiveFilterCol(null);
                            }}
                            className="!h-8"
                          >
                            <X className="w-3.5 h-3.5 text-gray-400" />
                          </Button>
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={i}>
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

      <div className="flex justify-start items-center my-4 px-4 text-sm text-muted-foreground">
        <label htmlFor="rowsPerPage" className="mr-2">
          Rows per page:
        </label>
        <input
          id="rowsPerPage"
          type="number"
          min={1}
          max={data.length}
          value={rowsInput}
          onChange={(e) => setRowsInput(e.target.value)}
          className="border rounded-md px-2 py-1 w-20 text-sm"
        />
      </div>

      {paginate && (
        <>
          <div className="pagination flex justify-between gap-10 mt-3 text-farmacieGrey">
            <Button
              variant="outline"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="border-none bg-transparent"
            >
              <MoveLeft className="inline mr-2 mb-1" />
              {"Previous"}
            </Button>
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
        </>
      )}
    </>
  );
};

export default DataTable;
