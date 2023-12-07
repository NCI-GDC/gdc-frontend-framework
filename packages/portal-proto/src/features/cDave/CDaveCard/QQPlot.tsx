import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Loader } from "@mantine/core";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
  VictoryContainer,
} from "victory";

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

interface QQPlotProps {
  readonly chartValues: { id: string; x: number; y: number }[];
  readonly field: string;
  readonly isLoading: boolean;
  readonly color: string;
  readonly height: number;
  readonly width: number;
  readonly chartPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
  readonly label?: string;
}

const QQPlot: React.FC<QQPlotProps> = ({
  chartValues,
  field,
  isLoading,
  height,
  width,
  chartPadding = { left: 80, right: 20, bottom: 60, top: 50 },
  color,
  chartRef,
  label = "QQ Plot",
}: QQPlotProps) => {
  const emptyChart = chartValues.every((val) => val.x === 0);

  const xMin = Math.floor(Math.min(...chartValues.map((v) => v.x)));
  const yMin = Math.floor(Math.min(...chartValues.map((v) => v.y)));
  const xMax = Math.ceil(Math.max(...chartValues.map((v) => v.x)));
  const yMax = Math.ceil(Math.max(...chartValues.map((v) => v.y)));

  const lineValues = useDeepCompareMemo(
    () => (chartValues.length > 0 ? getQ1Q3Line(chartValues) : []),
    [chartValues],
  );

  return isLoading ? (
    <Loader />
  ) : chartValues.length < 10 ? (
    <>Not enough data</>
  ) : (
    <VictoryChart
      height={height}
      width={width}
      padding={chartPadding}
      minDomain={{ x: xMin, y: yMin < 0 ? yMin : 0 }}
      maxDomain={{ x: xMax, y: yMax }}
      containerComponent={
        <VictoryContainer
          containerRef={
            chartRef ? (ref) => (chartRef.current = ref) : undefined
          }
          aria-labelledby={`${field}-qq-plot-label`}
        />
      }
    >
      <VictoryLabel
        dy={20}
        dx={(width + chartPadding.left - chartPadding.right) / 2}
        text={label}
        style={{ fontSize: 16, fontFamily: "Noto Sans" }}
        textAnchor="middle"
        id={`${field}-qq-plot-label`}
      />
      <VictoryAxis
        label="Theoretical Normal Quantiles"
        axisLabelComponent={<VictoryLabel dy={5} />}
        tickLabelComponent={<VictoryLabel dy={-5} />}
        tickFormat={(t) => Number(t.toFixed())}
        tickCount={8}
        style={{ ticks: { stroke: "black", size: 8 } }}
        crossAxis={false}
        orientation="bottom"
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
        groupComponent={<g />}
      />
      <VictoryLine data={lineValues} />
    </VictoryChart>
  );
};

export default QQPlot;
