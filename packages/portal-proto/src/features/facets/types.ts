import {
  FacetDefinition,
  NumericFromTo,
  OperandValue,
  Operation,
} from "@gff/core";
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
export type GetTotalCountsFunction = (field?: string) => number;

export type GetRangeFacetDataFunction = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
) => FacetResponse;

export type EnumFacetHooks = FacetCommonHooks & {
  useGetEnumFacetData: GetEnumFacetDataFunction; // gets data for EnumFacets and ToggleFacet
};

export type ValueFacetHooks = FacetCommonHooks & {
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
};

export type RangeFacetHooks = FacetCommonHooks & {
  useGetRangeFacetData: GetRangeFacetDataFunction; // gets the data for Range Facets
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
};

export type SetFacetHooks = FacetCommonHooks & {
  useGetFacetValues: (field: string) => OperandValue;
};

export interface FacetCommonHooks {
  useClearFilter: ClearFacetHook; // clear Facet Filters and remove facet from filter set
  useUpdateFacetFilters: UpdateFacetFilterHook; // updates the filters
  useTotalCounts: GetTotalCountsFunction; // get the totals count by type: cases, files, genes, ssms, projects
  useToggleExpandFilter?: () => (field: string, expanded: boolean) => void;
  useFilterExpanded?: (field: string) => boolean;
}

export type FacetRequiredHooks =
  | EnumFacetHooks
  | ValueFacetHooks
  | RangeFacetHooks
  | SetFacetHooks;

export interface FacetCardProps<T extends FacetCommonHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly valueLabel: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly facetTitle?: string;
  readonly facetBtnToolTip?: string;
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

export type FacetCardDefinition = FacetDefinition & {
  name?: string;
  toolTip?: string;
};
