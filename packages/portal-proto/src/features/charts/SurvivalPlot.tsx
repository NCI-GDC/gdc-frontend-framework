import { useEffect, useRef, useState } from "react";
import { Survival, SurvivalElement } from "@gff/core";
import { renderPlot } from "@oncojs/survivalplot";
import { MdDownload as DownloadIcon, MdRestartAlt as ResetIcon } from "react-icons/md";
import { Tooltip } from "@mantine/core";
import dynamic from "next/dynamic";
import isNumber from "lodash/isNumber";

const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

const CHART_NAME = "survival-plot";

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

export const useSurvival = (data, xDomain, setXDomain, setTooltip = (x?) => null ) => {
  const ref =useRef(undefined);


  useEffect(() => {
    ref.current ?
    renderPlot({
      height: 380, // TODO: Figure out how to fix size of Survival Plot without setting this.
      container: ref.current,
      palette: textColors,
      margins: SVG_MARGINS,
      dataSets: data,
      shouldShowConfidenceIntervals: false,
      confidenceAreaOpacity: 0.2,
      xAxisLabel: 'Duration (years)',
      yAxisLabel: 'Survival Rate',
      xDomain: xDomain, onDomainChange: setXDomain,
      minimumDonors: MINIMUM_CASES,
   //   onClickDonor: (e, donor) => push({ pathname: `/cases/${donor.id}` }), //TODO: Add when case summary is working
      getSetSymbol: (curve, curves) => (
        curves.length === 1
          ? ''
          : `<tspan font-style="italic">S</tspan><tspan font-size="0.7em" baseline-shift="-25%">${
            curves.indexOf(curve) + 1
          }</tspan>`
      ),
        onMouseEnterDonor: (e, {
          censored,
          project_id,
          submitter_id,
          survivalEstimate,
          time = 0,
        }) => {
          setTooltip(
            <span>
            {`Case ID: ${project_id} / ${submitter_id}`}
              <br />
              {`Survival Rate: ${Math.round(survivalEstimate * 100)}%`}
              <br />
              {censored
                ? `Interval of last follow-up: ${time.toLocaleString()} years`
                : `Time of Death: ${time.toLocaleString()} years`}
          </span>
          );
        },
        onMouseLeaveDonor: () => setTooltip(),

      }
    ) : null;
  }, [data, xDomain, setXDomain]);
  return ref;
}

const enoughData = (data: SurvivalElement[]) => data &&
  data.length &&
  data.every(r => r.donors.length >= MINIMUM_CASES);

const enoughDataOnSomeCurves = (data: SurvivalElement[]) => data &&
  data.length &&
  data.some(r => r.donors.length >= MINIMUM_CASES);


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
        key: `${name || ''}-not-enough-data`,
        value: "Not enough survival data",
      },
    ];
}

const buildTwoPlotLegend  = (data, name: string, plotType:string) =>  {
  const hasEnoughData = enoughData(data);
  const results1 = data.length>  0 ? data[0].donors : [];
  const results2 = data.length > 1 ? data[1].donors : [];

  const getCaseCount = condition => (condition
    ? results1.length.toLocaleString()
    : results2.length.toLocaleString());

  return hasEnoughData
    ? [
      {
        key: `${name}-not-mutated`,
        value: (
          <div className="text-gdc-survival-0">
            S
            <sub>1</sub>
            {` (N = ${getCaseCount(results2.length > 0)})`}
            {plotType === 'mutation' && (
              <span>
                    {' - '}
                {name}
                {' Not Mutated Cases'}
                  </span>
            )}
          </div>
        ),
      },
      {
        key: `${name}-mutated`,
        value: (
          <div className="text-gdc-survival-1">
            S
            <sub>2</sub>
            {` (N = ${getCaseCount(results2.length === 0)})`}
            {plotType === 'mutation' && (
              <span>
                    {' - '}
                {name}
                {' Mutated Cases'}
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
              width: '100%',
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
          <span>
                {`Not enough survival data for ${name}`}
              </span>),
      },
    ];
}

export interface SurvivalPlotProps {
  readonly data: Survival;
  readonly names?: ReadonlyArray<string>;
  readonly hideLegend?: boolean;
}

const SurvivalPlot : React.FC<SurvivalPlotProps> = ( { data, names = [], hideLegend = false } : SurvivalPlotProps) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  // handle the current range of the xAxis set to undefined to reset
  const [xDomain, setXDomain] = useState(undefined);

  const pValue = data.overallStats.pValue;
  const plotData = data.survivalData;

  // hook to call renderSurvivalPlot
  const container = useSurvival(plotData, xDomain, setXDomain);

  const legend = plotData.length == 1 ? buildOnePlotLegend(plotData, "Explorer") : buildTwoPlotLegend(plotData, names[0], "mutation");
  return (
    <div className="flex flex-col overflow-hidden relative">
      <div className="flex flex-row w-100 items-center justify-center flex-wrap items-center">
        <div className="flex ml-auto text-montserrat text-lg text-nci-gray-dark ">{"Overall Survival Plot"}</div>
        <div className="flex flex-row items-center ml-auto mt-2 ">
          <button
            className="px-1.5 min-h-[28px] nim-w-[40px] mx-1 border-nci-gray-light border rounded-[4px] transition-colors "
            onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}><DownloadIcon size="1.25em" /></button>
          <button className="px-1.5 min-h-[28px] nim-w-[40px] border-nci-gray-light border rounded-[4px] transition-colors " onClick={() => setXDomain(undefined)}><ResetIcon size="1.15rem"></ResetIcon></button>
        </div>
      </div>
    <div className="flex flex-col items-center ">
      {!hideLegend && (
        legend.map((x, idx) => {
          return <p key={`${x.key}-${idx}`}>{x.value}</p>
        })
      )}
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
          <div className="survival-plot"  ref={container} />
    </div>
    )
};

export default SurvivalPlot;

