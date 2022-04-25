import React from "react";
import { LoadingOverlay } from "@mantine/core";

import dynamic from "next/dynamic";
import { GenesFrequencyChart, useGeneFrequencyChart } from "@gff/core";

import ChartTitleBar from "./ChartTitleBar";
import { BarChartData } from "./BarChart";

const CHART_NAME = "most-frequently-mutated-genes-bar-chart";

const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

// const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
//   ssr: false,
// });

const hovertemplate =
  "<b>%{x}</b> <br />%{customdata[0]} Cases Affected in Cohort<br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>";

const processChartData = (
  chartData: GenesFrequencyChart,
  title = "Distribution of Most Frequently Mutated Genes",
  showXLabels = true,
): BarChartData => {
  if (!chartData)
    return {
      datasets: [],
    };

  const xindex = chartData.geneCounts.map((_i, index) => index);
  const xvals = chartData.geneCounts.map((i) => i.symbol);

  return {
    datasets: [
      {
        x: xindex,
        y: chartData.geneCounts.map(
          (x) => (x.numCases / chartData.casesTotal) * 100,
        ),
        hovertemplate: hovertemplate,
        customdata: chartData.geneCounts.map((d) => [
          d.numCases,
          chartData.casesTotal,
        ]),
      },
    ],
    tickvals: showXLabels ? xindex : [],
    ticktext: showXLabels ? xvals : [],
    label_text: xvals,
    title: title,
    filename: title,
    yAxisTitle: "% of Cases Affected",
  };
};

interface GeneFrequencyChartProps {
  readonly height?: number;
  readonly marginBottom?: number;
  readonly showXLabels?: boolean;
  readonly title?: string;
  readonly maxBins?: number;
  readonly orientation?: string;
}

export const GeneFrequencyChart: React.FC<GeneFrequencyChartProps> = ({
  height = undefined,
  marginBottom = 100,
  title = "Distribution of Most Frequently Mutated Genes",
  maxBins = 20,
  orientation = "v",
}: GeneFrequencyChartProps) => {
  const { data, isSuccess } = useGeneFrequencyChart({
    pageSize: maxBins,
    offset: 0,
  });

  return (
    <div className="relative pr-2 border-r-2">
      {title ? (
        <ChartTitleBar
          title={title}
          divId={CHART_NAME}
          filename={CHART_NAME}
          jsonData={{}}
        />
      ) : null}
      <div className="w-100 h-100">
        <LoadingOverlay visible={!isSuccess} />
        <BarChart
          data={processChartData(data)}
          marginBottom={marginBottom}
          marginTop={0}
          height={height}
          orientation={orientation}
          divId={CHART_NAME}
        />
      </div>
    </div>
  );
};
