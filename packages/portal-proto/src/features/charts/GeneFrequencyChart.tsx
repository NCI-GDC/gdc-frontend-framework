import {
  GenesFrequencyChart,
  useGeneFrequencyChart
} from "@gff/core";

import dynamic from 'next/dynamic'

const BarChart = dynamic(() => import('./BarChart'), {
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
  return <>
    {showTitle ?
      <div className="flex items-center justify-between bg-white flex-wrap text-montserrat text-nci-gray-dark p-6 p-1.5">
        {"Distribution of Most Frequently Mutated Genes"}
      </div> : null
    }
    <div className="h-5/6">
    <BarChart data={chart_data}
              height={undefined}
              marginBottom={marginBottom}
              marginTop={0}
              orientation={orientation}
    />

    </div>
  </>;
};

