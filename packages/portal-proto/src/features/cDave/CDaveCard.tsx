import { useState, useEffect, useMemo } from "react";
import { mapKeys } from "lodash";
import { Card, ActionIcon, Tooltip, Button, Menu } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as BarChartIcon,
  MdShowChart as SurvivalChartIcon,
  MdOutlineClose as CloseIcon,
  MdArrowDropDown as DownIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Buckets,
  Bucket,
  Stats,
  Statistics,
} from "@gff/core";
import { useRangeFacet } from "../facets/hooks";
import CDaveHistogram from "./CDaveHistogram";
import CDaveTable from "./CDaveTable";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import ContinuousBinningModal from "./ContinuousBinningModal/ContinuousBinningModal";
import CategoricalBinningModal from "./CategoricalBinningModal";
import { CategoricalBins, CustomInterval, NamedFromTo } from "./types";
import { CONTINUOUS_FACET_TYPES } from "./constants";
import {
  toDisplayName,
  isInterval,
  createBuckets,
  parseContinuousBucket,
  flattenBinnedData,
} from "./utils";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Buckets | Stats;
  readonly updateFields: (field: string) => void;
  readonly initialDashboardRender: boolean;
}

type ChartTypes = "histogram" | "survival" | "qq";

const CDaveCard: React.FC<CDaveCardProps> = ({
  field,
  data,
  updateFields,
  initialDashboardRender,
}: CDaveCardProps) => {
  const [chartType, setChartType] = useState<ChartTypes>("histogram");
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );

  const continuous = CONTINUOUS_FACET_TYPES.includes(facet?.type);

  const fieldName = toDisplayName(field);

  useEffect(() => {
    if (!initialDashboardRender) {
      scrollIntoView();
    }
    // this should only happen on inital component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="h-[580px]" ref={(ref) => (targetRef.current = ref)}>
      <div className="flex justify-between mb-1">
        <h2>{fieldName}</h2>
        <div className="flex gap-1">
          <Tooltip label={"Histogram"} withArrow>
            <ActionIcon
              variant="outline"
              className={
                chartType === "histogram"
                  ? "bg-nci-blue-darkest text-white"
                  : "border-nci-blue-darkest text-nci-blue-darkest"
              }
              onClick={() => setChartType("histogram")}
            >
              <BarChartIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Survival Plot"} withArrow>
            <ActionIcon
              variant="outline"
              className={
                chartType === "survival"
                  ? "bg-nci-blue-darkest text-white"
                  : "border-nci-blue-darkest text-nci-blue-darkest"
              }
              onClick={() => setChartType("survival")}
            >
              <SurvivalChartIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Remove Card"} withArrow>
            <ActionIcon onClick={() => updateFields(field)}>
              <CloseIcon />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      {continuous ? (
        <ContinuousData
          initialData={(data as Stats)?.stats}
          field={field}
          fieldName={fieldName}
          chartType={chartType}
        />
      ) : (
        <CategoricalData
          initialData={(data as Buckets)?.buckets}
          field={field}
          fieldName={fieldName}
          chartType={chartType}
        />
      )}
    </Card>
  );
};

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
}

