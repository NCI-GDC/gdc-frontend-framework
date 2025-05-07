import { NumericFacetCardProps } from "../../types";

export type NumericFacetProps = Omit<NumericFacetCardProps, "facetName"> & {
  readonly rangeDatatype?: string;
  readonly minimum: number | undefined;
  readonly maximum: number | undefined;
  readonly clearValues?: boolean;
  readonly isFacetView: boolean;
};

export type NumericUnits = "days" | "years" | "percent" | "year";
