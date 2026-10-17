import React from "react";
import { format } from "date-fns";

// Helpers for the Excel-style column filters in DataTable.

export interface DataTableColumn<T = any> {
  Header: any;
  accessor?: keyof T | string;
  id?: string;
  columns?: DataTableColumn<T>[];
  disableFilter?: boolean;
  Cell?: (props: any) => React.ReactNode;
  exportValue?: (row: T) => string;
  // Text the column filter uses for a row. Defaults to the text the cell shows.
  filterValue?: (row: T) => string | null | undefined;
}

// One value in a column's filter list
export interface FilterEntry {
  key: string;
  label: string;
  sort: number | string;
  type: "date" | "number" | "text" | "blank";
}

export const BLANK_KEY = "__blank__";
const BLANK_ENTRY: FilterEntry = {
  key: BLANK_KEY,
  label: "(Blanks)",
  sort: "",
  type: "blank",
};
// Placeholders the tables show for missing values
const BLANK_TEXTS = new Set(["", "-", "N/A"]);
const ISO_DATE =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

export const getNestedValue = (obj: any, path: string): any => {
  try {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  } catch {
    return undefined;
  }
};

export const getColumnId = (col: DataTableColumn): string | undefined =>
  col.id ?? (typeof col.accessor === "string" ? col.accessor : undefined);

export const flattenColumns = (cols: DataTableColumn[]): DataTableColumn[] =>
  cols.flatMap((col) => (col.columns ? flattenColumns(col.columns) : [col]));

// Plain text of what a Cell renders (badges, links, spans...)
const nodeToText = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number")
    return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement(node))
    return nodeToText((node.props as { children?: React.ReactNode }).children);
  return "";
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== "string" || !ISO_DATE.test(value)) return null;
  // "yyyy-MM-dd HH:mm:ss" without a zone is UTC, as the emails table treats it
  const normalized =
    value.length === 19 && value[10] === " "
      ? value.replace(" ", "T") + "Z"
      : value;
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
};

const textEntry = (value: unknown): FilterEntry => {
  const text =
    value === null || value === undefined
      ? ""
      : String(value).replace(/\s+/g, " ").trim();
  if (BLANK_TEXTS.has(text)) return BLANK_ENTRY;
  const num = Number(text.replace(/,/g, ""));
  return isNaN(num)
    ? { key: text, label: text, sort: text, type: "text" }
    : { key: text, label: text, sort: num, type: "number" };
};

// How a row appears in a column's filter list. Like Excel, it uses the text
// the cell shows; dates are grouped by day.
export const getFilterEntry = (row: any, col: DataTableColumn): FilterEntry => {
  try {
    if (col.filterValue) return textEntry(col.filterValue(row));

    const id = getColumnId(col);
    const raw = id ? getNestedValue(row, id) : undefined;
    const date = toDate(raw);
    if (date) {
      return {
        key: format(date, "yyyy-MM-dd"),
        label: format(date, "dd MMM yyyy"),
        sort: date.getTime(),
        type: "date",
      };
    }

    if (col.exportValue) return textEntry(col.exportValue(row));
    if (col.Cell) {
      return textEntry(
        nodeToText(
          col.Cell({ value: raw, row: { original: row }, cell: { value: raw } })
        )
      );
    }
    if (typeof raw === "boolean") return textEntry(raw ? "True" : "False");
    return textEntry(raw);
  } catch {
    return BLANK_ENTRY;
  }
};

// Bulk search: many pasted values matched against one column or all columns
export interface BulkSearch {
  terms: string[];
  columnId: string; // "" = all columns
  mode: "exact" | "contains";
}

// Lowercase, without invisible marks (zero-width, WhatsApp direction marks)
// and with single spaces, so pasted text compares like the cell text
export const normalizeText = (text: string): string =>
  text
    .replace(/[​-‏‪-‮⁦-⁩﻿]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// One value per line (a pasted Excel column); without line breaks, commas,
// semicolons and tabs separate values. Keeps the first spelling of each value.
export const parseBulkTerms = (text: string): string[] => {
  const seen = new Set<string>();
  const terms: string[] = [];
  const parts = /[\r\n]/.test(text)
    ? text.split(/[\r\n\t]+/)
    : text.split(/[,;\t]+/);
  parts.forEach((raw) => {
    const term = raw
      .replace(/[​-‏‪-‮⁦-⁩﻿]/g, "")
      .trim()
      .replace(/^["']+|["']+$/g, "")
      .trim();
    const key = normalizeText(term);
    if (key && !seen.has(key)) {
      seen.add(key);
      terms.push(term);
    }
  });
  return terms;
};

// Digits only, without a leading 92 / 0, so "+92 300 1234567", "923001234567"
// and "03001234567" all compare as "3001234567"
export const phoneDigits = (text: string): string => {
  const digits = text.replace(/\D/g, "");
  return digits.replace(/^(92|0)+/, "");
};

// One shared collator; localeCompare with options is far slower on big tables
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

// Blanks last, numbers and dates by value, text A-Z (numbers inside text too)
export const compareEntries = (a: FilterEntry, b: FilterEntry): number => {
  if (a.type === "blank" || b.type === "blank") {
    if (a.type === b.type) return 0;
    return a.type === "blank" ? 1 : -1;
  }
  if (typeof a.sort === "number" && typeof b.sort === "number")
    return a.sort - b.sort;
  return collator.compare(a.label, b.label);
};
