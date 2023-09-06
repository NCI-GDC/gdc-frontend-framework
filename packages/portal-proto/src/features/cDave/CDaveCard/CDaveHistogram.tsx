import { useState, useRef, useContext, useEffect } from "react";
import { ActionIcon, Radio, Loader, Menu, Tooltip } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import VictoryBarChart from "../../charts/VictoryBarChart";
import { CategoricalBins } from "../types";
import { COLOR_MAP } from "../constants";
import { flattenBinnedData } from "../utils";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { convertDateToString } from "@/utils/date";
import { DashboardDownloadContext } from "../Dashboard";
import { toDisplayName } from "../utils";

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
  const downloadChartRef = useRef<HTMLElement>();
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
  const fieldName = toDisplayName(field);
  const downloadFileName = `${field
    .split(".")
    .at(-1)}-bar-chart.${convertDateToString(new Date())}`;
  const jsonData = barChartData.map((b) => ({ label: b.fullName, value: b.y }));

  const dispatch = useContext(DashboardDownloadContext);
  useEffect(() => {
    const charts = [{ filename: downloadFileName, chartRef: downloadChartRef }];

    dispatch({ type: "add", payload: charts });
    return () => dispatch({ type: "remove", payload: charts });
  }, [dispatch, downloadFileName]);

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
                data-testid="radio-number-of-cases"
                classNames={{ label: "font-heading pl-1" }}
                value="counts"
                label="# of Cases"
                color="nci-blue"
              />
              <Radio
                data-testid="radio-percent-of-cases"
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
                    data-testid="button-histogram-download"
                    variant="outline"
                    className="bg-base-max border-primary"
                    aria-label="Download image or data"
                  >
                    <DownloadIcon className="text-primary" />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() =>
                    handleDownloadSVG(
                      downloadChartRef,
                      `${downloadFileName}.svg`,
                    )
                  }
                >
                  SVG
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    handleDownloadPNG(
                      downloadChartRef,
                      `${downloadFileName}.png`,
                    )
                  }
                >
                  PNG
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href={`data:text/json;charset=utf-8, ${encodeURIComponent(
                    JSON.stringify(jsonData, null, 2), // prettify JSON
                  )}`}
                  download={`${downloadFileName}.json`}
                >
                  JSON
                </Menu.Item>
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
          {/* The chart for downloads is slightly different so render another chart offscreen */}
          <div
            className="h-64 absolute left-[-1000px]"
            aria-hidden="true"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore https://github.com/facebook/react/pull/24730 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
            inert=""
          >
            <VictoryBarChart
              data={barChartData}
              color={color}
              yLabel={displayPercent ? "% of Cases" : "# of Cases"}
              chartLabel={fieldName}
              width={900}
              height={500}
              hideXTicks={hideXTicks}
              hideYTicks={hideYTicks}
              xLabel={
                hideXTicks
                  ? "For the list of histogram values, download the seperate TSV file"
                  : undefined
              }
              chartRef={downloadChartRef}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CDaveHistogram;
