import { useState, useEffect } from "react";
import { Config, Layout, Shape, PlotMouseEvent } from "plotly.js";
import Plot from "react-plotly.js";

// Coordinates where circles intersect, calculated with this: https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
const c1c2I = [
  { x: 2.5, y: 2.133 },
  { x: 2.5, y: 3.866 },
];

const c2c3I = [
  { x: 3.492, y: 2.129 },
  { x: 2.008, y: 2.871 },
];

const c1c3I = [
  { x: 2.992, y: 2.871 },
  { x: 1.508, y: 2.129 },
];

/*
  Create venn diagram by drawing circles and then drawing the overlaps over top with svg paths. 
  Plotly limits us here in not supporting arcs so we need to use bezier curves
  to draw the overlaps instead (https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#curve_commands).
  Bezier control points calculated with this: https://stackoverflow.com/questions/734076/how-to-best-approximate-a-geometrical-arc-with-a-bezier-curve/44829356#44829356
*/
const threeCircleLayout: Partial<Shape>[] = [
  {
    opacity: 1,
    xref: "x",
    yref: "y",
    fillcolor: "#f0f0f0",
    x0: 1,
    y0: 2,
    x1: 3,
    y1: 4,
    type: "circle",
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  {
    opacity: 1,
    xref: "x",
    yref: "y",
    fillcolor: "#f0f0f0",
    x0: 2,
    y0: 2,
    x1: 4,
    y1: 4,
    type: "circle",
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  {
    opacity: 1,
    xref: "x",
    yref: "y",
    fillcolor: "#f0f0f0",
    x0: 1.5,
    y0: 1,
    x1: 3.5,
    y1: 3,
    type: "circle",
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  // Shape for circle 1 and 2 intersection
  {
    opacity: 1,
    fillcolor: "#f0f0f0",
    type: "path",
    path: `M ${c2c3I[1].x} ${c2c3I[1].y} C 1.955 3.272, 2.15 3.664 ${c1c2I[1].x} ${c1c2I[1].y} C 2.846 3.664, 3.044 3.271 ${c1c3I[0].x} ${c1c3I[0].y} C 2.687 3.043, 2.313 3.043 ${c2c3I[1].x} ${c2c3I[1].y}`,
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  // Circle 1 and 3 intersection
  {
    opacity: 1,
    fillcolor: "#f0f0f0",
    type: "path",
    path: `M ${c1c2I[0].x} ${c1c2I[0].y} C 2.193 1.956, 1.816 1.955, ${c1c3I[1].x} ${c1c3I[1].y} C 1.549 2.441, 1.734 2.716, ${c2c3I[1].x} ${c2c3I[1].y} C 2.048 2.562, 2.230 2.289, ${c1c2I[0].x} ${c1c2I[0].y}`,
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  //Circle 2 and 3 intersection
  {
    opacity: 1,
    fillcolor: "#f0f0f0",
    type: "path",
    path: `M ${c1c3I[0].x} ${c1c3I[0].y} C 3.266 2.716, 3.451 2.441, ${c2c3I[0].x} ${c2c3I[0].y} C 3.184 1.955, 2.806 1.956, ${c1c2I[0].x} ${c1c2I[0].y} C 2.770 2.289, 2.951 2.562, ${c1c3I[0].x} ${c1c3I[0].y}`,
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
  // Union of all 3 circles
  {
    opacity: 1,
    fillcolor: "#f0f0f0",
    type: "path",
    path: `M ${c1c2I[0].x} ${c1c2I[0].y} C 2.229 2.289, 2.048 2.562, ${c2c3I[1].x} ${c2c3I[1].y} C 2.313 3.043, 2.687 3.043, ${c1c3I[0].x} ${c1c3I[0].y} C 2.951 2.562, 2.769 2.289, ${c1c2I[0].x} ${c1c2I[0].y}`,
    line: {
      color: "#5c5c5c",
      width: 2,
    },
    layer: "below",
  },
];

// Sort data in the same order we're drawing the circles/overlaps
const dataOrder = [
  "S1_minus_S2_union_S3",
  "S2_minus_S1_union_S3",
  "S3_minus_S1_union_S2",
  "S1_intersect_S2_minus_S3",
  "S1_intersect_S3_minus_S2",
  "S2_intersect_S3_minus_S1",
  "S1_intersect_S2_intersect_S3",
];

const addHighlightToLayout = (
  layout: Partial<Shape>[],
  highlightedIndices: number[],
) => {
  return layout.map((shape, idx) => {
    if (highlightedIndices.includes(idx)) {
      return { ...shape, fillcolor: "#a5d5d9" };
    } else {
      return shape;
    }
  });
};

interface chartData {
  readonly key: string;
  readonly value: number;
  readonly highlighted: boolean;
}

interface VennDiagramProps {
  readonly chartData: chartData[];
  readonly labels: string[];
  readonly onClickHandler?: (key: string) => void;
}

const VennDiagram: React.FC<VennDiagramProps> = ({
  chartData,
  labels,
  onClickHandler,
}: VennDiagramProps) => {
  const sortedChartData = chartData.sort(
    (a, b) => dataOrder.indexOf(a.key) - dataOrder.indexOf(b.key),
  );

  const initialLayout: Partial<Layout> = {
    xaxis: {
      showticklabels: false,
      autotick: false,
      showgrid: false,
      zeroline: false,
      range: [0, 5],
    },
    yaxis: {
      showticklabels: false,
      autotick: false,
      showgrid: false,
      zeroline: false,
      range: [0, 5],
    },
    shapes: addHighlightToLayout(
      threeCircleLayout,
      sortedChartData
        .map((d, idx) => (d.highlighted ? idx : -1))
        .filter((d) => d >= 0),
    ),
    height: 400,
    width: 450,
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
  };

  const [layout, setLayout] = useState(initialLayout);

  useEffect(() => {
    setLayout({
      ...initialLayout,
      shapes: addHighlightToLayout(
        threeCircleLayout,
        sortedChartData
          .map((d, idx) => (d.highlighted ? idx : -1))
          .filter((d) => d >= 0),
      ),
    });
  }, [sortedChartData]);

  const config: Partial<Config> = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "zoom2d",
      "pan2d",
      "select2d",
      "lasso2d",
      "zoomIn2d",
      "zoomOut2d",
      "autoScale2d",
      "resetScale2d",
      "toImage",
    ],
  };

  const outerLabels = {
    x: [1, 4, 2.5],
    y: [3.75, 3.75, 0.75],
    type: "scatter",
    mode: "text",
    text: [...labels],
    hoverinfo: "skip",
    showlegend: false,
  };

  const dataLabelPositions = [
    { key: "S1_minus_S2_union_S3", x: 1.5, y: 3.25 },
    { key: "S2_minus_S1_union_S3", x: 3.5, y: 3.25 },
    { key: "S3_minus_S1_union_S2", x: 2.5, y: 1.6 },
    { key: "S1_intersect_S2_minus_S3", x: 2.5, y: 3.25 },
    { key: "S1_intersect_S3_minus_S2", x: 2, y: 2.25 },
    { key: "S2_intersect_S3_minus_S1", x: 3, y: 2.25 },
    { key: "S1_intersect_S2_intersect_S3", x: 2.5, y: 2.6 },
  ];

  const innerLabels = {
    x: [...dataLabelPositions.map((d) => d.x)],
    y: [...dataLabelPositions.map((d) => d.y)],
    type: "scatter",
    mode: "text+markers",
    text: [...sortedChartData.map((d) => d.value)],
    hoverinfo: "none",
    marker: {
      size: 30,
      opacity: 0,
    },
    showlegend: false,
  };

  const onHover = (mouseEvent: PlotMouseEvent) => {
    const dataIndex = mouseEvent.points[0].pointIndex;
    setLayout({
      ...initialLayout,
      shapes: addHighlightToLayout(initialLayout.shapes, [dataIndex]),
    });
  };

  const onUnhover = () => {
    setLayout(initialLayout);
  };

  const onClick = (mouseEvent: PlotMouseEvent) => {
    if (onClickHandler) {
      onClickHandler(sortedChartData[mouseEvent.points[0].pointIndex].key);
    }
  };

  return (
    <Plot
      data={[outerLabels, innerLabels]}
      layout={layout}
      config={config}
      onClick={onClick}
      onHover={onHover}
      onUnhover={onUnhover}
    />
  );
};

export default VennDiagram;
