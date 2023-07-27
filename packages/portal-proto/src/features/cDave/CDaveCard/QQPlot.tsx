import React from "react";
import { isNumber } from "lodash";
import { Loader } from "@mantine/core";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
} from "victory";
import {
  useGetCaseSsmsQuery,
  joinFilters,
  FilterSet,
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
} from "@gff/core";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DEMO_COHORT_FILTERS } from "../constants";
import { qnorm } from "../utils";

const getQuantile = (count: number, quantile: number) =>
  Math.ceil(count * (quantile / 4)) - 1;

/**
 * Draws line between Q1 and Q3
 * @param chartValues - sorted list of  value from the normal distribution (x) and values (y)
 * @returns x and y coordinates for points of line
 */
export const getQ1Q3Line = (
  chartValues: { x: number; y: number }[],
): { x: number; y: number }[] => {
  const xMin = Math.min(...chartValues.map((v) => Math.floor(v.x)));
  const xMax = Math.max(...chartValues.map((v) => Math.ceil(v.x)));
  const yMin = Math.min(...chartValues.map((v) => Math.floor(v.y)));
  const yMax = Math.max(...chartValues.map((v) => Math.ceil(v.y)));

  const quantile1Coords = chartValues[getQuantile(chartValues.length, 1)];
  const quantile3Coords = chartValues[getQuantile(chartValues.length, 3)];
  const slope =
    (quantile3Coords.y - quantile1Coords.y) /
    (quantile3Coords.x - quantile1Coords.x);

  // calculate coords for start and end of line with y = mx + b
  // start and end points will equal the y/x min and max OR
  // intercepts, whichever is within plot limits
  const b = quantile1Coords.y - slope * quantile1Coords.x;

  const xAtYMin = (yMin - b) / slope;
  const xAtYMax = (yMax - b) / slope;
  const yAtXMax = slope * xMax + b;
  const yAtXMin = slope * xMin + b;

  return [
    { x: Math.max(xAtYMin, xMin), y: Math.max(yAtXMin, yMin) },
    quantile1Coords,
    quantile3Coords,
    { x: Math.min(xAtYMax, xMax), y: Math.min(yMax, yAtXMax) },
  ];
};

/**
 * Parses response data that either be or simple object or can be nested in arrays up to two levels deep depending on the field
 * @param data response data from request
 * @param field
 * @returns flattened list of ids and values
 */
export const parseNestedResponseData = (
  data: readonly Record<string, any>[],
  field: string,
): { id: string; value: number }[] => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");
  let parsedValues = [];

  data.forEach((caseEntry) => {
    if (Array.isArray(caseEntry[clinicalType])) {
      caseEntry[clinicalType].forEach((nestedVal) => {
        Array.isArray(nestedVal[clinicalField])
          ? (parsedValues = [
              ...parsedValues,
              ...nestedVal[clinicalField].map((valArr) => ({
                id: caseEntry.id,
                value: valArr[clinicalNestedField],
              })),
            ])
          : parsedValues.push({
              id: caseEntry.id,
              value: nestedVal[clinicalField],
            });
      });
    } else {
      parsedValues.push({
        id: caseEntry.id,
        value: caseEntry[clinicalType][clinicalField],
      });
    }
  });

  return parsedValues;
};

interface QQPlotProps {
  readonly field: string;
  readonly color: string;
  readonly height: number;
  readonly width: number;
}

const QQPlot: React.FC<QQPlotProps> = ({
  field,
  height,
  width,
  color,
}: QQPlotProps) => {
  const isDemoMode = useIsDemoApp();

  const missingFilter: FilterSet = {
    root: {
      [`cases.${field}`]: {
        field: `cases.${field}`,
        operator: "exists",
      },
    },
    mode: "and",
  };

  const cohortFilters = useCoreSelector((state) =>
    isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
  );

  const { data, isLoading, isSuccess } = useGetCaseSsmsQuery({
    fields: [field],
    filters: buildCohortGqlOperator(joinFilters(missingFilter, cohortFilters)),
    size: 10000,
  });

  const parsedValues = isSuccess ? parseNestedResponseData(data, field) : [];

  const emptyChart = parsedValues.every((val) => val.value === 0);

  const sortedValues = parsedValues
    .filter((c) => isNumber(c.value))
    .sort((a, b) => a.value - b.value);

  const chartValues = sortedValues.map((caseEntry, i) => ({
    id: caseEntry.id,
    x: qnorm((i + 1 - 0.5) / sortedValues.length),
    y: caseEntry.value,
  }));

  const xMin = Math.floor(Math.min(...chartValues.map((v) => v.x)));
  const yMin = Math.floor(Math.min(...chartValues.map((v) => v.y)));
  const xMax = Math.ceil(Math.max(...chartValues.map((v) => v.x)));
  const yMax = Math.ceil(Math.max(...chartValues.map((v) => v.y)));

  return isLoading ? (
    <Loader />
  ) : chartValues.length < 10 ? (
    <>Not enough data</>
  ) : (
    <VictoryChart
      height={height}
      width={width}
      padding={{ left: 80, right: 20, bottom: 60, top: 50 }}
      minDomain={{ x: xMin, y: yMin < 0 ? yMin : 0 }}
      maxDomain={{ x: xMax, y: yMax }}
    >
      <VictoryLabel
        dy={20}
        dx={60}
        text="QQ Plot"
        style={{ fontSize: 16, fontFamily: "Noto Sans" }}
      />
      <VictoryAxis
        label="Theoretical Normal Quantiles"
        axisLabelComponent={<VictoryLabel dy={5} />}
        tickLabelComponent={emptyChart ? <></> : <VictoryLabel dy={-5} />}
        tickFormat={(t) => Number(t.toFixed())}
        tickCount={8}
        style={{ ticks: { stroke: "black", size: 8 } }}
        crossAxis={false}
      />
      <VictoryAxis
        dependentAxis
        axisValue={xMin}
        label="Sample Quantiles"
        axisLabelComponent={<VictoryLabel dy={-40} />}
        tickLabelComponent={emptyChart ? <></> : <VictoryLabel dx={5} />}
        style={{ ticks: { stroke: "black", size: 8 } }}
        crossAxis={false}
      />
      <VictoryScatter
        data={chartValues}
        style={{ data: { stroke: color, strokeWidth: 2, fill: "none" } }}
      />
      <VictoryLine data={getQ1Q3Line(chartValues)} />
    </VictoryChart>
  );
};

export default QQPlot;
