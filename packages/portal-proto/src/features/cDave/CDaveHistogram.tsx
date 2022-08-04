import { useState, useEffect } from "react";
import { mapKeys } from "lodash";
import { ActionIcon, RadioGroup, Radio, Loader, Menu } from "@mantine/core";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { Statistics, Bucket } from "@gff/core";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import { useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";

import { COLOR_MAP } from "./constants";
import { createBuckets, parseContinuousBucket } from "./utils";

interface ContinuousHistogramProps {
  readonly field: string;
  readonly fieldName: string;
  readonly stats: Statistics;
  readonly setResultData: (data: Record<string, number>) => void;
}
export const ContinuousHistogram: React.FC<ContinuousHistogramProps> = ({
  field,
  stats,
  fieldName,
  setResultData,
}: ContinuousHistogramProps) => {
  const ranges = createBuckets(stats);
  const { data, isFetching } = useRangeFacet(
    field,
    ranges,
    "cases",
    "repository",
  );

  useEffect(() => {
    setResultData(data);
  }, []);

  return (
    <CDaveHistogram
      field={field}
      fieldName={fieldName}
      data={data}
      isFetching={isFetching}
      continuous={true}
      noData={stats.count === 0}
    />
  );
};

interface CategoricalHistogramProps {
  readonly field: string;
  readonly fieldName: string;
  readonly data: readonly Bucket[];
  readonly setResultData: (data: Record<string, number>) => void;
  readonly customBinnedData: Record<string, number>;
}
export const CategoricalHistogram: React.FC<CategoricalHistogramProps> = ({
  field,
  fieldName,
  data,
  setResultData,
  customBinnedData,
}: CategoricalHistogramProps) => {
  const resultData = Object.fromEntries(
    (data || []).map((d) => [d.key, d.doc_count]),
  );

  useEffect(() => {
    setResultData(resultData);
  }, []);

  return (
    <CDaveHistogram
      field={field}
      fieldName={fieldName}
      data={resultData}
      isFetching={false}
      continuous={false}
      noData={
        data !== undefined && data.every((bucket) => bucket.key === "_missing")
      }
      customBinnedData={customBinnedData}
    />
  );
};

const toBucketDisplayName = (bucket: string): string => {
  const [fromValue, toValue] = parseContinuousBucket(bucket);

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
    x: truncateString(continuous ? toBucketDisplayName(key) : key, 8),
    fullName: continuous ? toBucketDisplayName(key) : key,
    key,
    y: displayPercent ? (value / yTotal) * 100 : value,
    yCount: value,
    yTotal,
  }));

  return continuous
    ? mappedData
    : mappedData.sort((a, b) => b.yCount - a.yCount);
};

const flattenBinnedData = (binnedData) => {
  const flattenedValues = {};

  Object.entries(binnedData).forEach(([k, v]) => {
    if (Number.isInteger(v)) {
      flattenedValues[k] = v;
    } else {
      flattenedValues[k] = Object.values(v).reduce((a, b) => a + b);
    }
  });

  return flattenedValues;
};

interface HistogramProps {
  readonly data: Record<string, number>;
  readonly isFetching: boolean;
  readonly noData: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly continuous: boolean;
  readonly customBinnedData?: Record<string, number>;
}

const CDaveHistogram: React.FC<HistogramProps> = ({
  data,
  isFetching,
  field,
  continuous,
  noData,
  customBinnedData = {},
}: HistogramProps) => {
  const [displayPercent, setDisplayPercent] = useState(false);
  const barChartData = formatBarChartData(
    Object.keys(customBinnedData).length > 0
      ? flattenBinnedData(customBinnedData)
      : data,
    displayPercent,
    continuous,
  );

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
            <RadioGroup
              size="sm"
              className="p-2"
              onChange={(e) => setDisplayPercent(e === "percent")}
              defaultValue={"counts"}
            >
              <Radio value="counts" label="# of Cases" />
              <Radio value="percent" label="% of Cases" />
            </RadioGroup>
            <Menu
              control={
                <ActionIcon
                  variant="outline"
                  className="text-nci-blue-darkest border-nci-blue-darkest"
                >
                  <DownloadIcon />
                </ActionIcon>
              }
            >
              <Menu.Item>SVG</Menu.Item>
              <Menu.Item>PNG</Menu.Item>
              <Menu.Item>JSON</Menu.Item>
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
        </>
      )}
    </>
  );
};
