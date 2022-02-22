import {
  GenesFrequencyChart,
  fetchGeneFrequencies,
  useCoreSelector,
  selectCurrentCohortFilters,
  useCoreDispatch,
  selectGeneFrequencyChartData
} from "@gff/core";

import dynamic from 'next/dynamic'
import { useEffect } from "react";

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



interface GenesFrequencyResponse {
  readonly data?: GenesFrequencyChart;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useGeneFrequencyChart = (): GenesFrequencyResponse => {
  const coreDispatch = useCoreDispatch();
  const chartData = useCoreSelector((state) => selectGeneFrequencyChartData(state));
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortFilters(state));

  useEffect(() => {
    coreDispatch(fetchGeneFrequencies( { pageSize:20, offset: 0}));
  }, [coreDispatch, cohortFilters]);
  return {
    data: { ...chartData?.data },
    error: chartData?.error,
    isUninitialized: chartData === undefined,
    isFetching: chartData?.status === "pending",
    isSuccess: chartData?.status === "fulfilled",
    isError: chartData?.status === "rejected",
  };
};

interface GeneFrequencyChartProps {
  readonly height?: number;
  readonly marginBottom?: number;
  readonly showXLabels?: boolean;
  readonly showTitle?: boolean;
  readonly maxBins?:number;
  readonly orientation?:string;
}

export const GeneFrequencyChart:React.FC<GeneFrequencyChartProps> = ( { height, marginBottom, showXLabels = true, showTitle = true, maxBins = 20, orientation='v'} : GeneFrequencyChartProps) => {
  const { data, error,  isError, isSuccess } = useGeneFrequencyChart();

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  if (!isSuccess)
    return <div>Loading</div>

  const chart_data = processChartData(data);
  return ( <div>
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
  </div>)
};

