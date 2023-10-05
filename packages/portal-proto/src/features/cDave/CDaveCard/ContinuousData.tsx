import { useState, useMemo } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { mapKeys } from "lodash";
import {
  useGetContinuousDataStatsQuery,
  Statistics,
  GqlOperation,
  DAYS_IN_YEAR,
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
import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import BoxQQSection from "./BoxQQSection";

const processContinuousResultData = (
  data: Record<string, number>,
  customBinnedData: NamedFromTo[] | CustomInterval,
  dataDimension: string,
): Record<string, number> => {
  if (!isInterval(customBinnedData) && customBinnedData?.length > 0) {
    return Object.fromEntries(
      Object.entries(data).map(([, v], idx) => [
        customBinnedData[idx]?.name,
        formatValue(v, dataDimension),
      ]),
    );
  }

  return mapKeys(data, (_, k) => toBucketDisplayName(k, dataDimension));
};

const toBucketDisplayName = (bucket: string, dataDimension: string): string => {
  const [fromValue, toValue] = parseContinuousBucket(bucket);

  return `${Number(
    formatValue(Number(fromValue), dataDimension).toFixed(2),
  )} to <${Number(formatValue(Number(toValue), dataDimension).toFixed(2))}`;
};

const formatValue = (value: number, dataDimension: string) => {
  return Number(
    dataDimension === "Years" ? value / DAYS_IN_YEAR : value.toFixed(2),
  );
};

interface ContinuousDataProps {
  readonly initialData: Statistics;
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
  readonly cohortFilters: GqlOperation;
  readonly dataDimension?: string;
}

const ContinuousData: React.FC<ContinuousDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
  noData,
  cohortFilters,
  dataDimension,
}: ContinuousDataProps) => {
  const [customBinnedData, setCustomBinnedData] = useState<
    CustomInterval | NamedFromTo[]
  >(null);
  const [binningModalOpen, setBinningModalOpen] = useState(false);
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

  const displayedData = useMemo(
    () =>
      processContinuousResultData(
        isSuccess ? data : {},
        customBinnedData,
        dataDimension,
      ),
    [isSuccess, data, customBinnedData, dataDimension],
  );

  useDeepCompareEffect(() => {
    setSelectedSurvivalPlots(
      Object.entries(displayedData)
        .filter(
          ([key, value]) =>
            key !== "missing" && value >= SURVIVAL_PLOT_MIN_COUNT,
        )
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key)
        .slice(0, 2),
    );

    if (customBinnedData === null) {
      setYTotal(Object.values(displayedData).reduce((a, b) => a + b, 0));
    }

    setSelectedFacets([]);
  }, [displayedData, customBinnedData]);

  return (
    <>
      {chartType === "boxqq" ? (
        <BoxQQSection
          field={field}
          displayName={fieldName}
          data={statsData}
          dataDimension={dataDimension}
        />
      ) : (
        <>
          {chartType === "histogram" ? (
            <CDaveHistogram
              field={field}
              data={displayedData}
              yTotal={yTotal}
              isFetching={isFetching}
              hideYTicks={Object.values(displayedData).every(
                (val) => val === 0,
              )}
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
            displayedData={displayedData}
            yTotal={yTotal}
            setBinningModalOpen={setBinningModalOpen}
            customBinnedData={customBinnedData}
            setCustomBinnedData={setCustomBinnedData}
            selectedFacets={selectedFacets}
            dataDimension={dataDimension}
          />
          <CDaveTable
            field={field}
            fieldName={fieldName}
            yTotal={yTotal}
            displayedData={displayedData}
            hasCustomBins={customBinnedData !== null}
            survival={chartType === "survival"}
            selectedSurvivalPlots={selectedSurvivalPlots}
            setSelectedSurvivalPlots={setSelectedSurvivalPlots}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
            dataDimension={dataDimension}
          />
        </>
      )}
      {binningModalOpen && (
        <ContinuousBinningModal
          setModalOpen={setBinningModalOpen}
          field={fieldName}
          stats={initialData}
          updateBins={setCustomBinnedData}
          customBins={customBinnedData}
        />
      )}
    </>
  );
};

export default ContinuousData;
