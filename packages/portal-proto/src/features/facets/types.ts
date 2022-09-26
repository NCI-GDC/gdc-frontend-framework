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

export type GetFacetDataFromDocAndIndexFunction = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
) => EnumFacetResponse;

export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type UpdateFacetFilterHook = () => UpdateFacetFilterFunction;
export type ClearFacetHook = () => (field: string) => void;
export type GetTotalCountsFunction = (countName: string) => number;
export type updateArrayFilterValues = (
  field: string,
  enumerationFilters: EnumOperandValue,
) => void;

export type GetRangeFacetDataFunction = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
) => FacetResponse;

export interface FacetDataHooks {
  useClearFilter: ClearFacetHook;
}

export interface EnumFacetHooks extends FacetDataHooks {
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetFacetData: GetFacetDataFromDocAndIndexFunction;
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
  useClearFilter: ClearFacetHook;
  useGetFacetFilters: SelectFacetFilterFunction;
  useUpdateFacetFilters: UpdateFacetFilterHook;
  useGetEnumFacetData: GetFacetDataFromDocAndIndexFunction;
  useGetRangeFacetData: GetRangeFacetDataFunction;
  useTotalCounts: GetTotalCountsFunction;
}

export interface FacetCardProps<T extends FacetDataHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly docType?: GQLDocType;
  readonly indexType?: GQLIndexType;
  readonly description?: string;
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
