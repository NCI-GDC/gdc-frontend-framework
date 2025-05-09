import { useState, useCallback, useMemo, useEffect } from "react";
import { EChartsOption, ElementEvent, GraphicComponentOption } from "echarts";
import { GraphicComponentGroupOption, VennDiagramProps } from "./types";

// TODO: move out most of these into separate files and make useLayout function much cleaner
// https://gdc-ctds.atlassian.net/browse/PEAR-2393
const SELECTED_COLOR = "#A5D5D9";
const HOVER_COLOR = "#8DC8CC";
const HOVER_SELECTED_COLOR = "#7FBCC0";
const NOT_ALLOWED_HIGHLIGHT_COLOR = "#9b9b9b";
const NOT_ALLOWED_TEXT = "#0A0A0A";

const BASE_WIDTH = 400;
const BASE_HEIGHT = 400;

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
export const createThreeCircleLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
): GraphicComponentOption[] => {
  return [
    {
      type: "circle",
      id: "S1_minus_S2_union_S3",
      left: 50 * scaleFactor + xOffset,
      top: 50 * scaleFactor + yOffset,
      shape: {
        r: 100 * scaleFactor,
      },
      z: 100,
      style: {
        ...style,
        lineWidth: 2 * scaleFactor,
      },
    },
    {
      type: "circle",
      id: "S2_minus_S1_union_S3",
      left: 150 * scaleFactor + xOffset,
      top: 50 * scaleFactor + yOffset,
      shape: {
        r: 100 * scaleFactor,
      },
      z: 100,
      style: {
        ...style,
        lineWidth: 2 * scaleFactor,
      },
    },
    {
      type: "circle",
      id: "S3_minus_S1_union_S2",
      left: 100 * scaleFactor + xOffset,
      top: 150 * scaleFactor + yOffset,
      shape: {
        r: 100 * scaleFactor,
      },
      z: 100,
      style: {
        ...style,
        lineWidth: 2 * scaleFactor,
      },
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
              [
                c1c2I[0].x * scaleFactor + xOffset,
                c1c2I[0].y * scaleFactor + yOffset,
              ],
              [
                c1c3I[0].x * scaleFactor + xOffset,
                c1c3I[0].y * scaleFactor + yOffset,
              ],
              [
                c2c3I[1].x * scaleFactor + xOffset,
                c2c3I[1].y * scaleFactor + yOffset,
              ],
              [
                c1c2I[0].x * scaleFactor + xOffset,
                c1c2I[0].y * scaleFactor + yOffset,
              ],
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
            x1: c1c2I[0].x * scaleFactor + xOffset,
            y1: c1c2I[0].y * scaleFactor + yOffset,
            x2: c1c3I[0].x * scaleFactor + xOffset,
            y2: c1c3I[0].y * scaleFactor + yOffset,
            cpx1: 234.98544598196034 * scaleFactor + xOffset,
            cpy1: 83.59574945553868 * scaleFactor + yOffset,
            cpx2: 254.38095288432208 * scaleFactor + xOffset,
            cpy2: 122.86003212979747 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 150,
        },
        {
          type: "bezierCurve",
          id: "S1_intersect_S2_minus_S3.3",
          shape: {
            x1: c2c3I[1].x * scaleFactor + xOffset,
            y1: c2c3I[1].y * scaleFactor + yOffset,
            x2: c1c2I[0].x * scaleFactor + xOffset,
            y2: c1c2I[0].y * scaleFactor + yOffset,
            cpx1: 145.61910914291738 * scaleFactor + xOffset,
            cpy1: 122.86050823051119 * scaleFactor + yOffset,
            cpx2: 165.01496981996087 * scaleFactor + xOffset,
            cpy2: 83.59550939346161 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
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
              [
                c1c3I[1].x * scaleFactor + xOffset,
                c1c3I[1].y * scaleFactor + yOffset,
              ],
              [
                c2c3I[1].x * scaleFactor + xOffset,
                c2c3I[1].y * scaleFactor + yOffset,
              ],
              [
                c1c2I[1].x * scaleFactor + xOffset,
                c1c2I[1].y * scaleFactor + yOffset,
              ],
              [
                c1c3I[1].x * scaleFactor + xOffset,
                c1c3I[1].y * scaleFactor + yOffset,
              ],
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
            x1: c2c3I[1].x * scaleFactor + xOffset,
            y1: c2c3I[1].y * scaleFactor + yOffset,
            x2: c1c3I[1].x * scaleFactor + xOffset,
            y2: c1c3I[1].y * scaleFactor + yOffset,
            cpx1: 123.4286192684544 * scaleFactor + xOffset,
            cpy1: 178.39309854645958 * scaleFactor + yOffset,
            cpx2: 104.9043496017597 * scaleFactor + xOffset,
            cpy2: 205.86903628688776 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 150,
        },
        {
          type: "bezierCurve",
          id: "S1_intersect_S3_minus_S2.3",
          shape: {
            x1: c1c3I[1].x * scaleFactor + xOffset,
            y1: c1c3I[1].y * scaleFactor + yOffset,
            x2: c1c2I[1].x * scaleFactor + xOffset,
            y2: c1c2I[1].y * scaleFactor + yOffset,
            cpx1: 131.6486559298548 * scaleFactor + xOffset,
            cpy1: 254.47530492097613 * scaleFactor + yOffset,
            cpx2: 169.35843276307335 * scaleFactor + xOffset,
            cpy2: 254.29390277549342 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
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
              [
                c1c3I[0].x * scaleFactor + xOffset,
                c1c3I[0].y * scaleFactor + yOffset,
              ],
              [
                c2c3I[0].x * scaleFactor + xOffset,
                c2c3I[0].y * scaleFactor + yOffset,
              ],
              [
                c1c2I[1].x * scaleFactor + xOffset,
                c1c2I[1].y * scaleFactor + yOffset,
              ],
              [
                c1c3I[0].x * scaleFactor + xOffset,
                c1c3I[0].y * scaleFactor + yOffset,
              ],
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
            x1: c1c3I[0].x * scaleFactor + xOffset,
            y1: c1c3I[0].y * scaleFactor + yOffset,
            x2: c2c3I[0].x * scaleFactor + xOffset,
            y2: c2c3I[0].y * scaleFactor + yOffset,
            cpx1: 276.57138073154556 * scaleFactor + xOffset,
            cpy1: 178.39309854645956 * scaleFactor + yOffset,
            cpx2: 295.09565039824025 * scaleFactor + xOffset,
            cpy2: 205.8690362868878 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 150,
        },
        {
          type: "bezierCurve",
          id: "S2_intersect_S3_minus_S1.3",
          shape: {
            x1: c2c3I[0].x * scaleFactor + xOffset,
            y1: c2c3I[0].y * scaleFactor + yOffset,
            x2: c1c2I[1].x * scaleFactor + xOffset,
            y2: c1c2I[1].y * scaleFactor + yOffset,
            cpx1: 268.3512766705979 * scaleFactor + xOffset,
            cpy1: 254.4753429717167 * scaleFactor + yOffset,
            cpx2: 230.64159888490266 * scaleFactor + xOffset,
            cpy2: 254.29384147483498 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
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
              [
                c1c3I[0].x * scaleFactor + xOffset,
                c1c3I[0].y * scaleFactor + yOffset,
              ],
              [
                c1c2I[1].x * scaleFactor + xOffset,
                c1c2I[1].y * scaleFactor + yOffset,
              ],
              [
                c2c3I[1].x * scaleFactor + xOffset,
                c2c3I[1].y * scaleFactor + yOffset,
              ],
              [
                c1c3I[0].x * scaleFactor + xOffset,
                c1c3I[0].y * scaleFactor + yOffset,
              ],
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
            x1: c2c3I[1].x * scaleFactor + xOffset,
            y1: c2c3I[1].y * scaleFactor + yOffset,
            x2: c1c3I[0].x * scaleFactor + xOffset,
            y2: c1c3I[0].y * scaleFactor + yOffset,
            cpx1: 181.34938847920316 * scaleFactor + xOffset,
            cpy1: 145.69364796666798 * scaleFactor + yOffset,
            cpx2: 218.65061152079684 * scaleFactor + xOffset,
            cpy2: 145.69364796666798 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 200,
        },
        {
          type: "bezierCurve",
          id: "S1_intersect_S2_intersect_S3.3",
          shape: {
            x1: c1c3I[0].x * scaleFactor + xOffset,
            y1: c1c3I[0].y * scaleFactor + yOffset,
            x2: c1c2I[1].x * scaleFactor + xOffset,
            y2: c1c2I[1].y * scaleFactor + yOffset,
            cpx1: 245.13952368754042 * scaleFactor + xOffset,
            cpy1: 193.79420675718842 * scaleFactor + yOffset,
            cpx2: 226.9648205037493 * scaleFactor + xOffset,
            cpy2: 221.03493624715696 * scaleFactor + yOffset,
          },
          style,
          z: 200,
        },
        {
          type: "bezierCurve",
          id: "S1_intersect_S2_intersect_S3.4",
          shape: {
            x1: c1c2I[1].x * scaleFactor + xOffset,
            y1: c1c2I[1].y * scaleFactor + yOffset,
            x2: c2c3I[1].x * scaleFactor + xOffset,
            y2: c2c3I[1].y * scaleFactor + yOffset,
            cpx1: 173.03467223098613 * scaleFactor + xOffset,
            cpy1: 221.03464337897427 * scaleFactor + yOffset,
            cpx2: 154.86055198374063 * scaleFactor + xOffset,
            cpy2: 193.79478758508313 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 200,
        },
      ],
    },
  ];
};

const twoCircleI = [
  { x: 200, y: 113.397 },
  { x: 200, y: 286.603 },
];

export const createTwoCircleLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
): GraphicComponentOption[] => {
  return [
    {
      type: "circle",
      id: "S1_minus_S2",
      left: 50 * scaleFactor + xOffset,
      top: 100 * scaleFactor + yOffset,
      shape: {
        r: 100 * scaleFactor,
      },
      style: {
        ...style,
        lineWidth: 2 * scaleFactor,
      },
      z: 100,
    },
    {
      type: "circle",
      id: "S2_minus_S1",
      left: 150 * scaleFactor + xOffset,
      top: 100 * scaleFactor + yOffset,
      shape: {
        r: 100 * scaleFactor,
      },
      style: {
        ...style,
        lineWidth: 2 * scaleFactor,
      },
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
            x1: twoCircleI[0].x * scaleFactor + xOffset,
            y1: twoCircleI[0].y * scaleFactor + yOffset,
            x2: twoCircleI[1].x * scaleFactor + xOffset,
            y2: twoCircleI[1].y * scaleFactor + yOffset,
            cpx1: 266.6671973922771 * scaleFactor + xOffset,
            cpy1: 151.88712008375987 * scaleFactor + yOffset,
            cpx2: 266.6671973922771 * scaleFactor + xOffset,
            cpy2: 248.11287991624016 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 150,
        },
        {
          type: "bezierCurve",
          id: "S1_intersect_S2.2",
          shape: {
            x1: twoCircleI[1].x * scaleFactor + xOffset,
            y1: twoCircleI[1].y * scaleFactor + yOffset,
            x2: twoCircleI[0].x * scaleFactor + xOffset,
            y2: twoCircleI[0].y * scaleFactor + yOffset,
            cpx1: 133.3328026077229 * scaleFactor + xOffset,
            cpy1: 248.11287991624016 * scaleFactor + yOffset,
            cpx2: 133.3328026077229 * scaleFactor + xOffset,
            cpy2: 151.88712008375987 * scaleFactor + yOffset,
          },
          style: {
            ...style,
            lineWidth: 2 * scaleFactor,
          },
          z: 150,
        },
      ],
    },
  ];
};

