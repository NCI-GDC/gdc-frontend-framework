import { ReactNode, useEffect, useRef } from "react";
import OncoGrid from "oncogrid";
import { heatMapColor } from "./constants";
import {
  donorTracks,
  geneTracks,
  dataTypesTrack,
  getFillColorMap,
} from "./trackConfig";
import TrackLegend from "./TrackLegend";
import TrackSelectionModal from "./TrackSelectionModal";
import { Donor, Gene, SSMObservation, CNVObservation, ColorMap } from "./types";

// Event callback object from Oncogrid library
interface Domain {
  displayId: string;
  displayName: string;
  displayValue: string | number;
  fieldName: string;
  count: number;
  symbol?: string;
}

interface useOncoGridObjectParams {
  readonly donors: Donor[];
  readonly genes: Gene[];
  readonly ssmObservations: SSMObservation[];
  readonly cnvObservations: CNVObservation[];
  readonly setTooltipContent: (content: ReactNode) => void;
  readonly setTracksModal: (content: ReactNode) => void;
  readonly isHeatmap: boolean;
  readonly colorMap: ColorMap;
  readonly gridContainer: React.MutableRefObject<any>;
}

const useOncoGridObject = ({
  donors,
  genes,
  ssmObservations,
  cnvObservations,
  setTooltipContent,
  setTracksModal,
  isHeatmap,
  colorMap,
  gridContainer,
}: useOncoGridObjectParams): React.MutableRefObject<any> => {
  const gridObject = useRef(null);

  useEffect(() => {
    const maxDaysToDeath = Math.max(...donors.map((d) => d.daysToDeath));
    const maxAgeAtDiagnosis = Math.max(...donors.map((d) => d.age));
    const maxDonorsAffected = Math.max(...genes.map((g) => g.totalDonors));

    const donorOpacityFunc = ({
      fieldName,
      value,
    }: {
      fieldName: string;
      value: string | number;
    }): number => {
      switch (fieldName) {
        case "vitalStatus":
          return !value || value === "not reported" ? 0 : 1;
        case "gender":
        case "ethnicity":
        case "race":
          return 1;
        case "daysToDeath":
          return (value as number) / maxDaysToDeath;
        case "age":
          return (value as number) / maxAgeAtDiagnosis;
        default:
          return value ? 1 : 0;
      }
    };

    const geneOpacityFunc = ({
      fieldName,
      value,
    }: {
      fieldName: string;
      value: string | number;
    }): number => {
      switch (fieldName) {
        case "totalDonors":
          return (value as number) / maxDonorsAffected;
        case "cgc":
          return value ? 1 : 0;
        default:
          return 1;
      }
    };

    const fillColorMap = getFillColorMap(
      Array.from(new Set(donors.map((d) => d.race))),
      Array.from(new Set(donors.map((d) => d.ethnicity))),
    );

    const fillFunc = ({
      fieldName,
      value,
    }: {
      fieldName: string;
      value: string | number;
    }): string => {
      if (
        typeof value === "string" &&
        fillColorMap?.[fieldName]?.[value] !== undefined
      ) {
        return fillColorMap[fieldName][value];
      }
      return fillColorMap[fieldName] as string;
    };

    const oncoGridParams = {
      element: gridContainer.current,
      donors,
      genes,
      ssmObservations,
      cnvObservations,
      donorTracks,
      donorOpacityFunc,
      donorFillFunc: fillFunc,
      geneTracks,
      geneOpacityFunc,
      geneFillFunc: fillFunc,
      height: 150,
      width: 680,
      scaleToFit: true,
      heatMap: isHeatmap,
      grid: false,
      minCellHeight: 8,
      trackHeight: 12,
      margin: { top: 20, right: 5, bottom: 20, left: 0 },
      leftTextWidth: 120,
      trackPadding: 30,
      expandableGroups: ["Clinical"],
      heatMapColor,
      colorMap,
      trackLegendLabel:
        '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>',
    };
    const grid = new OncoGrid(oncoGridParams);

    grid.on("trackMouseOver", ({ domain }: { domain: Domain }) => {
      let displayValue = domain.displayValue;

      if (dataTypesTrack.map((t) => t.fieldName).includes(domain.fieldName)) {
        displayValue = `${displayValue ? displayValue : 0} files`;
      } else {
        if (typeof domain.displayValue === "number" && domain.fieldName === "age") {
          displayValue = `${Math.ceil(domain.displayValue / 365.25)} years (${domain.displayValue} days)`;
        } else {
          displayValue = domain.displayValue.toString();
        }
      }

      setTooltipContent(
        <div className="p-4">
          {domain.displayId} <br />
          {domain.displayName}: {displayValue}
        </div>,
      );
    });

    grid.on("trackMouseOut", () => {
      setTooltipContent(null);
    });

    grid.on("trackLegendMouseOver", ({ group }) =>
      setTooltipContent(
        <TrackLegend
          track={group}
          fillMap={fillColorMap}
          maxDaysToDeath={maxDaysToDeath}
          maxAge={maxAgeAtDiagnosis}
          maxDonors={maxDonorsAffected}
        />,
      ),
    );
    grid.on("trackLegendMouseOut", () => {
      setTooltipContent(null);
    });

    grid.on("gridMouseOver", ({ observation, donor, gene }) => {
      const cnvData = observation.filter((o) => o.type === "cnv");
      const ssmData = observation.filter((o) => o.type === "mutation");

      setTooltipContent(
        <div className="p-2">
          <b>Case:</b> {donor?.displayId}
          <br />
          <b>Gene:</b> {gene?.symbol}
          <br />
          {cnvData.length !== 0 && (
            <>
              <b>CNV Change:</b> {cnvData[0].cnvChange}
              <br />
            </>
          )}
          {ssmData.length !== 0 && (
            <>
              <b>Number of mutations:</b>
              <br />
              {ssmData.map((ssm) => (
                <div key={ssm.consequence}>
                  {ssm.consequence}: {ssm.ids.length}
                  <br />
                </div>
              ))}
            </>
          )}
        </div>,
      );
    });

    grid.on("gridMouseOut", () => {
      setTooltipContent(null);
    });

    grid.on("histogramMouseOver", ({ domain }: { domain: Domain }) => {
      setTooltipContent(
        <div className="p-2">
          {domain.symbol ? domain.symbol : domain.displayId}
          <br />
          Count: {domain.count}
        </div>,
      );
    });

    grid.on("histogramMouseOut", () => {
      setTooltipContent(null);
    });

    grid.on("cnvHistogramMouseOver", ({ domain }: { domain: Domain }) => {
      setTooltipContent(
        <div className="p-2">
          {domain.symbol ? domain.symbol : domain.displayId}
          <br />
          Count: {domain.count}
        </div>,
      );
    });

    grid.on("addTrackClick", ({ hiddenTracks, addTrack }) => {
      setTracksModal(
        <TrackSelectionModal
          hiddenTracks={hiddenTracks}
          addTracks={addTrack}
          closeModal={() => setTracksModal(null)}
        />,
      );
    });

    grid.render();
    gridObject.current = grid;

    return () => gridObject.current.destroy();
  }, [
    isHeatmap,
    setTracksModal,
    setTooltipContent,
    colorMap,
    ssmObservations,
    cnvObservations,
    donors,
    genes,
  ]);

  return gridObject;
};

export default useOncoGridObject;
