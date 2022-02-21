import { useState } from "react";
import {
  useSurvivalPlot,
  Survival,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  fetchSurvival, selectSurvivalData
} from "@gff/core";
import { useEffect, useRef } from "react";
import { renderPlot } from '@oncojs/survivalplot';
import {
  MdDownload as DownloadIcon,
  MdRestartAlt as ResetIcon,
} from "react-icons/md";
import { SurvivalState } from "@gff/core/dist/dts";
// import wrapSvg from "./wrapSVG"; //TODO: add this function


const textColors = [
  // based on schemeCategory10
  // 4.5:1 colour contrast for normal text
  '#1f77b4',
  '#BD5800',
  '#258825',
  '#D62728',
  '#8E5FB9',
  '#8C564B',
  '#D42BA1',
  '#757575',
  '#7A7A15',
  '#10828E',
];

const SVG_MARGINS = {
  bottom: 40,
  left: 50,
  right: 20,
  top: 15,
};


export const MINIMUM_CASES = 10;
export const MAXIMUM_CURVES = 5;

export const useSurvival = (data, xDomain, setXDomain) => {
  const ref =useRef();

  console.log(data);

  useEffect(() => {
    ref.current ?
    renderPlot({
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
  //    onClickDonor: (e, donor) => push({ pathname: `/cases/${donor.id}` }),

      getSetSymbol: (curve, curves) => (
        curves.length === 1
          ? ''
          : `<tspan font-style="italic"></tspan><tspan font-size="2.7em" baseline-shift="-25%">${
            curves.indexOf(curve) + 1
          }</tspan>`
      ),
      }
    ) : null;
  }, [data, xDomain, setXDomain]);
  return ref;
}

const enoughData = (data: Survival[]) => data &&
  data.length &&
  data.every(r => r.donors.length >= MINIMUM_CASES);

const enoughDataOnSomeCurves = (data: Survival[]) => data &&
  data.length &&
  data.some(r => r.donors.length >= MINIMUM_CASES);


const buildLegend = (data, name) => {
  const hasMultipleCurves = data.length > 0;
  const hasEnoughData = hasMultipleCurves
    ? enoughDataOnSomeCurves(data)
    : enoughData(data);

  const legend = hasEnoughData
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

  return legend;
}

interface SurvivalResponse {
  readonly data?: SurvivalState;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useSurvivalChart = (): SurvivalResponse => {
  const coreDispatch = useCoreDispatch();
  const chartData = useCoreSelector((state) => selectSurvivalData(state));
  const cohortFilters = useCoreSelector((state) => selectCurrentCohortFilters(state));

  useEffect(() => {
    coreDispatch(fetchSurvival());
  }, [coreDispatch, cohortFilters]);
  return {
    data: { ...chartData?.data },
    error: chartData?.error,
    isUninitialized: chartData === undefined,
    isFetching: chartData?.status === "pending",
    isSuccess: chartData?.status === "fulfilled",
    isError: chartData?.status === "rejected",
  };
};


export const SurvivalPlot = () => {
  const { data,  isSuccess } =
    useSurvivalPlot();
  // handle the current range of the xAxis set to undefined to reset
  const [xDomain, setXDomain] = useState(undefined);
  // hook to call renderSurvivalPlot
  const container = useSurvival(data, xDomain, setXDomain);

  if (!isSuccess)
    return <div>Loading</div>

  const legend = buildLegend(data, "Explorer")
  return (<div className="flex flex-col bg-white ">
      <div className="flex flex-row w-100 items-center justify-center flex-wrap items-center">
        <div className="flex ml-auto text-montserrat text-lg text-nci-gray-dark ">{"Overall Survival Plot"}</div>
        <div className="flex flex-row items-center ml-auto ">
          <button className="mx-2 border-2 rounded-md border-nci-gray-light px-4 py-2 hover:bg-nci-blue transition-colors" onClick={() => setXDomain(undefined)}><DownloadIcon color="bg-nci-blue " size="1.5rem"></DownloadIcon></button>
          <button className="mx-2 border-2 rounded-md border-nci-gray-light px-4 py-2 hover:bg-nci-blue transition-colors" onClick={() => setXDomain(undefined)}><ResetIcon size="1.5rem"></ResetIcon></button>
        </div>
      </div>
    <div className="flex flex-col">
      <div className="flex flex-row justify-center">
      {
        legend.map((x) => {
          return <div className="text-nci-blue"key={x.key}>{x.value}</div>
        })
      }
      </div>
      <div
        className={`flex flex-row justify-end text-sm mr-8 text-nci-gray no-print`}
      >
        drag to zoom
      </div>
    </div>

    <div className="survival-plot"  ref={container}>
    </div>


  </div>)
};