const ContinuousData: React.FC<ContinuousDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
}: ContinuousDataProps) => {
  const [customBinnedData, setCustomBinnedData] = useState<
    CustomInterval | NamedFromTo[]
  >(null);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );

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
    field,
    ranges,
    "cases",
    "repository",
  );

  const resultData = useMemo(
    () => processContinuousResultData(isSuccess ? data : {}, customBinnedData),
    [isSuccess, data, customBinnedData],
  );

  useEffect(() => {
    setSelectedSurvivalPlots(Object.keys(resultData).slice(0, 2));
  }, [resultData]);

  return (
    <>
      {chartType === "histogram" ? (
        <CDaveHistogram
          field={field}
          fieldName={fieldName}
          data={resultData}
          isFetching={isFetching}
          continuous={true}
          noData={initialData.count === 0}
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
        field={fieldName}
        results={resultData}
        customBinnedData={customBinnedData}
        setCustomBinnedData={setCustomBinnedData}
        stats={initialData}
      />
      <CDaveTable
        fieldName={fieldName}
        data={resultData}
        customBinnedData={customBinnedData}
        survival={chartType === "survival"}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
        continuous={true}
      />
    </>
  );
};

interface CategoricalDataProps {
  readonly initialData: readonly Bucket[];
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
}

const CategoricalData: React.FC<CategoricalDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
}: CategoricalDataProps) => {
  const [customBinnedData, setCustomBinnedData] =
    useState<CategoricalBins>(null);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );

  const resultData = useMemo(
    () =>
      Object.fromEntries(
        (initialData || []).map((d) => [
          d.key === "_missing" ? "missing" : d.key,
          d.doc_count,
        ]),
      ),
    [initialData],
  );

  useEffect(
    () =>
      setSelectedSurvivalPlots(
        Object.keys(
          customBinnedData !== null
            ? Object.fromEntries(
                Object.entries(
                  flattenBinnedData(customBinnedData as CategoricalBins),
                ).sort((a, b) => b[1] - a[1]),
              )
            : resultData,
        ).slice(0, 2),
      ),
    [customBinnedData, resultData],
  );

  return (
    <>
      {chartType === "histogram" ? (
        <CDaveHistogram
          field={field}
          fieldName={fieldName}
          data={resultData}
          isFetching={false}
          continuous={false}
          noData={
            initialData !== undefined &&
            initialData.every((bucket) => bucket.key === "_missing")
          }
          customBinnedData={customBinnedData}
        />
      ) : (
        <ClinicalSurvivalPlot
          field={field}
          selectedSurvivalPlots={selectedSurvivalPlots}
          continuous={false}
          customBinnedData={customBinnedData}
        />
      )}
      <CardControls
        continuous={false}
        field={fieldName}
        results={resultData}
        customBinnedData={customBinnedData}
        setCustomBinnedData={setCustomBinnedData}
      />
      <CDaveTable
        fieldName={fieldName}
        data={resultData}
        customBinnedData={customBinnedData}
        survival={chartType === "survival"}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
        continuous={false}
      />
    </>
  );
};

interface CardControlsProps {
  readonly continuous: boolean;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly setCustomBinnedData:
    | ((bins: CategoricalBins) => void)
    | ((bins: NamedFromTo[] | CustomInterval) => void);
  readonly stats?: Statistics;
}

const CardControls: React.FC<CardControlsProps> = ({
  continuous,
  field,
  results,
  customBinnedData,
  setCustomBinnedData,
  stats,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between p-2">
        <div>
          <Menu>
            <Menu.Target>
              <Button
                rightIcon={<DownIcon size={20} />}
                className="bg-white text-nci-gray-darkest border-nci-gray"
              >
                Select Action
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled>Save as a new cohort</Menu.Item>
              <Menu.Item disabled>Add to cohort</Menu.Item>
              <Menu.Item disabled>Remove from cohort</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button className="bg-white text-nci-gray-darkest border-nci-gray ml-2">
            TSV
          </Button>
        </div>
        <Menu>
          <Menu.Target>
            <Button
              rightIcon={<DownIcon size={20} />}
              className="bg-white text-nci-gray-darkest border-nci-gray"
            >
              Customize Bins
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => setModalOpen(true)}>Edit Bins</Menu.Item>
            <Menu.Item
              disabled={customBinnedData === null}
              onClick={() => setCustomBinnedData(null)}
            >
              Reset to Default
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      {modalOpen &&
        (continuous ? (
          <ContinuousBinningModal
            setModalOpen={setModalOpen}
            field={field}
            stats={stats}
            updateBins={
              setCustomBinnedData as (
                bins: NamedFromTo[] | CustomInterval,
              ) => void
            }
            customBins={customBinnedData as NamedFromTo[] | CustomInterval}
          />
        ) : (
          <CategoricalBinningModal
            setModalOpen={setModalOpen}
            field={field}
            results={results}
            updateBins={setCustomBinnedData as (bins: CategoricalBins) => void}
            customBins={customBinnedData as CategoricalBins}
          />
        ))}
    </>
  );
};

export default CDaveCard;
