import {
  GenesFrequencyChart,
  useGeneFrequencyChart
} from "@gff/core";

import dynamic from 'next/dynamic'

const BarChart = dynamic(() => import('./BarChart'), {
  ssr: false
});

const processChartData = (chartData:GenesFrequencyChart,
                          title = "Distribution of Most Frequently Mutated Genes",
                          showXLabels = true) => {
  if (!chartData) return null;

  const xvals = chartData.geneCounts.map((i) => i.symbol)
  const results : Record<string, unknown> = {
    x: xvals,
    y: chartData.geneCounts.map((i) => i.numCases),
    tickvals: showXLabels ? xvals : [],
    ticktext: showXLabels ? xvals : [],
    label_text: xvals,
    title: title,
    filename: `${title}.svg`,
    yAxisTitle: "# of Cases"
  }
  return results;
}

const processDummyData = (title = "Distribution of Most Frequently Mutated Genes" ) => {
  const xvals =  Array(20).fill("..");
  const results : Record<string, unknown> = {
    x: xvals,
    y: Array(20).fill(0),
    tickvals:  [],
    ticktext:  [],
    label_text: xvals,
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



export const GeneFrequencyChart:React.FC<GeneFrequencyChartProps> = ( { height = undefined,
                                                                        marginBottom = 40,
                                                                        showXLabels = true,
                                                                        showTitle = true,
                                                                        maxBins = 20,
                                                                        orientation='v'} : GeneFrequencyChartProps) => {
  const { data, isSuccess } = useGeneFrequencyChart( { pageSize: maxBins, offset: 0 } );
  const chart_data =  processChartData(data);
  return (
      <div className="relative ">
    {showTitle ?
      <div className=" items-center justify-between bg-white flex-wrap text-montserrat text-nci-gray-dark p-6 p-1.5">
        {"Distribution of Most Frequently Mutated Genes"}
      </div> : null
    }

    <BarChart data={chart_data}
              marginBottom={marginBottom}
              marginTop={0}
              height={height}
              orientation={orientation}
    />
  </div>
)
};

