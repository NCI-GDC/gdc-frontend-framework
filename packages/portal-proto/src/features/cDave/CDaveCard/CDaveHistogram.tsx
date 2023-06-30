import { useState } from "react";
import { ActionIcon, Radio, Loader, Menu, Tooltip } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
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
  const hideYTicks = continuous && barChartData.every((d) => d.yCount === 0);

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
          <div className="flex flex-row justify-between pl-2 pr-0">
            <Radio.Group
              size="sm"
              className="px-2"
              onChange={(value) => setDisplayPercent(value === "percent")}
              defaultValue={"counts"}
            >
              <Radio
                classNames={{ label: "font-heading pl-1" }}
                value="counts"
                label="# of Cases"
                color="nci-blue"
              />
              <Radio
                classNames={{ label: "font-heading pl-1" }}
                value="percent"
                label="% of Cases"
                color="nci-blue"
              />
            </Radio.Group>
            <Menu>
              <Menu.Target>
                <Tooltip
                  label="Download image or data"
                  withArrow
                  withinPortal
                  position={"left"}
                >
                  <ActionIcon
                    variant="outline"
                    className="bg-base-max border-primary"
                    aria-label="Download image or data"
                  >
                    <DownloadIcon className="text-primary" />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>SVG (Coming soon)</Menu.Item>
                <Menu.Item>PNG (Coming soon)</Menu.Item>
                <Menu.Item>JSON (Coming soon)</Menu.Item>
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
              hideYTicks={hideYTicks}
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
