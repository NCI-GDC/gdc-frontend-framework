import { FacetCardProps, RangeFacetHooks } from "../types";

export interface NumericFacetProps extends FacetCardProps<RangeFacetHooks> {
  readonly rangeDatatype: string;
  readonly minimum: number | undefined;
  readonly maximum: number | undefined;
  readonly clearValues?: boolean;
  readonly queryOptions?: Record<string, string>;
  readonly Chart?: React.FC<any>;
}

export interface NumericFacetData
  extends Pick<
    NumericFacetProps,
    | "field"
    | "minimum"
    | "maximum"
    | "valueLabel"
    | "hooks"
    | "clearValues"
    | "queryOptions"
    | "Chart"
  > {
  isFacetView?: boolean;
  rangeDatatype?: string;
}

export type NumericUnits = "days" | "years" | "percent" | "year";
