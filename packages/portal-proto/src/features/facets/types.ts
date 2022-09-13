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

export type GetFacetDataFunction = (field: string) => FacetResponse;
export type GetFacetEnumDataFunction = (field: string) => EnumFacetResponse;
export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type ClearFacetFunction = (field: string) => void;

export interface FacetCardProps {
  readonly field: string;
  readonly docType: GQLDocType;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly indexType?: GQLIndexType;
  readonly width?: string;
  readonly dismissCallback?: (string) => void;
  readonly clearFilterFunc?: ClearFacetFunction;
}

export interface EnumFacetCardProps extends FacetCardProps {
  readonly facetDataFunc?: (
    field: string,
    docType: GQLDocType,
    indexType: GQLIndexType,
  ) => EnumFacetResponse;
  readonly updateEnumsFunc?: (
    enumerationFilters: EnumOperandValue,
    field: string,
  ) => void;
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
