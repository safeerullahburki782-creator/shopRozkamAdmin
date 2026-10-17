"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowDownZA,
  ChevronDown,
  Filter,
  FilterX,
  Search,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BLANK_KEY, FilterEntry } from "./columnFilter";

// Rendering thousands of checkboxes freezes the popover; search narrows it
const MAX_VISIBLE_VALUES = 1000;

const menuItemClass =
  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent disabled:pointer-events-none disabled:opacity-50";
const listItemClass =
  "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-accent";

const toggleKey = (set: Set<string>, key: string) => {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
};

interface ColumnFilterMenuProps {
  title: string;
  // Values left in this column after the other columns' filters
  getOptions: () => FilterEntry[];
  // Checked values; undefined when the column isn't filtered
  selected?: Set<string>;
  onApply: (keys: Set<string> | null) => void;
  sorted: false | "asc" | "desc";
  onSort: (desc: boolean) => void;
}

// Excel-style filter dropdown for one column header
const ColumnFilterMenu = ({
  title,
  getOptions,
  selected,
  onApply,
  sorted,
  onSort,
}: ColumnFilterMenuProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FilterEntry[]>([]);
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  // Like Excel, search results start checked; these are the ones unchecked
  const [searchUnchecked, setSearchUnchecked] = useState<Set<string>>(
    new Set()
  );
  const [addToFilter, setAddToFilter] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      const values = getOptions();
      setOptions(values);
      setDraft(
        new Set(
          values
            .filter((option) => !selected || selected.has(option.key))
            .map((option) => option.key)
        )
      );
      setSearch("");
      setSearchUnchecked(new Set());
      setAddToFilter(false);
    }
    setOpen(next);
  };

  const query = search.trim().toLowerCase();
  // A search lists matching values only, never "(Blanks)"
  const matching = useMemo(
    () =>
      query
        ? options.filter(
            (option) =>
              option.key !== BLANK_KEY &&
              option.label.toLowerCase().includes(query)
          )
        : options,
    [options, query]
  );
  const isChecked = (key: string) =>
    query ? !searchUnchecked.has(key) : draft.has(key);
  const allMatchingChecked =
    matching.length > 0 && matching.every((option) => isChecked(option.key));
  const someMatchingChecked = matching.some((option) => isChecked(option.key));

  // Values that stay visible after OK
  const finalKeys = (() => {
    if (!query)
      return options
        .filter((option) => draft.has(option.key))
        .map((option) => option.key);
    const results = matching
      .filter((option) => !searchUnchecked.has(option.key))
      .map((option) => option.key);
    if (!addToFilter) return results;
    // "Add current selection to filter" keeps what the filter shows now
    const current = options
      .filter((option) => !selected || selected.has(option.key))
      .map((option) => option.key);
    return Array.from(new Set([...current, ...results]));
  })();

  const valueType = options.find((option) => option.key !== BLANK_KEY)?.type;
  const sameType = options.every(
    (option) => option.key === BLANK_KEY || option.type === valueType
  );
  const [ascLabel, descLabel] =
    sameType && valueType === "date"
      ? ["Sort Oldest to Newest", "Sort Newest to Oldest"]
      : sameType && valueType === "number"
      ? ["Sort Smallest to Largest", "Sort Largest to Smallest"]
      : ["Sort A to Z", "Sort Z to A"];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSearchUnchecked(new Set());
  };

  const toggleValue = (key: string) => {
    if (query) setSearchUnchecked((prev) => toggleKey(prev, key));
    else setDraft((prev) => toggleKey(prev, key));
  };

  const toggleAll = () => {
    if (query) {
      setSearchUnchecked(
        allMatchingChecked
          ? new Set(matching.map((option) => option.key))
          : new Set()
      );
      return;
    }
    setDraft((prev) => {
      const next = new Set(prev);
      matching.forEach((option) =>
        allMatchingChecked ? next.delete(option.key) : next.add(option.key)
      );
      return next;
    });
  };

  const handleSort = (desc: boolean) => {
    onSort(desc);
    setOpen(false);
  };

  const handleClear = () => {
    onApply(null);
    setOpen(false);
  };

  const handleOk = () => {
    if (finalKeys.length === 0) return;
    // every value checked means no filter at all
    onApply(
      finalKeys.length === options.length ? null : new Set(finalKeys)
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Filter ${title}`}
          title={`Filter ${title}`}
          // keep the click away from the header
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-background text-muted-foreground hover:text-foreground",
            selected && "border-primary text-primary"
          )}
        >
          {selected ? (
            <Filter className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 lg:w-64 p-2 text-sm font-normal"
        // clicks inside the portal still bubble to the header in React
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={menuItemClass}
          onClick={() => handleSort(false)}
        >
          <ArrowDownAZ className="h-4 w-4" />
          <span className="flex-1">{ascLabel}</span>
          {sorted === "asc" && <span className="text-primary">✓</span>}
        </button>
        <button
          type="button"
          className={menuItemClass}
          onClick={() => handleSort(true)}
        >
          <ArrowDownZA className="h-4 w-4" />
          <span className="flex-1">{descLabel}</span>
          {sorted === "desc" && <span className="text-primary">✓</span>}
        </button>

        <div className="my-1 border-t" />

        <button
          type="button"
          className={menuItemClass}
          disabled={!selected}
          onClick={handleClear}
        >
          <FilterX className="h-4 w-4" />
          <span className="truncate">Clear Filter From &quot;{title}&quot;</span>
        </button>

        <div className="relative my-2">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleOk();
              }
            }}
            className="w-full rounded-md border bg-background py-1.5 pl-8 pr-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="max-h-56 overflow-y-auto rounded-md border p-1 scrollbar-custom">
          {matching.length === 0 ? (
            <p className="px-2 py-1.5 text-muted-foreground">No matches</p>
          ) : (
            <>
              <label className={listItemClass}>
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-primary"
                  checked={allMatchingChecked}
                  ref={(el) => {
                    if (el)
                      el.indeterminate =
                        someMatchingChecked && !allMatchingChecked;
                  }}
                  onChange={toggleAll}
                />
                <span>
                  {query ? "(Select All Search Results)" : "(Select All)"}
                </span>
              </label>
              {query && (
                <label className={listItemClass}>
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-primary"
                    checked={addToFilter}
                    onChange={() => setAddToFilter((prev) => !prev)}
                  />
                  <span>Add current selection to filter</span>
                </label>
              )}
              {matching.slice(0, MAX_VISIBLE_VALUES).map((option) => (
                <label key={option.key} className={listItemClass}>
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-primary"
                    checked={isChecked(option.key)}
                    onChange={() => toggleValue(option.key)}
                  />
                  <span className="truncate" title={option.label}>
                    {option.label}
                  </span>
                </label>
              ))}
              {matching.length > MAX_VISIBLE_VALUES && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  Showing first {MAX_VISIBLE_VALUES} of {matching.length}{" "}
                  values. Search to find the rest.
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            size="sm"
            className="h-8 text-white"
            disabled={finalKeys.length === 0}
            onClick={handleOk}
          >
            OK
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnFilterMenu;
