import { FacetCardProps, RangeFacetHooks } from "../../types";

export type NumericFacetProps = Omit<
  FacetCardProps<RangeFacetHooks>,
  "facetName"
> & {
  readonly rangeDatatype?: string;
  readonly minimum: number | undefined;
  readonly maximum: number | undefined;
  readonly clearValues?: boolean;
};

export type NumericUnits = "days" | "years" | "percent" | "year";
