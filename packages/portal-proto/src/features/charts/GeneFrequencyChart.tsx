import {
  GenesFrequencyChart,
  useGeneFrequencyChart
} from "@gff/core";

import dynamic from 'next/dynamic'

const BarChartWithNoSSR = dynamic(() => import('./BarChart'), {
  ssr: false
});

const processChartData = (chartData:GenesFrequencyChart, title = "Distribution of Most Frequently Mutated Genes", maxBins = 100, showXLabels = true) => {
  const data = chartData;
  const xvals = chartData.geneCounts.map((i) => i.symbol)
  const xlabels = chartData.geneCounts.map((i) => i.symbol)
  const results : Record<string, any> = {
    x: xvals,
    y: chartData.geneCounts.map((i) => i.numCases),
    tickvals: showXLabels ? xvals : [],
    ticktext: showXLabels ? xlabels : [],
    label_text: xlabels,
    title: title,
    filename: `${title}.svg`,
    yAxisTitle: "# of Cases"
  }
  return results;
}

export const GeneFrequencyChart = ( height, marginBottom, showXLabels = true, showTitle = true, maxBins = 20, orientation='v') => {
  const { data, error, isUninitialized, isFetching, isError } =
    useGeneFrequencyChart({ pageSize:maxBins, offset: 0});

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  const chart_data = processChartData(data);
  return <div className="flex flex-col border-2 bg-white ">
    {showTitle ?
      <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
        {"Distribution of Most Frequently Mutated Genes"}
      </div> : null
    }
    <BarChartWithNoSSR data={chart_data} height={height} marginBottom={marginBottom} orientation={orientation}></BarChartWithNoSSR>
  </div>;
};

