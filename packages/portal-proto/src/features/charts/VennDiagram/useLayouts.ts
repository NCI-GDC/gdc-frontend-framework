import { useState, useCallback, useEffect } from "react";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import { EChartsOption, ElementEvent, GraphicComponentOption } from "echarts";
import { GraphicComponentGroupOption, VennDiagramProps } from "./types";

const HIGHLIGHT_COLOR = "#a5d5d9";

// Coordinates where circles intersect, calculated with this: https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
const c1c2I = [
  { x: 200, y: 63.397 },
  { x: 200, y: 236.603 },
];

const c2c3I = [
  { x: 299.162, y: 237.081 },
  { x: 150.838, y: 162.919 },
];

const c1c3I = [
  { x: 249.162, y: 162.919 },
  { x: 100.838, y: 237.081 },
];

const style = {
  fill: "#f0f0f0",
  stroke: "#5c5c5c",
  lineWidth: 2,
  opacity: 1,
};

/*
  Create venn diagram by drawing circles and then drawing the overlaps over top with svg paths.
  Bezier control points calculated with this: https://stackoverflow.com/questions/734076/how-to-best-approximate-a-geometrical-arc-with-a-bezier-curve/44829356#44829356
*/
export const threeCircleLayout: GraphicComponentOption[] = [
  {
    type: "circle",
    id: "S1_minus_S2_union_S3",
    left: 50,
    top: 50,
    shape: {
      r: 100,
    },
    z: 100,
    style,
  },
  {
    type: "circle",
    id: "S2_minus_S1_union_S3",
    left: 150,
    top: 50,
    shape: {
      r: 100,
    },
    z: 100,
    style,
  },
  {
    type: "circle",
    id: "S3_minus_S1_union_S2",
    left: 100,
    top: 150,
    shape: {
      r: 100,
    },
    z: 100,
    style,
  },
  {
    type: "group",
    id: "S1_intersect_S2_minus_S3",
    children: [
      {
        type: "polygon",
        id: "S1_intersect_S2_minus_S3.1",
        shape: {
          points: [
            [c1c2I[0].x, c1c2I[0].y],
            [c1c3I[0].x, c1c3I[0].y],
            [c2c3I[1].x, c2c3I[1].y],
            [c1c2I[0].x, c1c2I[0].y],
          ],
        },
        style: {
          fill: "#f0f0f0",
          lineWidth: 0,
          opacity: 1,
        },
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2_minus_S3.2",
        shape: {
          x1: c1c2I[0].x,
          y1: c1c2I[0].y,
          x2: c1c3I[0].x,
          y2: c1c3I[0].y,
          cpx1: 234.98544598196034,
          cpy1: 83.59574945553868,
          cpx2: 254.38095288432208,
          cpy2: 122.86003212979747,
        },
        style,
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2_minus_S3.3",
        shape: {
          x1: c2c3I[1].x,
          y1: c2c3I[1].y,
          x2: c1c2I[0].x,
          y2: c1c2I[0].y,
          cpx1: 145.61910914291738,
          cpy1: 122.86050823051119,
          cpx2: 165.01496981996087,
          cpy2: 83.59550939346161,
        },
        style,
        z: 150,
      },
    ],
  },
  {
    type: "group",
    id: "S1_intersect_S3_minus_S2",
    children: [
      {
        type: "polygon",
        id: "S1_intersect_S3_minus_S2.1",
        shape: {
          points: [
            [c1c3I[1].x, c1c3I[1].y],
            [c2c3I[1].x, c2c3I[1].y],
            [c1c2I[1].x, c1c2I[1].y],
            [c1c3I[1].x, c1c3I[1].y],
          ],
        },
        style: {
          fill: "#f0f0f0",
          lineWidth: 0,
          opacity: 1,
        },
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S3_minus_S2.2",
        shape: {
          x1: c2c3I[1].x,
          y1: c2c3I[1].y,
          x2: c1c3I[1].x,
          y2: c1c3I[1].y,
          cpx1: 123.4286192684544,
          cpy1: 178.39309854645958,
          cpx2: 104.9043496017597,
          cpy2: 205.86903628688776,
        },
        style,
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S3_minus_S2.3",
        shape: {
          x1: c1c3I[1].x,
          y1: c1c3I[1].y,
          x2: c1c2I[1].x,
          y2: c1c2I[1].y,
          cpx1: 131.6486559298548,
          cpy1: 254.47530492097613,
          cpx2: 169.35843276307335,
          cpy2: 254.29390277549342,
        },
        style,
        z: 150,
      },
    ],
  },
  {
    type: "group",
    id: "S2_intersect_S3_minus_S1",
    children: [
      {
        type: "polygon",
        id: "S2_intersect_S3_minus_S1.1",
        shape: {
          points: [
            [c1c3I[0].x, c1c3I[0].y],
            [c2c3I[0].x, c2c3I[0].y],
            [c1c2I[1].x, c1c2I[1].y],
            [c1c3I[0].x, c1c3I[0].y],
          ],
        },
        style: {
          fill: "#f0f0f0",
          lineWidth: 0,
          opacity: 1,
        },
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S2_intersect_S3_minus_S1.2",
        shape: {
          x1: c1c3I[0].x,
          y1: c1c3I[0].y,
          x2: c2c3I[0].x,
          y2: c2c3I[0].y,
          cpx1: 276.57138073154556,
          cpy1: 178.39309854645956,
          cpx2: 295.09565039824025,
          cpy2: 205.8690362868878,
        },
        style,
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S2_intersect_S3_minus_S1.3",
        shape: {
          x1: c2c3I[0].x,
          y1: c2c3I[0].y,
          x2: c1c2I[1].x,
          y2: c1c2I[1].y,
          cpx1: 268.3512766705979,
          cpy1: 254.4753429717167,
          cpx2: 230.64159888490266,
          cpy2: 254.29384147483498,
        },
        style,
        z: 150,
      },
    ],
  },
  {
    type: "group",
    id: "S1_intersect_S2_intersect_S3",
    children: [
      {
        type: "polygon",
        id: "S1_intersect_S2_intersect_S3.1",
        shape: {
          points: [
            [c1c3I[0].x, c1c3I[0].y],
            [c1c2I[1].x, c1c2I[1].y],
            [c2c3I[1].x, c2c3I[1].y],
            [c1c3I[0].x, c1c3I[0].y],
          ],
        },
        style: {
          fill: "#f0f0f0",
          lineWidth: 0,
          opacity: 1,
        },
        z: 200,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2_intersect_S3.2",
        shape: {
          x1: c2c3I[1].x,
          y1: c2c3I[1].y,
          x2: c1c3I[0].x,
          y2: c1c3I[0].y,
          cpx1: 181.34938847920316,
          cpy1: 145.69364796666798,
          cpx2: 218.65061152079684,
          cpy2: 145.69364796666798,
        },
        style,
        z: 200,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2_intersect_S3.3",
        shape: {
          x1: c1c3I[0].x,
          y1: c1c3I[0].y,
          x2: c1c2I[1].x,
          y2: c1c2I[1].y,
          cpx1: 245.13952368754042,
          cpy1: 193.79420675718842,
          cpx2: 226.9648205037493,
          cpy2: 221.03493624715696,
        },
        style,
        z: 200,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2_intersect_S3.4",
        shape: {
          x1: c1c2I[1].x,
          y1: c1c2I[1].y,
          x2: c2c3I[1].x,
          y2: c2c3I[1].y,
          cpx1: 173.03467223098613,
          cpy1: 221.03464337897427,
          cpx2: 154.86055198374063,
          cpy2: 193.79478758508313,
        },
        style,
        z: 200,
      },
    ],
  },
];

