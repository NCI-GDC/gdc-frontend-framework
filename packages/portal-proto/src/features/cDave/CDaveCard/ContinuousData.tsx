import { useState, useMemo } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { mapKeys } from "lodash";
import {
  useGetContinuousDataStatsQuery,
  Statistics,
  GqlOperation,
} from "@gff/core";
import { useRangeFacet } from "../../facets/hooks";
import CDaveHistogram from "./CDaveHistogram";
import CDaveTable from "./CDaveTable";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import CardControls from "./CardControls";
import {
  CustomInterval,
  NamedFromTo,
  ChartTypes,
  SelectedFacet,
} from "../types";
import { SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { isInterval, createBuckets, parseContinuousBucket } from "../utils";
import BoxQQSection from "./BoxQQSection";

const processContinuousResultData = (
  data: Record<string, number>,
  customBinnedData: NamedFromTo[] | CustomInterval,
): Record<string, number> => {
  if (!isInterval(customBinnedData) && customBinnedData?.length > 0) {
    return Object.fromEntries(
      Object.entries(data).map(([, v], idx) => [
        customBinnedData[idx]?.name,
        v,
      ]),
    );
  }

  return mapKeys(data, (_, k) => toBucketDisplayName(k));
};

const toBucketDisplayName = (bucket: string): string => {
  const [fromValue, toValue] = parseContinuousBucket(bucket);

  return `${Number(Number(fromValue).toFixed(2))} to <${Number(
    Number(toValue).toFixed(2),
  )}`;
};

interface ContinuousDataProps {
  readonly initialData: Statistics;
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
  readonly cohortFilters: GqlOperation;
}

const ContinuousData: React.FC<ContinuousDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
  noData,
  cohortFilters,
}: ContinuousDataProps) => {
  const [customBinnedData, setCustomBinnedData] = useState<
    CustomInterval | NamedFromTo[]
  >(null);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacet[]>([]);
  const [yTotal, setYTotal] = useState(0);

  const ranges = isInterval(customBinnedData)
    ? createBuckets(
        customBinnedData.min,
        customBinnedData.max,
        customBinnedData.interval,
      )
    : customBinnedData?.length > 0
    ? customBinnedData.map((d) => ({ to: d.to, from: d.from }))
    : createBuckets(initialData.min, initialData.max);

  const { data, isFetching, isSuccess } = useRangeFacet(
    "cases",
    "repository",
    field,
    ranges,
    cohortFilters,
  );
  const { data: statsData } = useGetContinuousDataStatsQuery({
    field: field.replaceAll(".", "__"),
    queryFilters: cohortFilters,
    rangeFilters: {
      op: "range",
      content: [
        {
          ranges,
        },
      ],
    },
  });

  const resultData = useMemo(
    () => processContinuousResultData(isSuccess ? data : {}, customBinnedData),
    [isSuccess, data, customBinnedData],
  );

  useDeepCompareEffect(() => {
    setSelectedSurvivalPlots(
      Object.entries(resultData)
        .filter(
          ([key, value]) =>
            key !== "missing" && value >= SURVIVAL_PLOT_MIN_COUNT,
        )
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key)
        .slice(0, 2),
    );

    if (customBinnedData === null) {
      setYTotal(Object.values(resultData).reduce((a, b) => a + b, 0));
    }

    setSelectedFacets([]);
  }, [resultData, customBinnedData]);

  return (
    <>
      {chartType === "boxqq" ? (
        <BoxQQSection field={field} data={statsData} />
      ) : (
        <>
          {chartType === "histogram" ? (
            <CDaveHistogram
              field={field}
              data={resultData}
              yTotal={yTotal}
              isFetching={isFetching}
              continuous={true}
              noData={noData}
            />
          ) : (
            <ClinicalSurvivalPlot
              field={field}
              selectedSurvivalPlots={selectedSurvivalPlots}
              continuous={true}
              customBinnedData={customBinnedData}
            />
          )}
          <CardControls
            continuous={true}
            field={field}
            fieldName={fieldName}
            results={resultData}
            yTotal={yTotal}
            customBinnedData={customBinnedData}
            setCustomBinnedData={setCustomBinnedData}
            selectedFacets={selectedFacets}
            stats={initialData}
          />
          <CDaveTable
            fieldName={fieldName}
            data={resultData}
            yTotal={yTotal}
            customBinnedData={customBinnedData}
            survival={chartType === "survival"}
            selectedSurvivalPlots={selectedSurvivalPlots}
            setSelectedSurvivalPlots={setSelectedSurvivalPlots}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
            continuous={true}
          />
        </>
      )}
    </>
  );
};

export default ContinuousData;
