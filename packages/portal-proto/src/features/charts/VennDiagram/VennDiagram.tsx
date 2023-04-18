import { useState, useEffect } from "react";
import { Config, Layout, Shape, PlotMouseEvent } from "plotly.js";
import Plot from "react-plotly.js";
import {
  twoCircleLayout,
  threeCircleLayout,
  twoCircleDataOrder,
  threeCircleDataOrder,
  twoCircleLabelLayout,
  threeCircleLabelLayout,
  twoCircleOuterLabelLayout,
  threeCircleOuterLabelLayout,
} from "./layouts";

interface chartData {
  readonly key: string;
  readonly value: number | string;
  readonly highlighted: boolean;
}

interface VennDiagramProps {
  readonly chartData: chartData[];
  readonly labels: string[];
  readonly onClickHandler?: (key: string) => void;
  readonly interactable?: boolean;
}

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

const VennDiagram: React.FC<VennDiagramProps> = ({
  chartData,
  labels,
  onClickHandler,
  interactable = true,
}: VennDiagramProps) => {
  const twoCircles = chartData.length === 3;
  const chartLayout = twoCircles ? twoCircleLayout : threeCircleLayout;
  const dataOrder = twoCircles ? twoCircleDataOrder : threeCircleDataOrder;
  const dataLabelPositions = twoCircles
    ? twoCircleLabelLayout
    : threeCircleLabelLayout;
  const outerLableLayout = twoCircles
    ? twoCircleOuterLabelLayout
    : threeCircleOuterLabelLayout;

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
      chartLayout,
      sortedChartData
        .map((d, idx) => (d.highlighted ? idx : -1))
        .filter((d) => d >= 0),
    ),
    height: 400,
    width: 400,
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
    font: {
      color: "#333333",
    },
  };

  const [layout, setLayout] = useState(initialLayout);

  useEffect(() => {
    setLayout({
      ...initialLayout,
      shapes: addHighlightToLayout(
        chartLayout,
        sortedChartData
          .map((d, idx) => (d.highlighted ? idx : -1))
          .filter((d) => d >= 0),
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    staticPlot: !interactable,
  };

  const outerLabels = {
    x: [...outerLableLayout.x],
    y: [...outerLableLayout.y],
    type: "scatter",
    mode: "text",
    text: [...labels],
    hoverinfo: "skip",
    showlegend: false,
  };

  const innerLabels = {
    x: [...dataLabelPositions.map((d) => d.x)],
    y: [...dataLabelPositions.map((d) => d.y)],
    type: "scatter",
    mode: "text+markers",
    text: [
      ...sortedChartData.map((d) =>
        d?.value !== undefined ? d.value.toLocaleString() : undefined,
      ),
    ],
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