export const createThreeCircleLabelLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
) => ({
  S1_minus_S2_union_S3: {
    x: 110 * scaleFactor + xOffset,
    y: 115 * scaleFactor + yOffset,
  },
  S2_minus_S1_union_S3: {
    x: 290 * scaleFactor + xOffset,
    y: 115 * scaleFactor + yOffset,
  },
  S3_minus_S1_union_S2: {
    x: 200 * scaleFactor + xOffset,
    y: 290 * scaleFactor + yOffset,
  },
  S1_intersect_S2_minus_S3: {
    x: 200 * scaleFactor + xOffset,
    y: 115 * scaleFactor + yOffset,
  },
  S1_intersect_S3_minus_S2: {
    x: 145 * scaleFactor + xOffset,
    y: 210 * scaleFactor + yOffset,
  },
  S2_intersect_S3_minus_S1: {
    x: 255 * scaleFactor + xOffset,
    y: 210 * scaleFactor + yOffset,
  },
  S1_intersect_S2_intersect_S3: {
    x: 200 * scaleFactor + xOffset,
    y: 185 * scaleFactor + yOffset,
  },
});

export const createTwoCircleLabelLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
) => ({
  S1_minus_S2: {
    x: 100 * scaleFactor + xOffset,
    y: 200 * scaleFactor + yOffset,
  },
  S2_minus_S1: {
    x: 300 * scaleFactor + xOffset,
    y: 200 * scaleFactor + yOffset,
  },
  S1_intersect_S2: {
    x: 200 * scaleFactor + xOffset,
    y: 200 * scaleFactor + yOffset,
  },
});

const createThreeCircleOuterLabelLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
) => [
  {
    type: "text",
    left: 55 * scaleFactor + xOffset,
    top: 55 * scaleFactor + yOffset,
  },
  {
    type: "text",
    left: 340 * scaleFactor + xOffset,
    top: 55 * scaleFactor + yOffset,
  },
  {
    type: "text",
    left: 200 * scaleFactor + xOffset,
    top: 375 * scaleFactor + yOffset,
  },
];

const createTwoCircleOuterLabelLayout = (
  scaleFactor: number,
  xOffset: number = 0,
  yOffset: number = 0,
) => [
  {
    type: "text",
    left: 20 * scaleFactor + xOffset,
    top: 200 * scaleFactor + yOffset,
  },
  {
    type: "text",
    left: 380 * scaleFactor + xOffset,
    top: 200 * scaleFactor + yOffset,
  },
];

const chartConfig: EChartsOption = {
  xAxis: {
    splitLine: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
  },
  yAxis: {
    splitLine: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
  },
  grid: { show: false },
};

const addHighlight = (
  chartLayout: GraphicComponentOption[],
  highlightedIndices: string[],
  hoveredId: string | null = null,
  isCursorAllowed: boolean = true,
) => {
  return chartLayout.map((group: GraphicComponentGroupOption) => {
    const isHighlighted = highlightedIndices.includes(group.id);
    const isHovered = hoveredId === group.id;

    const getFillColor = () => {
      if (isHovered && !isCursorAllowed) {
        return NOT_ALLOWED_HIGHLIGHT_COLOR;
      }
      if (isHovered && isHighlighted) {
        return HOVER_SELECTED_COLOR;
      }
      if (isHovered) {
        return HOVER_COLOR;
      }
      if (isHighlighted) {
        return SELECTED_COLOR;
      }
      return group.style?.fill ?? style.fill;
    };

    if (isHighlighted || isHovered) {
      if (group?.children) {
        return {
          ...group,
          children: group.children.map((child) => ({
            ...child,
            ...(!isCursorAllowed && { cursor: "not-allowed" }),
            style: {
              ...child.style,
              fill: getFillColor(),
            },
          })),
        };
      } else {
        return {
          ...group,
          ...(!isCursorAllowed && { cursor: "not-allowed" }),
          style: {
            ...group.style,
            fill: getFillColor(),
          },
        };
      }
    } else {
      return group;
    }
  });
};

