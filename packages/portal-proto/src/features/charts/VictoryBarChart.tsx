import { Tooltip } from "@mantine/core";
import React from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTooltip,
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
  console.log("datum", datum);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject>
        <Tooltip
          label={
            <>
              {datum.fullName}: {datum.y.toLocaleString()} (
              {(datum.y / datum.yTotal).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })}
              )
            </>
          }
          withArrow
          opened
        >
          <></>
        </Tooltip>
      </foreignObject>
    </g>
  );
};

const BarChartLabel = (props) => {
  console.log(props);
  return (
    <text
      x={props.x}
      y={props.y}
      text-anchor="start"
      transform={`rotate(${props.angle},${props.x}, ${props.y + 15})`}
      style={props.style}
    >
      {props.text}
    </text>
  );
};

interface VictoryBarChartProps {
  readonly data: any;
  readonly color: string;
  readonly yLabel: string;
  readonly width?: number;
  readonly height?: number;
}

const VictoryBarChart: React.FC<VictoryBarChartProps> = ({
  data,
  color,
  yLabel,
  width = 400,
  height = 400,
}: VictoryBarChartProps) => {
  return (
    <VictoryChart width={width} height={height} domainPadding={60} padding={80}>
      <VictoryAxis
        dependentAxis
        label={yLabel}
        axisLabelComponent={<VictoryLabel dy={-40} />}
        style={{
          tickLabels: { fontSize: 20 },
          grid: { stroke: "#F5F5F5", strokeWidth: 1 },
          axisLabel: { fontSize: 20 },
        }}
      />
      <VictoryAxis
        style={{ tickLabels: { angle: 45, fontSize: 24 } }}
        tickLabelComponent={<BarChartLabel />}
      />
      <VictoryBar
        data={data}
        style={{ data: { fill: color } }}
        labels={() => ""}
        labelComponent={
          <VictoryTooltip flyoutComponent={<BarChartTooltip />} />
        }
      />
    </VictoryChart>
  );
};

export default VictoryBarChart;
