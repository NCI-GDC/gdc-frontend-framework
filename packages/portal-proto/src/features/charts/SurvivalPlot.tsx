import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Survival, SurvivalElement } from "@gff/core";
import { renderPlot } from "@oncojs/survivalplot";
import { MdRestartAlt as ResetIcon } from "react-icons/md";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { Box, Menu, Tooltip } from "@mantine/core";
import isNumber from "lodash/isNumber";
import { useMouse, useResizeObserver } from "@mantine/hooks";
import saveAs from "file-saver";
import { handleDownloadSVG, handleDownloadPNG } from "./utils";
import { entityMetadataType, SummaryModalContext } from "src/utils/contexts";
import { DownloadButton } from "@/components/tailwindComponents";
// based on schemeCategory10
// 4.5:1 colour contrast for normal text
interface SurvivalPlotLegend {
  key: string;
  style?: Record<string, string | number>;
  value: string | JSX.Element;
}

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
  height: number,
  setTooltip?: (x?: any) => any,
  setEntityMetadata?: Dispatch<SetStateAction<entityMetadataType>>,
) => MutableRefObject<any>;

export const useSurvival: survival = (
  data,
  xDomain,
  setXDomain,
  height,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTooltip = (x?) => null,
  setEntityMetadata,
) => {
  const [ref, rect] = useResizeObserver();

  useLayoutEffect(() => {
    ref.current
      ? renderPlot({
          height,
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
              <div className="font-montserrat text-xs bg-base-darkest text-base-contrast-darkest shadow-md p-1">
                <span className="font-bold">Case ID:&#160;</span>
                {`${project_id} / ${submitter_id}`}
                <br />
                <span className="font-bold">Survival Rate:&#160;</span>
                {`${Math.round(survivalEstimate * 100)}%`}
                <br />

                <span className="font-bold">
                  {censored
                    ? "Interval of last follow-up: "
                    : "Time of Death: "}
                </span>
                {censored
                  ? `${time.toLocaleString()} years`
                  : `${time.toLocaleString()} years`}
              </div>,
            );
          },
          onClickDonor: (e, { id }) => {
            setEntityMetadata({
              entity_type: "case",
              entity_id: id,
            });
          },

          onMouseLeaveDonor: () => setTooltip(undefined),
        })
      : null;
  }, [
    ref,
    data,
    xDomain,
    setXDomain,
    setTooltip,
    height,
    rect,
    setEntityMetadata,
  ]);

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
            <div className="text-gdc-survival-0 font-content">
              S<sub>1</sub>
              {` (N = ${getCaseCount(results2.length > 0)})`}
              {["mutation", "gene"].includes(plotType) && (
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
            <div className="text-gdc-survival-1 font-content">
              S<sub>2</sub>
              {` (N = ${getCaseCount(results2.length === 0)})`}
              {["mutation", "gene"].includes(plotType) && (
                <span>
                  {" - "}
                  {name}
                  {` Mutated ${plotType === "gene" ? `(SSM/CNV)` : ``} Cases`}
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
                    <span className="font-content">
                      Not enough data to compare
                    </span>
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
          value: (
            <span className="font-content">{`Not enough survival data for ${name}`}</span>
          ),
        },
      ];
};

const buildManyLegend = (
  data: readonly SurvivalElement[],
  names: readonly string[],
  field: string,
  plotType: SurvivalPlotTypes,
) => {
  const hasEnoughDataOnSomeCurves = enoughDataOnSomeCurves(data);

  return hasEnoughDataOnSomeCurves
    ? data.map((r, i) => {
        return data.length === 0
          ? {
              key: `${names[i]}-cannot-compare`,
              style: {
                marginTop: 5,
                width: "100%",
              },
              value: (
                <div className="font-content">
                  <span>Not enough data to compare</span>
                </div>
              ),
            }
          : r.donors.length < MINIMUM_CASES
          ? {
              key: `${names[i]}-not-enough-data`,
              value: (
                <span
                  className={`text-gdc-survival-${i} font-content`}
                >{`Not enough survival data for ${names[i]}`}</span>
              ),
            }
          : {
              key: names[i],
              value: (
                <span className={`text-gdc-survival-${i} font-content`}>
                  S<sub>{i + 1}</sub>
                  {` (N = ${r.donors.length.toLocaleString()})`}
                  {plotType === SurvivalPlotTypes.categorical && (
                    <span>{` - ${names[i]}`}</span>
                  )}
                </span>
              ),
            };
      })
    : [
        {
          key: `${field}-not-enough-data`,
          value: (
            <span className="font-content">
              Not enough survival data for this facet
            </span>
          ),
        },
      ];
};

export enum SurvivalPlotTypes {
  gene = "gene",
  mutation = "mutation",
  categorical = "categorical",
  continuous = "continuous",
  overall = "overall",
}

export interface SurvivalPlotProps {
  readonly data: Survival;
  readonly names?: ReadonlyArray<string>;
  readonly plotType?: SurvivalPlotTypes;
  readonly title?: string;
  readonly hideLegend?: boolean;
  readonly height?: number;
  readonly field?: string;
}

const SurvivalPlot: React.FC<SurvivalPlotProps> = ({
  data,
  names = [],
  plotType = SurvivalPlotTypes.mutation,
  title = "Overall Survival Plot",
  hideLegend = false,
  height = 380,
  field,
}: SurvivalPlotProps) => {
  // handle the current range of the xAxis: set to "undefined" to reset
  const [xDomain, setXDomain] = useState(undefined);
  const [survivalPlotLineTooltipContent, setSurvivalPlotLineTooltipContent] =
    useState(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // for survival plot tooltip
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const pValue = data.overallStats.pValue;
  const plotData = data.survivalData;

  const hasEnoughData = [
    "gene",
    "mutation",
    "categorical",
    "continuous",
  ].includes(plotType)
    ? enoughDataOnSomeCurves(plotData)
    : enoughData(plotData);

  const { setEntityMetadata } = useContext(SummaryModalContext);
  const shouldPlot =
    hasEnoughData &&
    plotData
      .map(({ donors }) => donors)
      .every(({ length }) => length > MINIMUM_CASES);
  // hook to call renderSurvivalPlot
  const shouldUsePlotData =
    (["gene", "mutation"].includes(plotType) && shouldPlot) || hasEnoughData;
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
    height,
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
  }

  const handleDownloadJSON = async () => {
    const blob = new Blob(
      [
        JSON.stringify(
          plotData.map((element, index) => ({
            meta: { ...element.meta, label: `S${index + 1}` },
            donors: element.donors,
          })),
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    saveAs(blob, "survival-plot.json");
  };

  const handleDownloadTSV = async () => {
    if (plotData.length === 0) {
      return;
    }

    const showLabel = plotType !== SurvivalPlotTypes.overall;

    const header = [
      "id",
      "time",
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
            const rowValues = [
              row.id,
              row.time,
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

    saveAs(blob, "survival-plot.tsv");
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-100 items-center justify-center flex-wrap">
        <div className="flex ml-auto text-montserrat text-lg">{title}</div>
        <div className="flex items-center ml-auto gap-1">
          <Menu position="bottom-start" offset={1} transitionDuration={0}>
            <Menu.Target>
              <Tooltip label="Download Survival Plot data or image">
                <DownloadButton
                  data-testid="button-download-survival-plot"
                  aria-label="Download button with an icon"
                >
                  <DownloadIcon size="1.25em" />
                </DownloadButton>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown data-testid="list-download-survival-plot-dropdown">
              <Menu.Item
                onClick={() =>
                  handleDownloadSVG(downloadRef, "survival-plot.svg")
                }
              >
                SVG
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  handleDownloadPNG(downloadRef, "survival-plot.png")
                }
              >
                PNG
              </Menu.Item>
              <Menu.Item onClick={handleDownloadJSON}>JSON</Menu.Item>
              <Menu.Item onClick={handleDownloadTSV}>TSV</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Tooltip label="Reset Survival Plot Zoom">
            <DownloadButton
              onClick={() => setXDomain(undefined)}
              data-testid="button-reset-survival-plot"
              aria-label="reset button with an icon"
            >
              <ResetIcon size="1.15rem"></ResetIcon>
            </DownloadButton>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center ">
        <div
          className={
            [
              SurvivalPlotTypes.categorical,
              SurvivalPlotTypes.continuous,
            ].includes(plotType)
              ? "flex flex-row flex-wrap justify-center"
              : undefined
          }
        >
          {!hideLegend &&
            legend?.map((x, idx) => {
              return (
                <div
                  data-testid="text-cases-with-survival-data"
                  key={`${x.key}-${idx}`}
                  className="px-2"
                >
                  {x.value}
                </div>
              );
            })}
        </div>
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
            <div className="text-xs font-content">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </Tooltip>
        </div>
        <div className="flex w-full justify-end text-xs mr-8 text-primary-content no-print font-content">
          drag to zoom
        </div>
      </div>
      <div ref={mouseRef} className="relative">
        <Box
          className="w-36"
          sx={{
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
      <div className="fixed top-0 -translate-y-full w-[700px] h-[500px]">
        <div ref={downloadRef}>
          <h2 className="text-montserrat text-center text-lg text-primary-content-dark">
            {title}
          </h2>
          <div className="flex flex-col items-center ">
            <div
              className={
                [
                  SurvivalPlotTypes.categorical,
                  SurvivalPlotTypes.continuous,
                ].includes(plotType)
                  ? "flex flex-row flex-wrap justify-center"
                  : undefined
              }
            >
              {!hideLegend &&
                legend?.map((x, idx) => {
                  return (
                    <div key={`${x.key}-${idx}`} className="px-2">
                      {x.value}
                    </div>
                  );
                })}
            </div>
            <div className="text-xs">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </div>
          <div className="survival-plot" ref={containerForDownload} />
        </div>
      </div>
    </div>
  );
};

export default SurvivalPlot;
