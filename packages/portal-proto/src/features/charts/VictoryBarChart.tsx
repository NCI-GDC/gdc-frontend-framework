import { Box, Tooltip } from "@mantine/core";
import React, { useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLabelProps,
  VictoryTooltip,
  Bar,
} from "victory";

interface BarChartTooltipProps {
  readonly x?: number;
  readonly y?: number;
  readonly datum?: any;
}

const BarChartTooltip: React.FC<BarChartTooltipProps> = ({
  x,
  y,
  datum,
}: BarChartTooltipProps) => {
  return (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y}>
        <Tooltip
          label={
            <>
              {datum.fullName}: {datum.yCount.toLocaleString()} (
              {(datum.yCount / datum.yTotal).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })}
              )
            </>
          }
          withArrow
          opened
          withinPortal
        >
          <Box />
        </Tooltip>
      </foreignObject>
    </g>
  );
};

const BarChartLabel: React.FC<VictoryLabelProps & { index?: number }> = ({
  text,
  x,
  y,
  style,
  angle,
  data,
  index,
}: VictoryLabelProps & { index?: number }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <g>
      <text
        x={x}
        y={y}
        text-anchor="start"
        transform={`rotate(${angle},${x - 5}, ${y})`}
        style={style as Record<string, string>}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
      >
        {text}
      </text>
      {showTooltip && (
        <BarChartTooltip x={x + 20} y={y - 20} datum={data[index]} />
      )}
    </g>
  );
};

interface VictoryBarChartProps {
  readonly data: any;
  readonly color: string;
  readonly yLabel?: string;
  readonly xLabel?: string;
  readonly width?: number;
  readonly height?: number;
  readonly hideXTicks?: boolean;
}

const VictoryBarChart: React.FC<VictoryBarChartProps> = ({
  data,
  color,
  yLabel,
  xLabel,
  width = 400,
  height = 400,
  hideXTicks = false,
}: VictoryBarChartProps) => {
  return (
    <VictoryChart
      width={width}
      height={height}
      domainPadding={60}
      padding={{ left: 80, right: 80, bottom: 80, top: 10 }}
    >
      <VictoryAxis
        dependentAxis
        label={yLabel}
        axisLabelComponent={<VictoryLabel dy={-70} />}
        style={{
          tickLabels: { fontSize: 25 },
          grid: { stroke: "#F5F5F5", strokeWidth: 1 },
          axisLabel: { fontSize: 25 },
        }}
      />
      <VictoryAxis
        style={{
          tickLabels: { angle: 45, fontSize: 25 },
          axisLabel: { fontSize: 25 },
        }}
        tickLabelComponent={hideXTicks ? <></> : <BarChartLabel data={data} />}
        label={xLabel}
      />
      <VictoryBar
        data={data}
        style={{ data: { fill: color } }}
        labels={() => ""}
        labelComponent={
          <VictoryTooltip flyoutComponent={<BarChartTooltip />} />
        }
        domain={data.length <= 2 ? { x: [0, 5] } : undefined}
        barWidth={data.length === 1 ? 100 : undefined}
        dataComponent={
          <Bar
            tabIndex={0}
            ariaLabel={({ datum }) => `x: ${datum.x}, y: ${datum.y}`}
            //  https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/756 https://www.w3.org/TR/graphics-aria-1.0/#graphics-symbol
            // eslint-disable-next-line
            role="graphics-symbol"
          />
        }
      />
    </VictoryChart>
  );
};

export default VictoryBarChart;
