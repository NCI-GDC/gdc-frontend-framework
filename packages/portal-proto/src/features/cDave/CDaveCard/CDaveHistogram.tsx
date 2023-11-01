import { useState, useRef, useContext, useEffect } from "react";
import { ActionIcon, Radio, Loader, Menu, Tooltip } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import tailwindConfig from "tailwind.config";
import OffscreenWrapper from "@/components/OffscreenWrapper";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { convertDateToString } from "@/utils/date";
import {
  DashboardDownloadContext,
  DownloadProgressContext,
} from "@/utils/contexts";
import VictoryBarChart from "../../charts/VictoryBarChart";
import { COLOR_MAP } from "../constants";
import { toDisplayName } from "../utils";
import { DisplayData } from "../types";

const formatBarChartData = (
  data: DisplayData,
  yTotal: number,
  displayPercent: boolean,
) => {
  const mappedData = data.map(({ displayName, key, count }) => ({
    x: key,
    fullName: displayName,
    key,
    y: displayPercent ? (count / yTotal) * 100 : count,
    yCount: count,
    yTotal,
  }));

  return mappedData;
};

interface HistogramProps {
  readonly data: DisplayData;
  readonly yTotal: number;
  readonly isFetching: boolean;
  readonly noData: boolean;
  readonly field: string;
  readonly hideYTicks?: boolean;
}

const CDaveHistogram: React.FC<HistogramProps> = ({
  data,
  yTotal,
  isFetching,
  field,
  noData,
  hideYTicks = false,
}: HistogramProps) => {
  const [displayPercent, setDisplayPercent] = useState(false);
  const downloadChartRef = useRef<HTMLElement>();
  const { downloadInProgress, setDownloadInProgress } = useContext(
    DownloadProgressContext,
  );

  const barChartData = formatBarChartData(data, yTotal, displayPercent);

  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field.split(".").at(-2)]]
      ?.DEFAULT;
  const hideXTicks = barChartData.length > 20;
  const fieldName = toDisplayName(field);
  const downloadFileName = `${field
    .split(".")
    .at(-1)}-bar-chart.${convertDateToString(new Date())}`;
  const jsonData = barChartData.map((b) => ({ label: b.fullName, value: b.y }));

  const { dispatch } = useContext(DashboardDownloadContext);
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
              className="px-2 flex flex-row gap-2"
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
                    {downloadInProgress ? (
                      <Loader size={16} />
                    ) : (
                      <DownloadIcon className="text-primary" />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={async () => {
                    setDownloadInProgress(true);
                    await handleDownloadSVG(
                      downloadChartRef,
                      `${downloadFileName}.svg`,
                    );
                    setDownloadInProgress(false);
                  }}
                >
                  SVG
                </Menu.Item>
                <Menu.Item
                  onClick={async () => {
                    setDownloadInProgress(true);
                    await handleDownloadPNG(
                      downloadChartRef,
                      `${downloadFileName}.png`,
                    );
                    setDownloadInProgress(false);
                  }}
                >
                  PNG
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href={`data:text/json;charset=utf-8, ${encodeURIComponent(
                    JSON.stringify(jsonData, null, 2),
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
              title={`${fieldName} histogram`}
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
          <OffscreenWrapper>
            <VictoryBarChart
              data={barChartData.map((d) => ({ ...d, x: d.fullName }))}
              color={color}
              yLabel={displayPercent ? "% of Cases" : "# of Cases"}
              chartLabel={fieldName}
              width={1200}
              height={900}
              chartPadding={{ left: 150, right: 300, bottom: 400, top: 50 }}
              hideXTicks={hideXTicks}
              hideYTicks={hideYTicks}
              xLabel={
                hideXTicks
                  ? "For the list of histogram values, download the seperate TSV file"
                  : undefined
              }
              chartRef={downloadChartRef}
            />
          </OffscreenWrapper>
        </>
      )}
    </>
  );
};

export default CDaveHistogram;
