import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
} from "@gff/core";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import { Loader } from '@mantine/core';


const BarChartWithNoSSR = dynamic(() => import('./BarChart'), {
  ssr: false
})

const maxValuesToDisplay =7;

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
  readonly showXLabels?: boolean;
  readonly height?: number;
  readonly marginBottom?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
  readonly orientation?: string;
}

// from https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutation
const removeKey = (key, {[key]: _, ...rest}) => rest;

const processChartData = (facetData:Record<string, any>, field: string, maxBins = 100, showXLabels = true) => {
  const data = removeKey('_missing', facetData);
  const xvals = Object.keys(data).slice(0, maxBins).map(x =>x);
  const xlabels = Object.keys(data).slice(0, maxBins).map(x => processLabel(x, 12));
  const results : Record<string, any> = {
    x: xvals,
    y: Object.values(data).slice(0, maxBins),
    tickvals: showXLabels ? xvals : [],
    ticktext: showXLabels ? xlabels : [],
    label_text: Object.keys(data).slice(0, maxBins).map(x => processLabel(x, 100)),
    title: convertFieldToName(field),
    filename: `${field}.svg`,
    yAxisTitle: "# of Cases"
  }
  return results;
}

export const FacetChart: React.FC<FacetProps> = ({ field, showXLabels = true, height, marginBottom, showTitle = true, maxBins = maxValuesToDisplay, orientation='v'}: FacetProps) => {
  const { data, error, isUninitialized, isFetching, isError, isSuccess } =
    useCaseFacet(field);

  // const [ chart_data, setChartData ]  = useState(processChartData( { label_text:["","","","","",""], x:["0","1","2","3","4","5"], y:[0,0,0,0,0,0] }, field, maxBins, showXLabels))
   const [ chart_data, setChartData ]  = useState(undefined)

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data, field, maxBins, showXLabels);
      console.log(cd);
      setChartData(cd);
    }
  } ,[data, isSuccess]);


/*
  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }
*/
  // const chart_data = isSuccess ? processChartData(data, field, maxBins, showXLabels) : { x:[0,1,2,3,4,5], y:[0,0,0,0,0,0] };

  return <div className="flex flex-col border-2 bg-white ">
    {showTitle ?
      <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
        {convertFieldToName(field)}
      </div> : null
    }

    {  chart_data && isSuccess ?
    <BarChartWithNoSSR data={chart_data} height={height}
                       marginBottom={marginBottom}
                       orientation={orientation} />
      :
      <div className="flex flex-row justify-center w-100">
        <Loader size={height} />
      </div>
    }
  </div>
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
