import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Survival, SurvivalElement } from "@gff/core";
import { renderPlot } from "@oncojs/survivalplot";
import {
  MdDownload as DownloadIcon,
  MdRestartAlt as ResetIcon,
} from "react-icons/md";
import { Box, Tooltip } from "@mantine/core";
import isNumber from "lodash/isNumber";
import { useMouse } from "@mantine/hooks";

// based on schemeCategory10
// 4.5:1 colour contrast for normal text
const textColors = [
  "#1F77B4",
  "#BD5800",
  "#258825",
  "#D62728",
  "#8E5FB9",
  "#8C564B",
  "#D42BA1",
  "#757575",
  "#7A7A15",
  "#10828E",
];

const SVG_MARGINS = {
  bottom: 40,
  left: 50,
  right: 20,
  top: 15,
};

export const MINIMUM_CASES = 10;
export const MAXIMUM_CURVES = 5;

type survival = (
  data: any,
  xDomain: any,
  setXDomain: any,
  setTooltip?: (x?: any) => any,
) => MutableRefObject<any>;

export const useSurvival: survival = (
  data,
  xDomain,
  setXDomain,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTooltip = (x?) => null,
) => {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current
      ? renderPlot({
          height: 380, // TODO: Figure out how to fix size of Survival Plot without setting this.
          container: ref.current,
          palette: textColors,
          margins: SVG_MARGINS,
          dataSets: data,
          shouldShowConfidenceIntervals: false,
          confidenceAreaOpacity: 0.2,
          xAxisLabel: "Duration (years)",
          yAxisLabel: "Survival Rate",
          xDomain: xDomain,
          onDomainChange: setXDomain,
          minimumDonors: MINIMUM_CASES,
          //   onClickDonor: (e, donor) => push({ pathname: `/cases/${donor.id}` }), //TODO: Add when case summary is working
          getSetSymbol: (curve, curves) =>
            curves.length === 1
              ? ""
              : `<tspan font-style="italic">S</tspan><tspan font-size="0.7em" baseline-shift="-25%">${
                  curves.indexOf(curve) + 1
                }</tspan>`,
          onMouseEnterDonor: (
            e,
            { censored, project_id, submitter_id, survivalEstimate, time = 0 },
          ) => {
            setTooltip(
              <div className="font-montserrat text-xs text-nci-gray-darkest shadow-md">
                {`Case ID: ${project_id} / ${submitter_id}`}
                <br />
                {`Survival Rate: ${Math.round(survivalEstimate * 100)}%`}
                <br />
                {censored
                  ? `Interval of last follow-up: ${time.toLocaleString()} years`
                  : `Time of Death: ${time.toLocaleString()} years`}
              </div>,
            );
          },
          onMouseLeaveDonor: () => setTooltip(undefined),
        })
      : null;
  }, [data, xDomain, setXDomain, setTooltip]);
  return ref;
};

const enoughData = (data: ReadonlyArray<SurvivalElement>) =>
  data && data.length && data.every((r) => r.donors.length >= MINIMUM_CASES);

const enoughDataOnSomeCurves = (data: ReadonlyArray<SurvivalElement>) =>
  data && data.length && data.some((r) => r.donors.length >= MINIMUM_CASES);

const buildOnePlotLegend = (data, name) => {
  const hasMultipleCurves = data.length > 0;
  const hasEnoughData = hasMultipleCurves
    ? enoughDataOnSomeCurves(data)
    : enoughData(data);
  return hasEnoughData
    ? name && [
        {
          key: name,
          value: `${data[0].donors.length.toLocaleString()} Cases with Survival Data`,
        },
      ]
    : [
        {
          key: `${name || ""}-not-enough-data`,
          value: "Not enough survival data",
        },
      ];
};

