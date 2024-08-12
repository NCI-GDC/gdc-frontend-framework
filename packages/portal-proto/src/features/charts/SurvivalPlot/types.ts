import { Survival } from "@gff/core";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { entityMetadataType } from "src/utils/contexts";

export enum SurvivalPlotTypes {
  gene = "gene",
  mutation = "mutation",
  categorical = "categorical",
  continuous = "continuous",
  overall = "overall",
  cohortComparison = "cohortComparison",
}

export type UseSurvivalType = (
  data: any,
  xDomain: any,
  setXDomain: any,
  height: number,
  setTooltip?: (x?: any) => any,
  setEntityMetadata?: Dispatch<SetStateAction<entityMetadataType>>,
) => MutableRefObject<any>;

export interface SurvivalPlotProps {
  readonly data: Survival;
  readonly names?: ReadonlyArray<string>;
  readonly plotType?: SurvivalPlotTypes;
  readonly title?: string;
  readonly hideLegend?: boolean;
  readonly height?: number;
  readonly field?: string;
  readonly downloadFileName?: string;
  readonly tableTooltip?: boolean;
  readonly noDataMessage?: string;
  readonly isLoading?: boolean;
}

export interface SurvivalPlotLegend {
  key: string;
  style?: Record<string, string | number>;
  value: string | JSX.Element;
}
export const MINIMUM_CASES = 10;
export const MAXIMUM_CURVES = 5;
