import { useState } from "react";
import { ActionIcon, Radio, Loader, Menu, Tooltip } from "@mantine/core";
import { MdDownload as DownloadIcon } from "react-icons/md";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import VictoryBarChart from "../../charts/VictoryBarChart";
import { CategoricalBins } from "../types";

import { COLOR_MAP } from "../constants";
import { flattenBinnedData } from "../utils";

const formatBarChartData = (
  data: Record<string, number>,
  yTotal: number,
  displayPercent: boolean,
  continuous: boolean,
) => {
  const mappedData = Object.entries(data || {}).map(([key, value]) => ({
    x: truncateString(key, 8),
    fullName: key,
    key,
    y: displayPercent ? (value / yTotal) * 100 : value,
    yCount: value,
    yTotal,
  }));

  return continuous
    ? mappedData
    : mappedData.sort((a, b) => b.yCount - a.yCount);
};

interface HistogramProps {
  readonly data: Record<string, number>;
  readonly yTotal: number;
  readonly isFetching: boolean;
  readonly noData: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly continuous: boolean;
  readonly customBinnedData?: CategoricalBins;
}

const CDaveHistogram: React.FC<HistogramProps> = ({
  data,
  yTotal,
  isFetching,
  field,
  continuous,
  noData,
  customBinnedData = null,
}: HistogramProps) => {
  const [displayPercent, setDisplayPercent] = useState(false);
  const barChartData = formatBarChartData(
    customBinnedData !== null ? flattenBinnedData(customBinnedData) : data,
    yTotal,
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
            <Radio.Group
              size="sm"
              className="p-2"
              onChange={(e) => setDisplayPercent(e === "percent")}
              defaultValue={"counts"}
            >
              <Radio value="counts" label="# of Cases" color="nci-blue" />
              <Radio value="percent" label="% of Cases" color="nci-blue" />
            </Radio.Group>
            <Menu>
              <Menu.Target>
                <Tooltip label="Download image or data" withArrow withinPortal>
                  <ActionIcon
                    variant="outline"
                    className="text-nci-blue-darkest border-nci-blue-darkest"
                    aria-label="Download image or data"
                  >
                    <DownloadIcon />
                  </ActionIcon>
                </Tooltip>
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
        </>
      )}
    </>
  );
};

export default CDaveHistogram;
