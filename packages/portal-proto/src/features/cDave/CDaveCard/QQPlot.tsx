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
import tailwindConfig from "tailwind.config";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DEMO_COHORT_FILTERS, COLOR_MAP } from "../constants";
import { qnorm } from "../utils";

const getQuantile = (count: number, quantile: number) =>
  Math.ceil(count * (quantile / 4)) - 1;

const getTrendLine = (chartValues: { x: number; y: number }[]) => {
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

interface QQPlotProps {
  readonly field: string;
}

const QQPlot: React.FC<QQPlotProps> = ({ field }: QQPlotProps) => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");
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

  let parsedValues = [];

  if (isSuccess) {
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
  }

  const sortedValues = parsedValues
    .filter((c) => isNumber(c.value))
    .sort((a, b) => a.value - b.value);

  const chartValues = sortedValues.map((caseEntry, i) => ({
    id: caseEntry.id,
    x: qnorm((i + 1 - 0.5) / sortedValues.length),
    y: caseEntry.value,
  }));

  // place yAxis on left side of chart
  const xMin = Math.min(...chartValues.map((v) => Math.floor(v.x)));
  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[clinicalType]]?.DEFAULT;

  return isLoading ? (
    <Loader />
  ) : chartValues.length < 10 ? (
    <>Not enough data</>
  ) : (
    <VictoryChart
      height={500}
      width={400}
      padding={{ left: 80, right: 20, bottom: 80, top: 80 }}
    >
      <VictoryLabel
        dy={20}
        dx={40}
        text="QQ Plot"
        style={{ fontSize: 20, fontFamily: "Noto Sans" }}
      />
      <VictoryAxis
        label="Theoretical Normal Quantiles"
        axisLabelComponent={<VictoryLabel dy={5} />}
      />
      <VictoryAxis
        dependentAxis
        axisValue={xMin}
        label="Sample Quantiles"
        axisLabelComponent={<VictoryLabel dy={-40} />}
      />
      <VictoryScatter data={chartValues} style={{ data: { fill: color } }} />
      <VictoryLine data={getTrendLine(chartValues)} />
    </VictoryChart>
  );
};

export default QQPlot;
