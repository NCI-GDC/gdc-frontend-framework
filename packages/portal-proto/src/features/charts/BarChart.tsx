import { Config, Layout, PlotMouseEvent, PlotData } from "plotly.js";
import Plot from "react-plotly.js";

export interface BarChartData {
  datasets: Partial<PlotData>[];
  yAxisTitle?: string;
  tickvals?: number[];
  ticktext?: string[];
  label_text?: string[] | number[];
  title?: string;
  filename?: string;
}

/**
 * Bar chart component properties
 * @property data - data to be plotted
 * @property height - height of the chart
 * @property width - width of the chart
 * @property marginBottom - margin bottom of the chart
 * @property marginTop - margin top of the chart
 * @property padding - padding of the chart
 * @property orientation - orientation of the chart
 * @property onClickHandler - callback function for click event
 * @property stacked - whether the chart is stacked
 * @property divId - id of the div
 * @category Charts
 */

interface BarChartProps {
  readonly data: BarChartData;
  // if defined, this determines the height of the chart. Otherwise, autosizing is used.
  readonly height?: number;
  readonly width?: number;
  readonly marginBottom?: number;
  readonly marginTop?: number;
  readonly padding?: number;
  readonly orientation?: string;
  readonly onClickHandler?: (mouseEvent: PlotMouseEvent) => void;
  readonly stacked?: boolean;
  readonly divId: string;
}

/**
 * Bar chart component
 * @param data - data to be plotted
 * @param marginBottom - margin bottom of the chart
 * @param marginTop - margin top of the chart
 * @param padding - padding of the chart
 * @param orientation   - orientation of the chart
 * @param onClickHandler  - callback function for click event
 * @param divId - id of the div
 * @param stacked - whether the chart is stacked
 * @category Charts
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  marginBottom,
  marginTop = 30,
  padding = 4,
  orientation = "v",
  onClickHandler,
  divId,
  stacked = false,
}: BarChartProps) => {
  const chartData = data.datasets.map((dataset) => ({
    x: orientation === "v" ? dataset.x : dataset.y,
    y: orientation === "v" ? dataset.y : dataset.x,
    hoverinfo: "text",
    text: dataset.text,
    hoverlabel: { bgcolor: "rgba(0,0,0,0.9)", font: "Montserrat" },
    hovertemplate: dataset.hovertemplate,
    customdata: dataset.customdata,
    textposition: "none",
    showlegend: false,
    uniformtext_mode: "hide",
    title: null,
    marker: {
      color: dataset?.marker?.color,
      line: {
        color: "#4f4b4b",
        width: 2,
      },
    },
    type: "bar",
    orientation: orientation,
    bargap: 0.5,
  }));

  const layout: Partial<Layout> =
    orientation === "v"
      ? {
          xaxis: {
            // (bars are vertical)
            automargin: false,
            ticks: "outside",
            tickwidth: 2,
            tickcolor: "#aaaaaa",
            ticklen: 2,
            tickvals: data.tickvals,
            ticktext: data.ticktext,
            tickfont: {
              size: 12,
              family: "Noto Sans, sans-serif",
              color: "rgb(107, 107, 107)",
            },
            tickangle: data?.datasets?.[0]?.x.length > 6 ? 35 : undefined,
          },
          yaxis: {
            title: data.yAxisTitle,
            titlefont: {
              family: "Noto Sans, sans-serif",
              size: 14,
            },
            tickfont: {
              size: 12,
              color: "rgb(107, 107, 107)",
              family: "Noto Sans, sans-serif",
            },
          },
          margin: {
            l: 80,
            r: 40,
            b: marginBottom !== undefined ? marginBottom : 100,
            t: marginTop,
            pad: padding,
          },
          autosize: true,
          barmode: stacked ? "stack" : "group",
          transition: {
            duration: 500,
            easing: "cubic-in-out",
          },
        }
      : {
          // (bars are horizontal)
          yaxis: {
            automargin: false,
            ticks: "outside",
            tickwidth: 2,
            tickcolor: "#aaaaaa",
            ticklen: 2,
            tickvals: data.tickvals,
            ticktext: data.ticktext,
            autorange: "reversed",
            tickfont: {
              size: 12,
              color: "rgb(107, 107, 107)",
              family: "Noto Sans, sans-serif",
            },
          },
          xaxis: {
            title: data.yAxisTitle,
            titlefont: {
              family: "Noto Sans, sans-serif",
              size: 14,
            },
            tickfont: {
              size: 12,
              color: "rgb(107, 107, 107)",
              family: "Noto Sans, sans-serif",
            },
          },
          margin: {
            l: 120,
            r: 10,
            b: marginBottom !== undefined ? marginBottom : 100,
            t: marginTop,
            pad: padding,
          },
          autosize: true,
        };

  const config: Partial<Config> = {
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

  return (
    <Plot
      divId={divId}
      data={chartData}
      layout={layout}
      config={config}
      useResizeHandler={true}
      onClick={onClickHandler}
      className={"w-full h-full"}
    />
  );
};

export default BarChart;
