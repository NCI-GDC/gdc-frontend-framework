import { useEffect, useState } from "react";
import {
  Survival,
} from "@gff/core";
import { useLayoutEffect, useRef } from "react";
import { renderPlot } from '@oncojs/survivalplot';
import {
  MdDownload as DownloadIcon,
  MdRestartAlt as ResetIcon,
} from "react-icons/md";
import { Button } from "@mantine/core";
import dynamic from "next/dynamic";
import { processJSONData } from "./utils";

const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

const CHART_NAME = "survival-plot";

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

export interface SurvivalPlotProps {
  readonly data: ReadonlyArray<Survival>;
}

const SurvivalPlot : React.FC<SurvivalPlotProps> = ( { data } : SurvivalPlotProps) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  // handle the current range of the xAxis set to undefined to reset
  const [xDomain, setXDomain] = useState(undefined);
  // hook to call renderSurvivalPlot
  const container = useSurvival(data, xDomain, setXDomain);
  const legend = buildLegend(data, "Explorer")
  return (
    <div className="flex flex-col overflow-hidden relative">
      <div className="flex flex-row w-100 items-center justify-center flex-wrap items-center">
        <div className="flex ml-auto text-montserrat text-lg text-nci-gray-dark ">{"Overall Survival Plot"}</div>
        <div className="flex flex-row items-center ml-auto mt-2 ">
          <button
            className="px-1.5 min-h-[28px] nim-w-[40px] mx-1 border-nci-gray-light border rounded-[4px] transition-colors "
            onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
          ><DownloadIcon size="1.25em" /></button>
          <button className="px-1.5 min-h-[28px] nim-w-[40px] border-nci-gray-light border rounded-[4px] transition-colors " onClick={() => setXDomain(undefined)}><ResetIcon size="1.15rem"></ResetIcon></button>
        </div>
      </div>
    <div className="flex flex-col ">
      <div className="flex flex-row justify-center">
      {
        legend.map((x) => {
          return <div className="text-nci-blue" key={x.key}>{x.value}</div>
        })
      }
      </div>
      <div
        className={`flex flex-row justify-end text-sm mr-8 text-nci-gray no-print`}
      >
        drag to zoom
      </div>
    </div>
        <div className="survival-plot"  ref={container}></div>
    </div>
    )
};

export default SurvivalPlot;

