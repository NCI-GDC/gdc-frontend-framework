import {
  EnumOperandValue,
  GQLDocType,
  GQLIndexType,
  NumericFromTo,
  Operation,
} from "@gff/core";

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

export type GetFacetDataFunction = <T extends FacetResponse = FacetResponse>(
  field: string,
) => T;

export type GetEnumFacetDataFunction = (field: string) => EnumFacetResponse;

export type GetFacetDataFromDocAndIndexFunction = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
) => EnumFacetResponse;

export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type UpdateFacetFilterHook = () => UpdateFacetFilterFunction;
export type ClearFacetFunction = (field: string) => void;
export type ClearFacetHook = () => ClearFacetFunction;
export type GetTotalCountsFunction = () => number;
export type updateArrayFilterValues = (
  field: string,
  enumerationFilters: EnumOperandValue,
) => void;

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

export interface AllHooks {
  useClearFilter: ClearFacetHook; // clear Facet Filters and remove facet from filter set
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
  useUpdateFacetFilters: UpdateFacetFilterHook; // updates the filters
  useGetEnumFacetData: GetFacetDataFromDocAndIndexFunction; // gets data for EnumFacets and ToggleFacet
  useGetRangeFacetData: GetRangeFacetDataFunction; // gets the data for Range Facets
  useTotalCounts: GetTotalCountsFunction; // get the totals count by type: cases, files, genes, ssms, projects
}

export interface FacetCardProps<T extends FacetDataHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly description?: string;
  readonly valueLabel?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly width?: string;
  readonly dismissCallback?: (string) => void;
}

export type RangeFromOp = ">" | ">=";
export type RangeToOp = "<" | "<=";

export interface FromToRange<T> {
  readonly fromOp?: RangeFromOp;
  readonly from?: T;
  readonly toOp?: RangeToOp;
  readonly to?: T;
}

export interface StringRange {
  readonly fromOp?: RangeFromOp;
  readonly from?: string;
  readonly toOp?: RangeToOp;
  readonly to?: string;
}
