import { useState, useEffect } from "react";
import { Card, ActionIcon, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as BarChartIcon,
  MdTrendingDown as SurvivalChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Buckets,
  Stats,
} from "@gff/core";
import ContinuousData from "./ContinuousData";
import CategoricalData from "./CategoricalData";
import { ChartTypes } from "../types";
import { CONTINUOUS_FACET_TYPES } from "../constants";
import { toDisplayName } from "../utils";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Buckets | Stats;
  readonly updateFields: (field: string) => void;
  readonly initialDashboardRender: boolean;
}

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
      shadow="sm"
      radius="md"
      ref={(ref) => (targetRef.current = ref)}
      className="border-1 border-base-lightest"
    >
      <div className="flex justify-between mb-1">
        <h2 className="font-heading font-medium">{fieldName}</h2>
        <div className="flex gap-1">
          <Tooltip
            label={"Histogram"}
            position="bottom-end"
            withArrow
            arrowSize={7}
          >
            <ActionIcon
              variant="outline"
              className={
                chartType === "histogram" && !noData
                  ? "bg-primary"
                  : "border-primary"
              }
              onClick={() => setChartType("histogram")}
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
              variant="outline"
              className={
                chartType === "survival"
                  ? "bg-primary text-primary"
                  : "border-primary text-primary-content"
              }
              onClick={() => setChartType("survival")}
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
          <Tooltip
            label={"Remove Card"}
            position="bottom-end"
            withArrow
            arrowSize={7}
          >
            <ActionIcon
              onClick={() => updateFields(field)}
              className="border-primary text-primary-content"
            >
              <CloseIcon className="text-primary" />
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
          noData={noData}
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
