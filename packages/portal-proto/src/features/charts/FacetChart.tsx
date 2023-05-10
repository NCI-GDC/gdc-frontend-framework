/**
 * A Facet Chart deprecated in favor of EnumFacetChart.
 */
import React from "react";
import {
  FacetBuckets,
  fetchFacetByName,
  FilterSet,
  selectCasesFacetByField,
  selectCurrentCohortFilters,
  useCoreDispatch,
  useCoreSelector,
  fieldNameToTitle,
} from "@gff/core";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@mantine/core";
import ChartTitleBar from "./ChartTitleBar";

const BarChartWithNoSSR = dynamic(() => import("./BarChart"), {
  ssr: false,
});

const maxValuesToDisplay = 7;

interface UseCaseFacetResponse {
  readonly data?: FacetBuckets;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

/**
 * Filter selector for all of the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

const useCaseFacet = (field: string): UseCaseFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCasesFacetByField(state, field),
  );
  const selectFacetFilter = useCohortFacetFilter();

  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFacetByName(field));
  }, [coreDispatch, field, selectFacetFilter]);

  return {
    data: facet,
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
  readonly marginTop?: number;
  readonly padding?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
  readonly orientation?: string;
}

// from https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeKey = (key, { [key]: _, ...rest }) => rest;

const processChartData = (
  facetData: Record<string, string | number>,
  field: string,
  maxBins = 100,
  showXLabels = true,
) => {
  const data = removeKey("_missing", facetData);
  const xvals = Object.keys(data)
    .slice(0, maxBins)
    .map((x) => x);
  const xlabels = Object.keys(data)
    .slice(0, maxBins)
    .map((x) => processLabel(x, 12));
  return {
    datasets: [
      {
        x: xvals,
        y: Object.values(data).slice(0, maxBins),
      },
    ],
    tickvals: showXLabels ? xvals : [],
    ticktext: showXLabels ? xlabels : [],
    title: fieldNameToTitle(field),
    filename: field,
    yAxisTitle: "# of Cases",
  };
};

export const FacetChart: React.FC<FacetProps> = ({
  field,
  showXLabels = true,
  height,
  marginBottom,
  marginTop = 30,
  padding = 4,
  showTitle = true,
  maxBins = maxValuesToDisplay,
  orientation = "v",
}: FacetProps) => {
  const { data, isSuccess } = useCaseFacet(field);
  const [chart_data, setChartData] = useState(undefined);

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data.buckets, field, maxBins, showXLabels);
      setChartData(cd);
    }
  }, [data, field, isSuccess, maxBins, showXLabels]);

  // Create unique ID for this chart
  const chartDivId = `${field}_${Math.floor(Math.random() * 100)}`;

  return (
    <div className="flex flex-col">
      {showTitle ? (
        <ChartTitleBar
          title={fieldNameToTitle(field)}
          divId={chartDivId}
          filename={field}
        />
      ) : null}
      {chart_data && isSuccess ? (
        <BarChartWithNoSSR
          data={chart_data}
          height={height}
          marginBottom={marginBottom}
          marginTop={marginTop}
          padding={padding}
          orientation={orientation}
          divId={chartDivId}
        />
      ) : (
        <div className="flex flex-row items-center justify-center w-100">
          <Loader color="primary" size={height ? height : 24} />
        </div>
      )}
    </div>
  );
};

function truncateString(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

export const processLabel = (label: string, shorten = 100): string => {
  const tokens = label.split(" ");
  const capitalizedTokens = tokens.map((s) => s[0].toUpperCase() + s.substr(1));
  return truncateString(capitalizedTokens.join(" "), shorten);
};
