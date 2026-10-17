"use client";

import React, { useState } from "react";
import { Copy, ListFilter, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BulkSearch, parseBulkTerms } from "./columnFilter";

// Long "not found" lists are cut here; Copy still copies all of them
const MAX_LISTED = 200;

interface BulkSearchMenuProps {
  columns: { id: string; title: string }[];
  value: BulkSearch | null;
  onApply: (value: BulkSearch | null) => void;
  // result of the applied search
  matchedRows: number;
  notFound: string[];
}

// Paste many values (emails, usernames, phones...) and keep the matching rows
const BulkSearchMenu = ({
  columns,
  value,
  onApply,
  matchedRows,
  notFound,
}: BulkSearchMenuProps) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [columnId, setColumnId] = useState("");
  const [mode, setMode] = useState<BulkSearch["mode"]>("exact");

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setText(value ? value.terms.join("\n") : "");
      setColumnId(value?.columnId ?? "");
      setMode(value?.mode ?? "exact");
    }
    setOpen(next);
  };

  const terms = parseBulkTerms(text);

  // stays open so the found / not found result shows right away
  const handleSearch = () => {
    onApply(terms.length ? { terms, columnId, mode } : null);
  };

  const handleClear = () => {
    onApply(null);
    setText("");
    setOpen(false);
  };

  const copyNotFound = async () => {
    try {
      await navigator.clipboard.writeText(notFound.join("\n"));
      toast.success("Not found values copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "rounded-none border-none underline",
              value && "text-primary"
            )}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            Bulk search{value ? ` (${value.terms.length})` : ""}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 lg:w-96 p-3 text-sm">
          <p className="mb-2 font-semibold">Bulk search</p>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste values here: one per line, or separated by commas"
            className="w-full rounded-md border bg-background p-2 text-sm outline-none focus:border-primary scrollbar-custom"
          />
          <p className="mb-2 text-xs text-muted-foreground">
            {terms.length} value{terms.length === 1 ? "" : "s"}
          </p>

          <div className="mb-3 grid grid-cols-[auto,1fr] items-center gap-2">
            <label htmlFor="bulk-search-column" className="text-xs">
              Search in
            </label>
            <select
              id="bulk-search-column"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-sm"
            >
              <option value="">All columns</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
            <span className="text-xs">Match</span>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="bulk-search-mode"
                  className="accent-primary"
                  checked={mode === "exact"}
                  onChange={() => setMode("exact")}
                />
                Exact
              </label>
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="radio"
                  name="bulk-search-mode"
                  className="accent-primary"
                  checked={mode === "contains"}
                  onChange={() => setMode("contains")}
                />
                Contains
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              className="h-8 text-white"
              disabled={terms.length === 0}
              onClick={handleSearch}
            >
              Search
            </Button>
            {value && (
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>

          {value && (
            <div className="mt-3 space-y-2 border-t pt-2">
              <p>
                Found in {matchedRows} row{matchedRows === 1 ? "" : "s"}.{" "}
                {notFound.length} of {value.terms.length} value
                {value.terms.length === 1 ? "" : "s"} not found.
              </p>
              {notFound.length > 0 && (
                <>
                  <div className="max-h-32 overflow-y-auto rounded-md border p-2 text-xs scrollbar-custom">
                    {notFound.slice(0, MAX_LISTED).map((term) => (
                      <div key={term} className="truncate" title={term}>
                        {term}
                      </div>
                    ))}
                    {notFound.length > MAX_LISTED && (
                      <div className="text-muted-foreground">
                        …and {notFound.length - MAX_LISTED} more
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={copyNotFound}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy not found
                  </Button>
                </>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      {value && (
        <button
          type="button"
          aria-label="Clear bulk search"
          title="Clear bulk search"
          onClick={() => onApply(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default BulkSearchMenu;