const twoCircleI = [
  { x: 200, y: 113.397 },
  { x: 200, y: 286.603 },
];

export const twoCircleLayout: GraphicComponentOption[] = [
  {
    type: "circle",
    id: "S1_minus_S2",
    left: 50,
    top: 100,
    shape: {
      r: 100,
    },
    style,
    z: 100,
  },
  {
    type: "circle",
    id: "S2_minus_S1",
    left: 150,
    top: 100,
    shape: {
      r: 100,
    },
    style,
    z: 100,
  },
  {
    type: "group",
    id: "S1_intersect_S2",
    children: [
      {
        type: "bezierCurve",
        id: "S1_intersect_S2.1",
        shape: {
          x1: twoCircleI[0].x,
          y1: twoCircleI[0].y,
          x2: twoCircleI[1].x,
          y2: twoCircleI[1].y,
          cpx1: 266.6671973922771,
          cpy1: 151.88712008375987,
          cpx2: 266.6671973922771,
          cpy2: 248.11287991624016,
        },
        style,
        z: 150,
      },
      {
        type: "bezierCurve",
        id: "S1_intersect_S2.2",
        shape: {
          x1: twoCircleI[1].x,
          y1: twoCircleI[1].y,
          x2: twoCircleI[0].x,
          y2: twoCircleI[0].y,
          cpx1: 133.3328026077229,
          cpy1: 248.11287991624016,
          cpx2: 133.3328026077229,
          cpy2: 151.88712008375987,
        },
        style,
        z: 150,
      },
    ],
  },
];

export const threeCircleLabelLayout = {
  S1_minus_S2_union_S3: { x: 110, y: 115 },
  S2_minus_S1_union_S3: { x: 290, y: 115 },
  S3_minus_S1_union_S2: { x: 255, y: 210 },
  S1_intersect_S2_minus_S3: { x: 200, y: 115 },
  S1_intersect_S3_minus_S2: { x: 145, y: 210 },
  S2_intersect_S3_minus_S1: { x: 200, y: 290 },
  S1_intersect_S2_intersect_S3: { x: 200, y: 185 },
};

