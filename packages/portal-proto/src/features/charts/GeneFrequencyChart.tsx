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

interface GeneFrequencyChartProps {
  readonly height?: number;
  readonly marginBottom?: number;
  readonly showXLabels?: boolean;
  readonly showTitle?: boolean;
  readonly maxBins?:number;
  readonly orientation?:string;
}

export const GeneFrequencyChart:React.FC<GeneFrequencyChartProps> = ( { height, marginBottom, showXLabels = true, showTitle = true, maxBins = 20, orientation='v'} : GeneFrequencyChartProps) => {
  const { data, error,  isError, isSuccess } = useGeneFrequencyChart( { pageSize: 20, offset: 0 } );

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  if (!isSuccess)
    return <div>Loading</div>

  const chart_data = processChartData(data);
  return ( <>
    <div className="flex flex-col">
    {showTitle ?
      <div className="flex items-center justify-between bg-white flex-wrap text-montserrat text-nci-gray-dark p-6 p-1.5">
        {"Distribution of Most Frequently Mutated Genes"}
      </div> : null
    }

    <BarChart data={chart_data}
              marginBottom={marginBottom}
              marginTop={0}
              orientation={orientation}
    />
    </div>
  </>)
};

