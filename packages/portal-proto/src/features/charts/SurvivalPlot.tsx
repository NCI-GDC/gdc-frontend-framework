import {
  fetchSurvival,
  useCoreSelector,
  useCoreDispatch,
  Survival,
  selectSurvival,
  selectSurvivalData,
  useSurvivalPlot,
} from "@gff/core";
import { useEffect } from "react";
import dynamic from 'next/dynamic'

const BarChartWithNoSSR = dynamic(() => import('./BarChart'), {
  ssr: false
});


export const SurvivalPlot = ( height, marginBottom, showXLabels = true, showTitle = true, maxBins = 20, orientation='v') => {
  const { data, error, isUninitialized, isFetching, isError } =
    useSurvivalPlot();

  console.log("SurvivalPlot", data);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  console.log("before process chart data");

  return <div className="flex flex-col border-2 bg-white ">
    {showTitle ?
      <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
        {"Overall Survival Plot"}
      </div> : null
    }
  </div>
};

