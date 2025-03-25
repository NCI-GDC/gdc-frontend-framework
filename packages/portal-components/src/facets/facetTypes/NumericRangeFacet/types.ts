import { FacetCardProps, RangeFacetHooks } from "../../types";

export type NumericFacetProps = FacetCardProps<RangeFacetHooks> & {
  readonly rangeDatatype?: string;
  readonly minimum: number | undefined;
  readonly maximum: number | undefined;
  readonly clearValues?: boolean;
};

export type NumericUnits = "days" | "years" | "percent" | "year";