export const twoCircleLabelLayout = {
  S1_minus_S2: { x: 100, y: 200 },
  S2_minus_S1: { x: 300, y: 200 },
  S1_intersect_S2: { x: 200, y: 200 },
};

const threeCircleOuterLabelLayout = [
  {
    type: "text",
    left: 55,
    top: 55,
  },
  {
    type: "text",
    left: 340,
    top: 55,
  },
  {
    type: "text",
    left: 200,
    top: 375,
  },
];

const twoCircleOuterLabelLayout = [
  {
    type: "text",
    left: 20,
    top: 200,
  },
  {
    type: "text",
    left: 380,
    top: 200,
  },
];

const chartConfig: EChartsOption = {
  xAxis: {
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  grid: {
    show: false,
  },
};

const addHighlight = (
  chartLayout: GraphicComponentOption[],
  highlightedIndices: string[],
) => {
  return chartLayout.map((group: GraphicComponentGroupOption) => {
    if (highlightedIndices.includes(group.id)) {
      if (group?.children) {
        return {
          ...group,
          children: group.children.map((child) => ({
            ...child,
            style: {
              ...child.style,
              fill: HIGHLIGHT_COLOR,
            },
          })),
        };
      } else {
        return {
          ...group,
          style: {
            ...group.style,
            fill: HIGHLIGHT_COLOR,
          },
        };
      }
    } else {
      return group;
    }
  });
};

type UseLayoutProps = VennDiagramProps & {
  readonly highlightedIndices: string[];
};

export const useLayout = ({
  chartData,
  highlightedIndices,
  labels,
  ariaLabel,
  onClickHandler,
  interactable,
}: UseLayoutProps): EChartsOption => {
  const twoCircles = chartData.length === 3;
  const [chartLayout, setChartLayout] = useState<GraphicComponentOption[]>(
    twoCircles
      ? addHighlight(twoCircleLayout, highlightedIndices)
      : addHighlight(threeCircleLayout, highlightedIndices),
  );
  const [option, setOption] = useState<EChartsOption>({});

  const labelLayout = twoCircles
    ? twoCircleLabelLayout
    : threeCircleLabelLayout;
  const outerLabelLayout = twoCircles
    ? twoCircleOuterLabelLayout
    : threeCircleOuterLabelLayout;

  const onmouseover = useDeepCompareCallback(
    (event: ElementEvent) => {
      // If the event is from a child element, parse the parent id to use
      const eventId = String(event.target.id);
      const id = eventId.includes(".") ? eventId.split(".")[0] : eventId;
      setChartLayout(
        twoCircles
          ? addHighlight(twoCircleLayout, [...highlightedIndices, id])
          : addHighlight(threeCircleLayout, [...highlightedIndices, id]),
      );
    },
    [highlightedIndices, twoCircles],
  );

  const onmouseout = useDeepCompareCallback(() => {
    setChartLayout(
      twoCircles
        ? addHighlight(twoCircleLayout, highlightedIndices)
        : addHighlight(threeCircleLayout, highlightedIndices),
    );
  }, [twoCircles, highlightedIndices]);

  const onclick = useCallback(
    (event: ElementEvent) => {
      // If the event is from a child element, parse the parent id to use
      const eventId = String(event.target.id);
      const id = eventId.includes(".") ? eventId.split(".")[0] : eventId;
      onClickHandler(id);
    },
    [onClickHandler],
  );

  const addEvents = useCallback(
    (chartLayout: GraphicComponentOption[], interactable: boolean) => {
      return interactable
        ? chartLayout.map((section) => ({
            ...section,
            onmouseover,
            onmouseout,
            onclick,
          }))
        : chartLayout;
    },
    [onmouseover, onmouseout, onclick],
  );

  useEffect(() => {
    setChartLayout(
      twoCircles
        ? addHighlight(twoCircleLayout, highlightedIndices)
        : addHighlight(threeCircleLayout, highlightedIndices),
    );
  }, [highlightedIndices, twoCircles]);

  useDeepCompareEffect(() => {
    const fullChartOption = {
      ...chartConfig,
      aria: {
        label: {
          description: ariaLabel,
        },
      },
      graphic: [
        ...addEvents(chartLayout, interactable),
        ...outerLabelLayout.map((labelConfig, idx) => ({
          ...labelConfig,
          style: {
            text: labels[idx],
            textAlign: "middle",
            fill: "#333333",
          },
        })),
      ],
      series: [
        {
          type: "custom" as const,
          z: 300,
          renderItem: (params, api) => {
            return {
              type: "text",
              ...labelLayout[chartData[params.dataIndex].key],
              style: {
                text: String(api.value(0)),
                textAlign: "middle",
                fill: "#333333",
              },
            };
          },
          data: chartData,
        },
      ],
    };

    setOption(fullChartOption);
  }, [
    chartLayout,
    addEvents,
    highlightedIndices,
    interactable,
    labels,
    outerLabelLayout,
    chartData,
    labelLayout,
    ariaLabel,
  ]);

  return option;
};
