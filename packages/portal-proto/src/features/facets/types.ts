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
  readonly clearFilterFunc?: (string) => void;
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

export type GetFacetDataFunction = (field: string) => FacetResponse;
export type SelectFacetValueFunction = (field: string) => Operation;
export type UpdateFacetValueFunction = (field: string, op: Operation) => void;
