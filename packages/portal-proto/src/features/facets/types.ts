import { NumericFromTo, OperandValue, Operation } from "@gff/core";
import { ComponentType, ReactNode } from "react";

export interface FacetResponse {
  readonly data?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface EnumFacetResponse extends FacetResponse {
  readonly enumFilters?: ReadonlyArray<string>;
}

export type GetEnumFacetDataFunction = (field: string) => EnumFacetResponse;

export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type UpdateFacetFilterHook = () => UpdateFacetFilterFunction;
export type ClearFacetFunction = (field: string) => void;
export type ClearFacetHook = () => ClearFacetFunction;
export type GetTotalCountsFunction = () => number;

export type GetRangeFacetDataFunction = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
) => FacetResponse;

export interface FacetDataHooks {
  useClearFilter: ClearFacetHook;
}

export interface EnumFacetHooks extends FacetDataHooks {
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetFacetData: GetEnumFacetDataFunction;
  useTotalCounts: GetTotalCountsFunction;
}

export interface ValueFacetHooks extends FacetDataHooks {
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetFacetFilters: SelectFacetFilterFunction;
}

export interface RangeFacetHooks extends FacetDataHooks {
  useGetFacetFilters: SelectFacetFilterFunction;
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetFacetData: GetRangeFacetDataFunction;
  useTotalCounts: GetTotalCountsFunction;
}

export interface SetFacetHooks extends FacetDataHooks {
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetFacetValues: (field: string) => OperandValue;
}

export interface FacetRequiredHooks {
  useClearFilter: ClearFacetHook; // clear Facet Filters and remove facet from filter set
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
  useUpdateFacetFilters: UpdateFacetFilterHook; // updates the filters
  useGetEnumFacetData: GetEnumFacetDataFunction; // gets data for EnumFacets and ToggleFacet
  useGetRangeFacetData?: GetRangeFacetDataFunction; // gets the data for Range Facets
  useTotalCounts: GetTotalCountsFunction; // get the totals count by type: cases, files, genes, ssms, projects
}

export interface FacetCardProps<T extends FacetDataHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly valueLabel: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly isFacetView?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly width?: string;
  readonly dismissCallback?: (string) => void;

  readonly header?: {
    readonly Panel?: ComponentType<{ children: ReactNode }>; // optional header component
    readonly Label?: ComponentType<{ children: ReactNode }>; // optional facet label component
    readonly iconStyle?: string; // optional facet button component
  };
}

export type RangeFromOp = ">" | ">=";
export type RangeToOp = "<" | "<=";

export interface FromToRangeValues<T> {
  readonly from?: T;
  readonly to?: T;
}

export interface FromToRange<T> extends FromToRangeValues<T> {
  readonly fromOp?: RangeFromOp;
  readonly toOp?: RangeToOp;
}

export interface StringRange {
  readonly fromOp?: RangeFromOp;
  readonly from?: string;
  readonly toOp?: RangeToOp;
  readonly to?: string;
}

/**
 * Represent a range. Used to configure a row
 * of a range list.
 */
export interface RangeBucketElement {
  readonly from: number;
  readonly to: number;
  readonly key: string; // key for facet range
  readonly label: string; // label for value
  readonly valueLabel?: string; // string representation of the count
  value?: number; // count of items in range
}

/**
 * Sort type for range buckets
 */
export interface SortType {
  type: "value" | "alpha";
  direction: "asc" | "dsc";
}
