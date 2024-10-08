import React, { useContext, useState, useEffect, useRef } from "react";
import { MdRestartAlt as ResetIcon } from "react-icons/md";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { Box, Menu, Tooltip, Loader, ActionIcon } from "@mantine/core";
import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";
import isNumber from "lodash/isNumber";
import { useMouse } from "@mantine/hooks";
import saveAs from "file-saver";
import {
  SummaryModalContext,
  DownloadProgressContext,
} from "src/utils/contexts";
import { DashboardDownloadContext } from "@/utils/contexts";
import OffscreenWrapper from "@/components/OffscreenWrapper";
import {
  MINIMUM_CASES,
  SurvivalPlotLegend,
  SurvivalPlotProps,
  SurvivalPlotTypes,
} from "./types";
import { useSurvival } from "./useSurvival";
import {
  buildManyLegend,
  buildOnePlotLegend,
  buildTwoPlotLegend,
  DAYS_IN_MONTH_ROUNDED,
  enoughData,
  enoughDataOnSomeCurves,
} from "./utils";
import { handleDownloadPNG, handleDownloadSVG } from "../utils";
import { DAYS_IN_YEAR } from "@gff/core";

const ExternalDownloadStateSurvivalPlot: React.FC<SurvivalPlotProps> = ({
  data,
  names = [],
  plotType = SurvivalPlotTypes.mutation,
  title = "Overall Survival Plot",
  hideLegend = false,
  height = 380,
  field,
  downloadFileName = "survival-plot",
  tableTooltip = false,
  noDataMessage = "",
  isLoading,
}: SurvivalPlotProps) => {
  // handle the current range of the xAxis: set to "undefined" to reset
  const [xDomain, setXDomain] = useState(undefined);
  const [survivalPlotLineTooltipContent, setSurvivalPlotLineTooltipContent] =
    useState(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // for survival plot tooltip
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const pValue = data?.overallStats?.pValue;
  const plotData = data?.survivalData ?? [];

  const hasEnoughData = [
    "gene",
    "mutation",
    "categorical",
    "continuous",
    "cohortComparison",
  ].includes(plotType)
    ? enoughDataOnSomeCurves(plotData)
    : enoughData(plotData);

  const { setEntityMetadata } = useContext(SummaryModalContext);
  const shouldPlot =
    hasEnoughData &&
    plotData
      .map(({ donors }) => donors)
      .every(({ length }) => length >= MINIMUM_CASES);
  // hook to call renderSurvivalPlot
  const shouldUsePlotData =
    (["gene", "mutation"].includes(plotType) && shouldPlot) ||
    (["categorical", "continuous", "overall", "cohortComparison"].includes(
      plotType,
    ) &&
      hasEnoughData);
  const dataToUse = shouldUsePlotData ? plotData : [];
  const container = useSurvival(
    dataToUse,
    xDomain,
    setXDomain,
    height,
    setSurvivalPlotLineTooltipContent,
    setEntityMetadata,
  );

  const containerForDownload = useSurvival(
    hasEnoughData ? plotData : [],
    xDomain,
    setXDomain,
    height > 380 ? height : 380,
    setSurvivalPlotLineTooltipContent,
  );

  let legend: SurvivalPlotLegend[];
  switch (plotType) {
    case SurvivalPlotTypes.overall:
      legend = buildOnePlotLegend(plotData, "Explorer");
      break;
    case SurvivalPlotTypes.gene:
      legend = buildTwoPlotLegend(plotData, names[0], plotType);
      break;
    case SurvivalPlotTypes.mutation:
      legend = buildTwoPlotLegend(plotData, names[0], plotType);
      break;
    case SurvivalPlotTypes.categorical:
      legend = buildManyLegend(plotData, names, field, plotType);
      break;
    case SurvivalPlotTypes.continuous:
      legend = buildManyLegend(plotData, names, field, plotType);
      break;
    case SurvivalPlotTypes.cohortComparison:
      legend = buildTwoPlotLegend(plotData, names[0], plotType);
      break;
  }

  const handleDownloadJSON = async () => {
    const blob = new Blob(
      [
        JSON.stringify(
          plotData.map((element, index) => ({
            meta: { ...element.meta, label: `S${index + 1}` },
            donors: element.donors.map((donor) => ({
              ...donor,
              time: Math.round(donor.time * DAYS_IN_YEAR), // Converting to actual days from API
            })),
          })),
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    saveAs(blob, `${downloadFileName}.json`);
  };

  const handleDownloadTSV = async () => {
    if (plotData.length === 0) {
      return;
    }

    const showLabel = plotType !== SurvivalPlotTypes.overall;

    const header = [
      "id",
      "time (days)",
      "time (months)",
      "time (years)",
      "censored",
      "survivalEstimate",
      "submitter_id",
      "project_id",
    ];

    if (showLabel) {
      header.push("label");
    }

    const body = plotData
      .map((element, index) =>
        element.donors
          .map((row) => {
            const timeDays = Math.round(row.time * DAYS_IN_YEAR); // Converting to actual days from API
            const timeMonths = Math.round(timeDays / DAYS_IN_MONTH_ROUNDED);
            const timeYears = row.time.toFixed(1);

            const rowValues = [
              row.id,
              timeDays,
              timeMonths,
              timeYears,
              row.censored,
              row.survivalEstimate,
              row.submitter_id,
              row.project_id,
            ];

            if (showLabel) {
              rowValues.push(`S${index + 1}`);
            }

            return rowValues.join("\t");
          })
          .join("\n"),
      )
      .join("\n");

    const tsv = [header.join("\t"), body].join("\n");
    const blob = new Blob([tsv], { type: "text/csv" });

    saveAs(blob, `${downloadFileName}.tsv`);
  };

  const { dispatch } = useContext(DashboardDownloadContext);
  useEffect(() => {
    const charts = [{ filename: downloadFileName, chartRef: downloadRef }];

    dispatch({ type: "add", payload: charts });
    return () => dispatch({ type: "remove", payload: charts });
  }, [dispatch, downloadFileName]);

  const { downloadInProgress, setDownloadInProgress } = useContext(
    DownloadProgressContext,
  );

  // handle errors
  if (!(dataToUse.length > 0) && !isLoading && noDataMessage) {
    return <div className="py-1">{noDataMessage}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center flex-wrap">
        <div className="text-montserrat text-[1rem]">{title}</div>
        <div className="flex items-center ml-auto gap-1">
          <Menu
            position="bottom-start"
            offset={1}
            transitionProps={{ duration: 0 }}
          >
            <Menu.Target>
              <Tooltip label="Download Survival Plot data or image">
                <ActionIcon
                  data-testid="button-download-survival-plot"
                  aria-label="Download Survival Plot data or image"
                  variant="outline"
                >
                  {downloadInProgress ? (
                    <Loader size={16} />
                  ) : (
                    <DownloadIcon size="1rem" aria-hidden="true" />
                  )}
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown data-testid="list-download-survival-plot-dropdown">
              <Menu.Item
                onClick={async () => {
                  setDownloadInProgress(true);
                  await handleDownloadSVG(
                    downloadRef,
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
                    downloadRef,
                    `${downloadFileName}.png`,
                  );
                  setDownloadInProgress(false);
                }}
              >
                PNG
              </Menu.Item>
              <Menu.Item onClick={handleDownloadJSON}>JSON</Menu.Item>
              <Menu.Item onClick={handleDownloadTSV}>TSV</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Tooltip label="Reset Survival Plot Zoom">
            <ActionIcon
              variant="outline"
              onClick={() => setXDomain(undefined)}
              data-testid="button-reset-survival-plot"
              aria-label="Reset Survival Plot Zoom"
            >
              <ResetIcon size="1rem" aria-hidden="true" />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col">
        {!hideLegend &&
          legend?.map((x, idx) => {
            return (
              <div
                data-testid="text-cases-with-survival-data"
                key={`${x.key}-${idx}`}
                className="text-sm"
              >
                {x.value}
              </div>
            );
          })}

        <div className="mt-2">
          <Tooltip
            label={
              <div>
                Value shows 0.00e+0 because the
                <br />
                P-Value is extremely low and goes beyond
                <br />
                the precision inherent in the code
              </div>
            }
            disabled={pValue !== 0}
          >
            <div className="text-xs font-content">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </Tooltip>
        </div>
        {tableTooltip && (
          <div className="text-xs font-content">
            Use the Survival buttons <SurvivalIcon className="inline-block" />{" "}
            in the table below to change the survival plot
          </div>
        )}
        <div className="flex justify-end text-xs text-primary-content font-content">
          drag to zoom
        </div>
      </div>
      <div ref={mouseRef} className="relative">
        <Box
          className="w-36"
          style={{
            top: y + 20,
            left: x < 150 ? x - 20 : x - 100,
            position: "absolute",
            zIndex: 200,
          }}
        >
          {survivalPlotLineTooltipContent}
        </Box>
        <div className="survival-plot" ref={container} />
      </div>
      <OffscreenWrapper>
        <div className="w-[700px] h-[500px] m-2" ref={downloadRef}>
          <div className="font-content text-[1rem]">{title}</div>
          <div className="flex flex-col">
            {!hideLegend &&
              legend?.map((x, idx) => {
                return (
                  <div key={`${x.key}-${idx}`} className="text-sm">
                    {x.value}
                  </div>
                );
              })}
            <div className="text-xs font-content mt-2">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </div>
          <div className="survival-plot" ref={containerForDownload} />
        </div>
      </OffscreenWrapper>
    </div>
  );
};

const SurvivalPlot = (props: SurvivalPlotProps) => {
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  return (
    <DownloadProgressContext.Provider
      value={{ downloadInProgress, setDownloadInProgress }}
    >
      <ExternalDownloadStateSurvivalPlot {...props} />
    </DownloadProgressContext.Provider>
  );
};

export { ExternalDownloadStateSurvivalPlot };
export default SurvivalPlot;
