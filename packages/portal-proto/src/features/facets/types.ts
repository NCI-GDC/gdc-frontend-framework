import {
  EnumOperandValue,
  GQLDocType,
  GQLIndexType,
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
export type GetFacetDataFromDocAndIndexFunction = <
  T extends FacetResponse = EnumFacetResponse,
>(
  field: string,
  docType?: GQLDocType,
  indexType?: GQLIndexType,
) => T;
export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type ClearFacetFunction = (field: string) => void;
export type GetTotalCountsFunction = (countName: string) => number;
export type updateArrayFilterValues = (
  field: string,
  enumerationFilters: EnumOperandValue,
) => void;

export interface FacetDataFunctions {
  getFacetFilters: SelectFacetFilterFunction;
  updateFacetFilters: UpdateFacetFilterFunction;
  clearFacetFilters: ClearFacetFunction;
  getTotalCounts?: GetTotalCountsFunction;
  getFacetData?: GetFacetDataFunction | GetFacetDataFromDocAndIndexFunction;
}

export interface FacetCardProps {
  readonly field: string;
  dataFunctions: FacetDataFunctions;
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
