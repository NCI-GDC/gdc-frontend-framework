import { FC } from "react";
import Plot from "react-plotly.js";
import GeneData from "./genes.json";
import MutationData from "./mutations.json";
import { useMantineTheme } from "@mantine/core";

const createChartData = (which) => {
  const input_data =
    which === "gene"
      ? GeneData["MostFrequentGenes"]
      : MutationData["MostFrequentMutation"];

  const data = {
    x: input_data.map((item) => item.gene_label),
    y: input_data.map((item) => item.percent),
    labels: null,
    type: "bar",
    filename: which === "gene" ? "gene_chart.svg" : "mutation_chart.svg",
    chart_title:
      which === "gene"
        ? "Distribution of Most Frequently Mutated Genes"
        : "Distribution of Mutations",
  };

  return data;
};

const GeneMutationChart: FC<{ which }> = ({ which }: { which: string }) => {
  const chart_data = createChartData(which);

  const theme = useMantineTheme();

  const chartData = {
    ...chart_data,
    textinfo: "label+percent",
    uniformtext_mode: "hide",
    title: null,

    showlegend: false,
    marker: {
      line: {
        color: theme.colors.white[0],
        width: 2,
      },
      color: theme.colors.utility[3], // TODO: consider adding a chart color entry into the theme
    },
    textposition: "outside",
    insidetextorientation: "horizontal",
  };

  const layout = {
    uniformtext: { mode: "hide", minsize: 8 },
    width: "100%",
    height: 380,
    title: chart_data.chart_title,
    titlefont: {
      family: "Arial, sans-serif",
      size: 24,
    },
    xaxis: {
      dividerwidth: 2,
      tickangle: 45,
      tickfont: {
        size: 10,
        color: "rgb(107, 107, 107)",
        family: "Noto Sans",
      },
    },
    yaxis: {
      title: "% Cases Affected",
      titlefont: {
        family: "Arial, sans-serif",
        size: 24,
      },
      tickfont: {
        size: 16,
        color: "rgb(107, 107, 107)",
      },
    },
    autosize: true,
    margin: {
      l: 100,
      r: 10,
      b: 90,
      t: 50,
      pad: 4,
    },
  };
  const config = {
    responsive: false,
    toImageButtonOptions: {
      format: "png", // one of png, svg, jpeg, webp
      filename: chart_data.filename,
      height: 500,
      width: 700,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
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
    ],
  };
  return (
    <div>
      <Plot data={[chartData]} layout={layout} config={config} />
    </div>
  );
};

export default GeneMutationChart;
