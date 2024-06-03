import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Loader } from "@mantine/core";
import EChartWrapper from "@/features/charts/EChartWrapper";
import { EChartsOption } from "echarts";

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
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
  readonly label?: string;
}

const QQPlot: React.FC<QQPlotProps> = ({
  chartValues,
  field,
  isLoading,
  height,
  width,
  color,
  chartRef,
  label = "QQ Plot",
}: QQPlotProps) => {
  const lineValues = useDeepCompareMemo(
    () => (chartValues.length > 0 ? getQ1Q3Line(chartValues) : []),
    [chartValues],
  );

  const chartData = useDeepCompareMemo(
    () => chartValues.map((v) => [v.x, v.y]),
    [chartValues],
  );

  const lineData = useDeepCompareMemo(
    () => lineValues.map((v) => [v.x, v.y]),
    [lineValues],
  );

  const option: EChartsOption = useDeepCompareMemo(
    () => ({
      animation: false,
      aria: {
        label: {
          description: `The QQ Plot displays the Theoretical Normal Quantiles distribution for ${field} values. For detailed information, download the corresponding QQ JSON or QQ TSV files via the “Download image or data” button.`,
        },
      },
      grid: {
        show: false,
        left: 80,
        top: 40,
      },
      title: {
        text: label,
        textAlign: "center",
        left: (width + 50) / 2,
        textStyle: {
          fontWeight: "normal",
          fontSize: 16,
          fontFamily: "Noto Sans",
          color: "black",
          width,
        },
      },
      xAxis: {
        name: "Theoretical Normal Quantiles",
        type: "value",
        splitLine: {
          show: false,
        },
        nameLocation: "middle",
        nameTextStyle: {
          padding: 8,
          fontSize: 12,
          color: "black",
          fontFamily: "Noto Sans",
        },
        axisLabel: {
          fontSize: 12,
          color: "black",
          fontFamily: "Noto Sans",
        },
        axisTick: {
          length: 6,
          lineStyle: {
            color: "black",
          },
        },
      },
      yAxis: {
        name: "Sample Quantiles",
        type: "value",
        axisLine: {
          onZero: false,
        },
        position: "left",
        splitLine: {
          show: false,
        },
        nameLocation: "middle",
        nameTextStyle: {
          padding: 36,
          fontSize: 12,
          color: "black",
          fontFamily: "Noto Sans",
        },
        axisLabel: {
          fontSize: 12,
          color: "black",
          fontFamily: "Noto Sans",
        },
        axisTick: {
          length: 6,
          lineStyle: {
            color: "black",
          },
        },
      },
      color: [color, "black"],
      series: [
        {
          type: "scatter" as const,
          data: chartData,
          large: true,
          symbolSize: 6,
          itemStyle: {
            borderColor: color,
            borderWidth: 2,
            color: "transparent",
          },
        },
        {
          type: "line" as const,
          data: lineData,
          showSymbol: false,
          itemStyle: {
            color: "black",
          },
        },
      ],
    }),
    [chartData, color, lineData, label, width],
  );

  return isLoading ? (
    <Loader />
  ) : chartValues.length < 10 ? (
    <div className="flex justify-center">Not enough data</div>
  ) : (
    <EChartWrapper
      option={option}
      height={height}
      chartRef={chartRef}
      width={width}
    />
  );
};

export default QQPlot;
