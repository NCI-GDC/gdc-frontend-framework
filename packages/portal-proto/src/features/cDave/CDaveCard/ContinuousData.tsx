import { useState, useMemo } from "react";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
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
  DataDimension,
  DisplayData,
} from "../types";
import {
  SURVIVAL_PLOT_MIN_COUNT,
  DATA_DIMENSIONS,
  MISSING_KEY,
} from "../constants";
import {
  isInterval,
  createBuckets,
  parseContinuousBucket,
  convertDataDimension,
  formatValue,
  roundSometimes,
} from "../utils";
import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import BoxQQSection from "./BoxQQSection";

const processContinuousResultData = (
  data: Record<string, number>,
  customBinnedData: NamedFromTo[] | CustomInterval,
  field: string,
  dataDimension: DataDimension,
): DisplayData => {
  if (!isInterval(customBinnedData) && customBinnedData?.length > 0) {
    return Object.values(data).map((v, idx) => ({
      displayName: customBinnedData[idx]?.name,
      key: customBinnedData[idx]?.name,
      count: v,
    }));
  }

  return Object.entries(data).map(([k, v]) => ({
    displayName: toBucketDisplayName(k, field, dataDimension),
    key: k,
    count: v,
  }));
};

const toBucketDisplayName = (
  bucket: string,
  field: string,
  dataDimension: DataDimension,
): string => {
  const [fromValue, toValue] = parseContinuousBucket(bucket);
  const originalDataDimension = DATA_DIMENSIONS[field]?.unit;
  return `${formatValue(
    roundSometimes(
      convertDataDimension(
        Number(fromValue),
        originalDataDimension,
        dataDimension,
      ),
    ),
  )} to <${formatValue(
    roundSometimes(
      convertDataDimension(
        Number(toValue),
        originalDataDimension,
        dataDimension,
      ),
    ),
  )}`;
};

interface ContinuousDataProps {
  readonly initialData: Statistics;
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
  readonly cohortFilters: GqlOperation;
  readonly dataDimension?: DataDimension;
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

  const ranges = useDeepCompareMemo(
    () =>
      isInterval(customBinnedData)
        ? createBuckets(
            customBinnedData.min,
            customBinnedData.max,
            customBinnedData.interval,
          )
        : customBinnedData?.length > 0
        ? customBinnedData.map((d) => ({
            to: d.to,
            from: d.from,
          }))
        : createBuckets(initialData.min, initialData.max),
    [customBinnedData, initialData],
  );

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
        field,
        dataDimension,
      ),
    [isSuccess, data, customBinnedData, field, dataDimension],
  );

  useDeepCompareEffect(() => {
    setSelectedSurvivalPlots(
      displayedData
        .filter(
          ({ count, key }) =>
            key !== MISSING_KEY && count >= SURVIVAL_PLOT_MIN_COUNT,
        )
        .sort((a, b) => b.count - a.count)
        .map(({ key }) => key)
        .slice(0, 2),
    );

    if (customBinnedData === null) {
      setYTotal(displayedData.reduce((a, b) => a + b.count, 0));
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
          <div className="flex-grow">
            {chartType === "histogram" ? (
              <CDaveHistogram
                field={field}
                data={displayedData}
                yTotal={yTotal}
                isFetching={isFetching}
                hideYTicks={displayedData.every((val) => val.count === 0)}
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
          </div>
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

      <ContinuousBinningModal
        opened={binningModalOpen}
        setModalOpen={setBinningModalOpen}
        field={field}
        stats={initialData}
        updateBins={setCustomBinnedData}
        customBins={customBinnedData}
        dataDimension={dataDimension}
      />
    </>
  );
};

export default ContinuousData;
