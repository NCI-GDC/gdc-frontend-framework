import React, { useState } from "react";
import { Tooltip, Box } from "@mantine/core";
import {
  VictoryAxis,
  VictoryBoxPlot,
  VictoryChart,
  VictoryLabel,
  VictoryLabelProps,
  VictoryScatter,
} from "victory";

interface BoxPlotTooltipProps {
  readonly visible: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly text?: string;
}

const BoxPlotTooltip: React.FC<BoxPlotTooltipProps> = ({
  x,
  y,
  text,
  visible,
}: BoxPlotTooltipProps) => {
  return visible ? (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y}>
        <Tooltip label={text} withArrow opened withinPortal>
          <Box />
        </Tooltip>
      </foreignObject>
    </g>
  ) : null;
};

interface BoxPlotProps {
  readonly data: {
    readonly min: string;
    readonly max: string;
    readonly median: string;
    readonly mean: string;
    readonly q1: string;
    readonly q3: string;
  };
  readonly color: string;
}

const BoxPlot: React.FC<BoxPlotProps> = ({ data, color }: BoxPlotProps) => {
  const [tooltipProps, setShowTooltipProps] = useState<{
    visible: boolean;
    x?: number;
    y?: number;
    text?: string;
  }>({
    visible: false,
  });

  return (
    <VictoryChart
      height={500}
      width={400}
      padding={{ left: 80, right: 20, bottom: 80, top: 80 }}
      minDomain={{ x: 1, y: Number(data.min) }}
      maxDomain={{ x: 1, y: Number(data.max) }}
    >
      <VictoryLabel
        dy={20}
        dx={40}
        text="Box Plot"
        style={{ fontSize: 20, fontFamily: "Noto Sans" }}
      />
      <VictoryAxis dependentAxis />
      <VictoryBoxPlot
        style={{ q1: { fill: color }, q3: { fill: color } }}
        boxWidth={50}
        minLabelComponent={<></>}
        maxLabelComponent={<></>}
        q1LabelComponent={<></>}
        q3LabelComponent={<></>}
        medianLabelComponent={<></>}
        data={[
          {
            x: 1,
            min: data.min,
            median: data.median,
            max: data.max,
            q1: data.q1,
            q3: data.q3,
            mean: data.mean,
          },
        ]}
        events={[
          {
            target: "min",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "minLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps.x,
                        y: labelProps.y,
                        text: `Minimum: ${labelProps.text}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "max",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "maxLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Maximum: ${labelProps.text}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "median",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "medianLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps.x,
                        y: labelProps.y,
                        text: `Median: ${labelProps.text}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "q1",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "q1Labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps.x,
                        y: labelProps.y,
                        text: `Q1: ${labelProps.text}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "q3",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "q3Labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps.x,
                        y: labelProps.y,
                        text: `Q3: ${labelProps.text}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
        ]}
        labels
      />
      <VictoryScatter
        data={[{ y: Number(data.mean), x: 1 }]}
        style={{ data: { fill: "white" } }}
        size={5}
        symbol={"plus"}
        labels={() => ""}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps.x,
                        y: labelProps.y,
                        text: `Mean: ${data.mean}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
        ]}
      />
      <BoxPlotTooltip {...tooltipProps} />
    </VictoryChart>
  );
};

export default BoxPlot;