const getLayout = (
  twoCircles: boolean,
  highlightedIndices: string[],
  scaleFactor: number,
  hoveredId: string | null = null,
  isCursorAllowed: boolean = true,
  xOffset: number = 0,
  yOffset: number = 0,
) => {
  const layout = twoCircles
    ? createTwoCircleLayout(scaleFactor, xOffset, yOffset)
    : createThreeCircleLayout(scaleFactor, xOffset, yOffset);
  return addHighlight(layout, highlightedIndices, hoveredId, isCursorAllowed);
};

type UseLayoutProps = VennDiagramProps & {
  readonly highlightedIndices: string[];
  readonly height: number;
  readonly width: number;
};

export const useLayout = ({
  chartData,
  highlightedIndices,
  labels,
  ariaLabel,
  onClickHandler,
  interactable,
  width,
  height,
}: UseLayoutProps): EChartsOption => {
  const twoCircles = chartData.length === 3;
  const [chartLayout, setChartLayout] = useState<GraphicComponentOption[]>([]);
  const [option, setOption] = useState<EChartsOption>({});
  const [currentMouseOver, setCurrentMouseOver] = useState("");

  const widthScaleFactor = useMemo(() => width / BASE_WIDTH, [width]);
  const heightScaleFactor = useMemo(() => height / BASE_HEIGHT, [height]);

  const scaleFactor = useMemo(
    () => Math.min(widthScaleFactor, heightScaleFactor),
    [widthScaleFactor, heightScaleFactor],
  );

  const xOffset = useMemo(
    () => (width - BASE_WIDTH * scaleFactor) / 2,
    [width, scaleFactor],
  );

  const yOffset = useMemo(
    () => (height - BASE_HEIGHT * scaleFactor) / 2,
    [height, scaleFactor],
  );

  const labelLayout = useMemo(
    () =>
      twoCircles
        ? createTwoCircleLabelLayout(scaleFactor, xOffset, yOffset)
        : createThreeCircleLabelLayout(scaleFactor, xOffset, yOffset),
    [twoCircles, scaleFactor, xOffset, yOffset],
  );

  const outerLabelLayout = useMemo(
    () =>
      twoCircles
        ? createTwoCircleOuterLabelLayout(scaleFactor, xOffset, yOffset)
        : createThreeCircleOuterLabelLayout(scaleFactor, xOffset, yOffset),
    [twoCircles, scaleFactor, xOffset, yOffset],
  );

  const handleEvent = useCallback(
    (event: any, type: "mouseover" | "mouseout" | "click") => {
      const eventId = String(event.target.id);
      const id = eventId.includes(".") ? eventId.split(".")[0] : eventId;
      const element = chartData.find((datum) => datum.key === id);
      const isCursorAllowed = element?.value !== 0;

      if (type === "mouseover") {
        setCurrentMouseOver(id);
      } else if (type === "mouseout") {
        setCurrentMouseOver("");
      } else if (type === "click" && isCursorAllowed) {
        onClickHandler(id);
      }
    },
    [chartData, onClickHandler],
  );

  const addEvents = useCallback(
    (layout: GraphicComponentOption[]) =>
      layout.map((section) => {
        const rootKey = (section.id as string).split(".")[0];
        const datum = chartData.find((d) => d.key === rootKey);
        const isZero = datum?.value === 0;

        const handlers = interactable
          ? {
              onmouseover: (evt: ElementEvent) => handleEvent(evt, "mouseover"),
              onmouseout: (evt: ElementEvent) => handleEvent(evt, "mouseout"),
              onclick: (evt: ElementEvent) => handleEvent(evt, "click"),
            }
          : {};

        const cursorProp = interactable ? {} : { cursor: "auto" };

        const zeroTooltip =
          isZero && interactable
            ? {
                tooltip: {
                  show: true,
                  formatter: () => "This region contains 0 items",
                  borderWidth: 0,
                  backgroundColor: "black",
                  textStyle: { color: "white" },
                },
              }
            : {};

        if ("children" in section) {
          return {
            ...section,
            ...handlers,
            ...cursorProp,
            ...zeroTooltip,
            children: section.children.map((child) => ({
              ...child,
              ...handlers,
              ...cursorProp,
              ...zeroTooltip,
            })),
          };
        }

        return {
          ...section,
          ...handlers,
          ...cursorProp,
          ...zeroTooltip,
        };
      }),
    [chartData, interactable, handleEvent],
  );

  const handleEventWrapper = useCallback(
    (key: string) => ({
      onclick: () => handleEvent({ target: { id: key } }, "click"),
      onmouseover: () => handleEvent({ target: { id: key } }, "mouseover"),
      onmouseout: () => handleEvent({ target: { id: key } }, "mouseout"),
    }),
    [handleEvent],
  );

  const valueTexts = useMemo(
    () =>
      chartData.map(({ key, value }) => ({
        type: "text",
        id: `value-${key}`,
        ...labelLayout[key],
        style: {
          text: value.toLocaleString(),
          textAlign: "middle",
          textVerticalAlign: "middle",
          fill:
            value === 0 && currentMouseOver === key ? NOT_ALLOWED_TEXT : "#333",
          fontSize: 16 * scaleFactor,
        },
        z: 300,

        ...(interactable ? handleEventWrapper(key) : { cursor: "auto" }),

        ...(interactable
          ? {
              tooltip: {
                show: true,
                formatter: () =>
                  value === 0 ? "This region contains 0 items" : undefined,
                borderWidth: 0,
                backgroundColor: "black",
                textStyle: { color: "white" },
              },
            }
          : {}),
      })),
    [
      chartData,
      labelLayout,
      currentMouseOver,
      handleEventWrapper,
      interactable,
      scaleFactor,
    ],
  );

  useEffect(() => {
    const isCursorAllowed = currentMouseOver
      ? chartData.find((d) => d.key === currentMouseOver)?.value !== 0
      : true;
    setChartLayout(
      getLayout(
        twoCircles,
        highlightedIndices,
        scaleFactor,
        currentMouseOver || null,
        isCursorAllowed,
        xOffset,
        yOffset,
      ),
    );
  }, [
    highlightedIndices,
    twoCircles,
    scaleFactor,
    xOffset,
    yOffset,
    currentMouseOver,
    chartData,
  ]);

  useEffect(() => {
    const fullChartOption = {
      ...chartConfig,
      aria: {
        label: {
          description: ariaLabel,
        },
      },
      graphic: [
        // TODO: need to name this better - this is a bit misleading as we are not adding just events but echarts graphics
        // https://gdc-ctds.atlassian.net/browse/PEAR-2393
        ...addEvents(chartLayout),
        ...outerLabelLayout.map((labelConfig, idx) => ({
          ...labelConfig,
          style: {
            text: labels[idx],
            textAlign: "middle",
            fill: "#333333",
            fontSize: "16px",
          },
          cursor: "auto",
        })),

        ...valueTexts,
      ],
      tooltip: {
        show: true,
        trigger: "item" as const,
        transitionDuration: 0,
        position: function (point: [number, number]) {
          return [point[0], point[1] + 20];
        },
      },
    };
    setOption(fullChartOption);
  }, [chartLayout, addEvents, labels, outerLabelLayout, ariaLabel, valueTexts]);

  return option;
};
