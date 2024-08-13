import { FacetCardProps, RangeFacetHooks } from "../types";

export interface NumericFacetProps extends FacetCardProps<RangeFacetHooks> {
  readonly rangeDatatype: string;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly clearValues?: boolean;
}

export interface NumericFacetData
  extends Pick<
    NumericFacetProps,
    "field" | "minimum" | "maximum" | "valueLabel" | "hooks" | "clearValues"
  > {
  isFacetView?: boolean;
  rangeDatatype?: string;
}