const buildTwoPlotLegend = (data, name: string, plotType: string) => {
  const hasEnoughData = enoughData(data);
  const results1 = data.length > 0 ? data[0].donors : [];
  const results2 = data.length > 1 ? data[1].donors : [];

  const getCaseCount = (condition) =>
    condition
      ? results1.length.toLocaleString()
      : results2.length.toLocaleString();

  return hasEnoughData
    ? [
        {
          key: `${name}-not-mutated`,
          value: (
            <div className="text-gdc-survival-0">
              S<sub>1</sub>
              {` (N = ${getCaseCount(results2.length > 0)})`}
              {plotType === "mutation" && (
                <span>
                  {" - "}
                  {name}
                  {" Not Mutated Cases"}
                </span>
              )}
            </div>
          ),
        },
        {
          key: `${name}-mutated`,
          value: (
            <div className="text-gdc-survival-1">
              S<sub>2</sub>
              {` (N = ${getCaseCount(results2.length === 0)})`}
              {plotType === "mutation" && (
                <span>
                  {" - "}
                  {name}
                  {" Mutated Cases"}
                </span>
              )}
            </div>
          ),
        },
        ...(results2.length === 0
          ? [
              {
                key: `${name}-cannot-compare`,
                value: (
                  <div>
                    <span>Not enough data to compare</span>
                  </div>
                ),
                style: {
                  width: "100%",
                  marginTop: 5,
                },
              },
            ]
          : []),
      ]
    : [
        {
          key: `${name}-not-enough-data`,
          value: <span>{`Not enough survival data for ${name}`}</span>,
        },
      ];
};

export interface SurvivalPlotProps {
  readonly data: Survival;
  readonly names?: ReadonlyArray<string>;
  readonly title?: string;
  readonly hideLegend?: boolean;
}

const SurvivalPlot: React.FC<SurvivalPlotProps> = ({
  data,
  names = [],
  title = "Overall Survival Plot",
  hideLegend = false,
}: SurvivalPlotProps) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  // handle the current range of the xAxis set to undefined to reset
  const [xDomain, setXDomain] = useState(undefined);
  const [survivalPlotLineTooltipContent, setSurvivalPlotLineTooltipContent] =
    useState(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // for survival plot tooltip

  const pValue = data.overallStats.pValue;
  const plotData = data.survivalData;

  const hasEnoughData = enoughData(plotData);

  // hook to call renderSurvivalPlot
  const container = useSurvival(
    hasEnoughData ? plotData : [], // TODO: when implementing CDave this likely will need more logic
    xDomain,
    setXDomain,
    setSurvivalPlotLineTooltipContent,
  );

  let legend;
  if (plotData.length === 1) {
    legend = buildOnePlotLegend(plotData, "Explorer");
  } else if (plotData.length === 2) {
    legend = buildTwoPlotLegend(plotData, names[0], "mutation");
  } else {
    legend = undefined;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-100 items-center justify-center flex-wrap items-center">
        <div className="flex ml-auto text-montserrat text-lg text-nci-gray-dark ">
          {title}
        </div>
        <div className="flex flex-row items-center ml-auto mt-2 ">
          <Tooltip label="Download SurvivalPlot data or image">
            <button
              className="px-1.5 min-h-[28px] nim-w-[40px] mx-1 border-nci-gray-light border rounded-[4px] transition-colors "
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
            >
              <DownloadIcon size="1.25em" />
            </button>
          </Tooltip>
          <Tooltip label="Reset SurvivalPlot Zoom">
            <button
              className="px-1.5 min-h-[28px] nim-w-[40px] border-nci-gray-light border rounded-[4px] transition-colors "
              onClick={() => setXDomain(undefined)}
            >
              <ResetIcon size="1.15rem"></ResetIcon>
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {!hideLegend &&
          legend?.map((x, idx) => {
            return <div key={`${x.key}-${idx}`}>{x.value}</div>;
          })}
        <div>
          <Tooltip
            label={
              pValue === 0 && (
                <div>
                  Value shows 0.00e+0 because the
                  <br />
                  P-Value is extremely low and goes beyond
                  <br />
                  the precision inherent in the code
                </div>
              )
            }
          >
            <div className="text-xs">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </Tooltip>
        </div>
        <div
          className={`flex flex-row w-full justify-end text-xs mr-8 text-nci-gray no-print`}
        >
          drag to zoom
        </div>
      </div>
      <div ref={mouseRef} className="relative">
        <Box
          className="bg-white min-w-[150px]"
          sx={{ left: x + 20, top: y - 20, position: "absolute" }}
        >
          {survivalPlotLineTooltipContent}
        </Box>
        <div className="survival-plot" ref={container} />
      </div>
    </div>
  );
};

export default SurvivalPlot;
