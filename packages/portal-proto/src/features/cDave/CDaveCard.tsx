import { useState, useEffect } from "react";
import {
  Card,
  ActionIcon,
  Tooltip,
  Checkbox,
  Radio,
  Loader,
  Menu,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
  MdDownload as DownloadIcon,
  MdArrowDropDown as DownIcon,
} from "react-icons/md";
import { mapKeys } from "lodash";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Statistics,
  Buckets,
  Bucket,
  Stats,
} from "@gff/core";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import { useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, toDisplayName } from "./utils";
import FunctionButton from "@/components/FunctionButton";

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
    <Card
      className="h-[580px] p-2 shadow-lg my-2 border border-base-lightest"
      ref={(ref) => (targetRef.current = ref)}
    >
      <div className="flex justify-between mb-1">
        <h2>{fieldName}</h2>
        <div className="flex gap-1">
          <Tooltip label={"Histogram"} withArrow>
            <ActionIcon
              variant="outline"
              className={
                chartType === ChartTypes.histogram
                  ? "bg-primary-darkest text-primary-content-max"
                  : "border-primary-darkest"
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
      {data && facet ? (
        CONTINUOUS_FACET_TYPES.includes(facet?.type) ? (
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
        )
      ) : null}
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
      noData={
        data !== undefined && data.every((bucket) => bucket.key === "_missing")
      }
    />
  );
};

const parseContinuousBucket = (bucket: string): string => {
  const [fromValue, toValue] = bucket
    .split("-")
    .map((val, idx, src) => (src[idx - 1] === "" ? `-${val}` : val))
    .filter((val) => val !== "");

  return `${Number(Number(fromValue).toFixed(2))} to <${Number(
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
      ?.DEFAULT;
  const hideXTicks = barChartData.length > 20;

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : noData ? (
        <div className="h-full w-full flex">
          <p className="m-auto">No data for this property</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between p-2">
            <Radio.Group
              size="sm"
              color={"secondary"}
              className="p-2"
              onChange={(e) => setDisplayPercent(e === "percent")}
              defaultValue={"counts"}
            >
              <Radio
                classNames={{
                  radio: "checked:bg-accent focus:bg-accent-light",
                }}
                value="counts"
                label="# of Cases"
              />
              <Radio
                classNames={{
                  radio: "checked:bg-accent focus:bg-accent-light",
                }}
                value="percent"
                label="% of Cases"
              />
            </Radio.Group>
            <Menu>
              <Menu.Target>
                <ActionIcon
                  variant="outline"
                  className="text-primary-content-darkest border-primary-darkest"
                >
                  <DownloadIcon />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>SVG</Menu.Item>
                <Menu.Item>PNG</Menu.Item>
                <Menu.Item>JSON</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <div className="h-64">
            <VictoryBarChart
              data={barChartData}
              color={color}
              yLabel={displayPercent ? "% of Cases" : "# of Cases"}
              width={900}
              height={500}
              hideXTicks={hideXTicks}
              xLabel={
                hideXTicks
                  ? "Mouse over the histogram to see x-axis labels"
                  : undefined
              }
            />
          </div>
          <div className="flex justify-between p-2">
            <div className={"flex flex-row nowrap"}>
              <Menu>
                <Menu.Target>
                  <FunctionButton rightIcon={<DownIcon size={20} />}>
                    Select Action
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item disabled>Save as a new cohort</Menu.Item>
                  <Menu.Item disabled>Add to cohort</Menu.Item>
                  <Menu.Item disabled>Remove from cohort</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <FunctionButton className="ml-2">TSV</FunctionButton>
            </div>
            <Menu>
              <Menu.Target>
                <FunctionButton rightIcon={<DownIcon size={20} />}>
                  Customize Bins
                </FunctionButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Edit Bins</Menu.Item>
                <Menu.Item disabled>Reset to Default</Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
      <table className="bg-base-lightest w-full text-left text-base-contrast-lightest mb-2">
        <thead className="bg-base-lightest font-bold">
          <tr>
            <th>Select</th>
            <th>{fieldName}</th>
            <th className="text-right"># Cases</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr
              className={
                idx % 2
                  ? "bg-base-lightest hover:bg-base-lighter hover:text-base-contrast-lighter"
                  : "bg-accent-cool-lightest hover:bg-accent-cool-lighter hover:text-accent-cool-contrast-lighter"
              }
              key={`${fieldName}-${d.fullName}`}
            >
              <td>
                <Checkbox />
              </td>
              <td>{d.fullName}</td>
              <td className="text-right">
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
