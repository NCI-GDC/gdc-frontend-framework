import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
} from "@gff/core";
import { useEffect } from "react";
import dynamic from 'next/dynamic'
import './FacetChart.module.css'

const BarChartWithNoSSR = dynamic(() => import('./BarChart'), {
  ssr: false
})

interface UseCaseFacetResponse {
  readonly data?: FacetBuckets;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useCaseFacet = (field: string): UseCaseFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCasesFacetByField(state, field),
  );

  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

interface FacetProps {
  readonly field: string;
}

const processChartData = (data:Record<string, any>, field: string, maxBins = 100) => {
  const xindex = Array.from({length: Object.keys(data).slice(0, maxBins).length}, (_, i) => i + 1)
  const xvals = Object.keys(data).slice(0, maxBins).map(x =>x);
  const xlabels = Object.keys(data).slice(0, maxBins).map(x => processLabel(x, 12));
  const results : Record<string, any> = {
    x: xvals,
    y: Object.values(data).slice(0, maxBins),
    tickvals: xvals,
    ticktext: xlabels,
    title: convertFieldToName(field),
    filename: `${field}.svg`,
    yAxisTitle: "# of Cases"
  }
  return results;
}

export const FacetChart: React.FC<FacetProps> = ({ field }: FacetProps) => {
  const { data, error, isUninitialized, isFetching, isError } =
    useCaseFacet(field);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  const maxValuesToDisplay =12;

  const chart_data = processChartData(data, field, maxValuesToDisplay);

  return <div className="flex flex-col border-2 ">
    <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
      {convertFieldToName(field)}
    </div>
    <BarChartWithNoSSR data={chart_data}></BarChartWithNoSSR>
  </div>;
};

const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => s[0].toUpperCase() + s.substr(1));
  return capitalizedTokens.join(" ");
};


function truncateString(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

const processLabel = (label: string, shorten=100): string => {
  const tokens = label.split(" ");
  const capitalizedTokens = tokens.map((s) => s[0].toUpperCase() + s.substr(1));
  return truncateString(capitalizedTokens.join(" "), shorten);
};
