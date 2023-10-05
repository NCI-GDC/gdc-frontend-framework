import { useState, useEffect } from "react";
import { Card, ActionIcon, Tooltip, SegmentedControl } from "@mantine/core";
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
import ContinuousData from "./ContinuousData";
import CategoricalData from "./CategoricalData";
import { ChartTypes } from "../types";
import {
  CONTINUOUS_FACET_TYPES,
  HIDE_QQ_BOX_FIELDS,
  DATA_DIMENSIONS,
} from "../constants";
import { toDisplayName } from "../utils";

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
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );
  const fieldNoIndex = field.split(".").at(-1);
  const [dataDimension, setDataDimension] = useState<string>(
    DATA_DIMENSIONS?.[fieldNoIndex]?.toggleValue ??
      DATA_DIMENSIONS?.[fieldNoIndex]?.unit,
  );

  const continuous = CONTINUOUS_FACET_TYPES.includes(facet?.type);
  const noData = continuous
    ? (data as Stats)?.stats?.count === 0
    : data !== undefined &&
      (data as Buckets).buckets.every((bucket) => bucket.key === "_missing");

  const fieldName = toDisplayName(field);

  useEffect(() => {
    if (!initialDashboardRender) {
      scrollIntoView();
    }
    // this should only happen on initial component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      data-testid={`${fieldName}-card`}
      shadow="sm"
      radius="md"
      p="xs"
      ref={(ref) => (targetRef.current = ref)}
      className="border-1 border-base-lightest"
    >
      <div className="flex justify-between mb-1">
        <h2 className="font-heading font-medium">{fieldName}</h2>
        <div className="flex gap-2">
          {DATA_DIMENSIONS?.[fieldNoIndex]?.toggleValue && (
            <SegmentedControl
              data={[
                DATA_DIMENSIONS?.[fieldNoIndex]?.toggleValue,
                DATA_DIMENSIONS?.[fieldNoIndex]?.unit,
              ]}
              classNames={{
                root: "bg-transparent p-0 border-1 border-primary rounded-md h-7",
                label:
                  "bg-base-max text-primary data-active:bg-primary data-active:text-base-max rounded-none py-0.5 px-1",
              }}
              onChange={setDataDimension}
            />
          )}
          <div className="flex flex-row gap-1">
            <Tooltip
              label={"Histogram"}
              position="bottom-end"
              withArrow
              arrowSize={7}
            >
              <ActionIcon
                data-testid="button-historgram-plot"
                variant="outline"
                className={
                  chartType === "histogram" && !noData
                    ? "bg-primary"
                    : "border-primary"
                }
                onClick={() => setChartType("histogram")}
                aria-label={`Select ${fieldName} histogram plot`}
                disabled={noData}
              >
                <BarChartIcon
                  className={
                    chartType === "histogram" && !noData
                      ? "text-primary-contrast"
                      : "text-primary"
                  }
                />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={"Survival Plot"} withArrow arrowSize={7}>
              <ActionIcon
                data-testid="button-survival-plot"
                variant="outline"
                className={
                  chartType === "survival"
                    ? "bg-primary text-primary"
                    : "border-primary text-primary-content"
                }
                onClick={() => setChartType("survival")}
                aria-label={`Select ${fieldName} survival plot`}
                disabled={noData}
              >
                <SurvivalChartIcon
                  className={
                    chartType === "survival"
                      ? "text-primary-contrast"
                      : "text-primary"
                  }
                />
              </ActionIcon>
            </Tooltip>
            {continuous && !HIDE_QQ_BOX_FIELDS.includes(field) && (
              <Tooltip label={"Box/QQ Plot"} withArrow arrowSize={7}>
                <ActionIcon
                  data-testid="button-box-qq-plot"
                  variant="outline"
                  className={
                    chartType === "boxqq"
                      ? "bg-primary text-primary"
                      : "border-primary text-primary-content"
                  }
                  onClick={() => setChartType("boxqq")}
                  aria-label={`Select ${fieldName} Box/QQ Plot`}
                  disabled={noData}
                >
                  <BoxPlotIcon
                    className={
                      chartType === "boxqq"
                        ? "text-primary-contrast rotate-90"
                        : "text-primary rotate-90"
                    }
                  />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
          <Tooltip
            label={"Remove Card"}
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
              <CloseIcon className="text-primary" />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
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
    </Card>
  );
};

export default CDaveCard;
