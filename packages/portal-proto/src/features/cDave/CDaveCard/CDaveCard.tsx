import { useState, useEffect } from "react";
import { Card, ActionIcon, Tooltip, SegmentedControlItem } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as BarChartIcon,
  MdTrendingDown as SurvivalChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import { AiTwotoneBoxPlot as BoxPlotIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Buckets,
  Stats,
  GqlOperation,
} from "@gff/core";
import SegmentedControl from "@/components/SegmentedControl";
import { DownloadProgressContext } from "@/utils/contexts";
import ContinuousData from "./ContinuousData";
import CategoricalData from "./CategoricalData";
import { ChartTypes, DataDimension } from "../types";
import {
  CONTINUOUS_FACET_TYPES,
  HIDE_QQ_BOX_FIELDS,
  DATA_DIMENSIONS,
  MISSING_KEY,
} from "../constants";
import { toDisplayName, useDataDimension } from "../utils";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Buckets | Stats;
  readonly updateFields: (field: string) => void;
  readonly initialDashboardRender: boolean;
  readonly cohortFilters: GqlOperation;
}

const CDaveCard: React.FC<CDaveCardProps> = ({
  field,
  data,
  updateFields,
  initialDashboardRender,
  cohortFilters,
}: CDaveCardProps) => {
  const [chartType, setChartType] = useState<ChartTypes>("histogram");
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();
  const displayDataDimension = useDataDimension(field);
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );
  const [dataDimension, setDataDimension] = useState<DataDimension | null>(
    displayDataDimension && DATA_DIMENSIONS?.[field]?.toggleValue
      ? DATA_DIMENSIONS?.[field]?.toggleValue
      : DATA_DIMENSIONS?.[field]?.unit,
  );

  const continuous = CONTINUOUS_FACET_TYPES.includes(facet?.type);
  const noData = continuous
    ? (data as Stats)?.stats?.count === 0
    : data !== undefined &&
      (data as Buckets)?.buckets?.every((bucket) => bucket.key === MISSING_KEY);

  const fieldName = toDisplayName(field);

  useEffect(() => {
    if (!initialDashboardRender) {
      scrollIntoView();
    }
    // this should only happen on initial component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartButtons: SegmentedControlItem[] = [
    {
      value: "histogram",
      label: (
        <Tooltip
          label="Histogram"
          position="bottom-end"
          withArrow
          arrowSize={7}
        >
          <div
            data-testid="button-histogram-plot"
            role="button"
            aria-label={`Select ${fieldName} histogram plot`}
          >
            <BarChartIcon size={20} aria-hidden="true" />
          </div>
        </Tooltip>
      ),
    },
    {
      value: "survival",
      label: (
        <Tooltip label={"Survival Plot"} withArrow arrowSize={7}>
          <div
            data-testid="button-survival-plot"
            role="button"
            aria-label={`Select ${fieldName} survival plot`}
          >
            <SurvivalChartIcon size={20} aria-hidden="true" />
          </div>
        </Tooltip>
      ),
    },
  ];

  if (continuous && !HIDE_QQ_BOX_FIELDS.includes(field)) {
    chartButtons.push({
      value: "boxqq",
      label: (
        <Tooltip label={"Box/QQ Plot"} withArrow arrowSize={7}>
          <div
            data-testid="button-box-qq-plot"
            role="button"
            aria-label={`Select ${fieldName} Box/QQ Plot`}
          >
            <BoxPlotIcon size={20} className={"rotate-90"} aria-hidden="true" />
          </div>
        </Tooltip>
      ),
    });
  }

  return (
    <Card
      data-testid={`${fieldName}-card`}
      shadow="sm"
      radius="md"
      p="xs"
      ref={targetRef}
      className="border-1 border-base-lightest h-full flex flex-col"
    >
      <div className="flex justify-between mb-1">
        <h2 className="font-heading font-medium">{fieldName}</h2>
        <div className="flex gap-2 h-7 items-center">
          {displayDataDimension && (
            <SegmentedControl
              data={[
                DATA_DIMENSIONS?.[field]?.toggleValue,
                DATA_DIMENSIONS?.[field]?.unit,
              ]}
              onChange={(d) => setDataDimension(d as DataDimension)}
              disabled={noData || downloadInProgress}
            />
          )}
          <SegmentedControl
            data={chartButtons}
            onChange={(c) => setChartType(c as ChartTypes)}
            disabled={noData || downloadInProgress}
          />
          <Tooltip
            label="Remove Card"
            position="bottom-end"
            withArrow
            arrowSize={7}
          >
            <ActionIcon
              data-testid="button-remove-card"
              onClick={() => updateFields(field)}
              className="border-primary text-primary-content"
              aria-label={`Remove ${fieldName} card`}
            >
              <CloseIcon
                className="text-primary"
                aria-hidden="true"
                size="1rem"
              />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      <DownloadProgressContext.Provider
        value={{ downloadInProgress, setDownloadInProgress }}
      >
        {noData ? (
          <div className="h-[32.1rem] w-full flex flex-col justify-start">
            <p className="mx-auto my-2">No data for this property</p>
          </div>
        ) : continuous ? (
          <ContinuousData
            initialData={(data as Stats)?.stats}
            field={field}
            fieldName={fieldName}
            chartType={chartType}
            noData={noData}
            cohortFilters={cohortFilters}
            dataDimension={dataDimension}
          />
        ) : (
          <CategoricalData
            initialData={(data as Buckets)?.buckets}
            field={field}
            fieldName={fieldName}
            chartType={chartType}
            noData={noData}
          />
        )}
      </DownloadProgressContext.Provider>
    </Card>
  );
};

export default CDaveCard;
