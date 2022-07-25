import { useState, useEffect } from "react";
import {
  Card,
  ActionIcon,
  Tooltip,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  Loader,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Statistics,
  Buckets,
  Bucket,
  Stats,
} from "@gff/core";
import { useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, toDisplayName } from "./utils";
import { mapKeys } from "lodash";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Buckets | Stats;
  readonly updateFields: (field: string) => void;
  readonly initialDashboardRender: boolean;
}

enum ChartTypes {
  histogram = "histogram",
  survival = "survival",
  qq = "qq",
}

const CDaveCard: React.FC<CDaveCardProps> = ({
  field,
  data,
  updateFields,
  initialDashboardRender,
}: CDaveCardProps) => {
  const [chartType] = useState<ChartTypes>(ChartTypes.histogram);
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );

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
                chartType === ChartTypes.histogram
                  ? "bg-nci-blue-darkest text-white"
                  : "border-nci-blue-darkest"
              }
            >
              <ChartIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Remove Card"} withArrow>
            <ActionIcon onClick={() => updateFields(field)}>
              <CloseIcon />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      {data && facet && CONTINUOUS_FACET_TYPES.includes(facet?.type) ? (
        <ContinuousResult
          field={field}
          fieldName={fieldName}
          stats={(data as Stats).stats}
        />
      ) : (
        <EnumResult
          field={field}
          fieldName={fieldName}
          data={(data as Buckets).buckets}
        />
      )}
    </Card>
  );
};

interface ContinuousResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly stats: Statistics;
}
const ContinuousResult: React.FC<ContinuousResultProps> = ({
  field,
  stats,
  fieldName,
}: ContinuousResultProps) => {
  const ranges = createBuckets(stats);
  const { data, isFetching } = useRangeFacet(
    field,
    ranges,
    "cases",
    "repository",
  );

  return (
    <Result
      field={field}
      fieldName={fieldName}
      data={data}
      isFetching={isFetching}
      continuous={true}
      noData={stats.count === 0}
    />
  );
};

interface EnumResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly data: readonly Bucket[];
}
const EnumResult: React.FC<EnumResultProps> = ({
  field,
  fieldName,
  data,
}: EnumResultProps) => {
  return (
    <Result
      field={field}
      fieldName={fieldName}
      data={Object.fromEntries((data || []).map((d) => [d.key, d.doc_count]))}
      isFetching={false}
      continuous={false}
      noData={data.every((bucket) => bucket.key === "_missing")}
    />
  );
};

const parseContinuousBucket = (bucket: string): string => {
  const [fromValue, toValue] = bucket.split("-");
  return `${Number(Number(fromValue).toFixed(2))} to < ${Number(
    Number(toValue).toFixed(2),
  )}`;
};

const formatBarChartData = (
  data: Record<string, number>,
  displayPercent: boolean,
  continuous: boolean,
) => {
  const dataToMap = mapKeys(data || {}, (_, k) =>
    k === "_missing" ? "missing" : k,
  );
  const yTotal = Object.values(dataToMap).reduce((prevY, y) => prevY + y, 0);

  const mappedData = Object.entries(dataToMap || {}).map(([key, value]) => ({
    x: truncateString(continuous ? parseContinuousBucket(key) : key, 8),
    fullName: continuous ? parseContinuousBucket(key) : key,
    y: displayPercent ? (value / yTotal) * 100 : value,
    yCount: value,
    yTotal,
  }));

  return continuous
    ? mappedData
    : mappedData.sort((a, b) => b.yCount - a.yCount);
};

interface ResultProps {
  readonly data: Record<string, number>;
  readonly isFetching: boolean;
  readonly noData: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly continuous: boolean;
}

const Result: React.FC<ResultProps> = ({
  data,
  isFetching,
  field,
  fieldName,
  continuous,
  noData,
}: ResultProps) => {
  const [displayPercent, setDisplayPercent] = useState(false);
  const barChartData = formatBarChartData(data, displayPercent, continuous);
  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field.split(".").at(-2)]]
      .DEFAULT;

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : noData ? (
        <div className="h-full w-full flex">
          <p className="m-auto">No data for this field</p>
        </div>
      ) : (
        <>
          <RadioGroup
            size="sm"
            className="p-2"
            onChange={(e) => setDisplayPercent(e === "percent")}
            defaultValue={"counts"}
          >
            <Radio value="counts" label="# of Cases" />
            <Radio value="percent" label="% of Cases" />
          </RadioGroup>
          <div className="h-64">
            <VictoryBarChart
              data={barChartData}
              color={color}
              yLabel={displayPercent ? "% of Cases" : "# Cases"}
              width={900}
              height={500}
            />
          </div>
          <div className="flex justify-between p-2">
            <Select
              placeholder="Select Action"
              data={[{ value: "download", label: "Download TSV" }]}
            />
            <Select
              placeholder="Customize Bins"
              data={[{ value: "download", label: "Edit Bins" }]}
            />
          </div>
          <CDaveTable fieldName={fieldName} data={barChartData} />
        </>
      )}
    </>
  );
};

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: ReadonlyArray<{
    fullName: string;
    yCount: number;
    yTotal: number;
  }>;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data,
}: CDaveTableProps) => {
  return (
    <div className="h-48 block overflow-auto w-full">
      <table className="bg-white w-full text-left text-nci-gray-darker mb-2">
        <thead className="bg-nci-gray-lightest font-bold">
          <tr>
            <th>Select</th>
            <th>{fieldName}</th>
            <th># Cases</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr
              className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
              key={`${fieldName}-${d.fullName}`}
            >
              <td>
                <Checkbox />
              </td>
              <td>{d.fullName}</td>
              <td>
                {d.yCount.toLocaleString()} (
                {(d.yCount / d.yTotal).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })}
                )
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CDaveCard;
