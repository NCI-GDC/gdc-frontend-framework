import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import OncoGrid from "oncogrid";
import { ActionIcon, LoadingOverlay } from "@mantine/core";
import { FaCrosshairs, FaFire, FaSortAmountDown } from "react-icons/fa";
import {
  MdColorLens,
  MdDownload,
  MdFullscreen,
  MdGridOn,
  MdRefresh,
} from "react-icons/md";
import { donorTracks, geneTracks, getColorMap } from "./trackConfig";
import { donors, genes, ssmObservations, cnvObservations } from "./fixture";
import TrackLegend from "./TrackLegend";
import TrackSelectionModal from "./TrackSelectionModal";
const Tooltip = dynamic(() => import("./Tooltip"), { ssr: false });

interface Domain {
  displayId: string;
  displayName: string;
  displayValue: string | number;
  fieldName: string;
  count: number;
  symbol?: string;
}

const OncoGridWrapper = () => {
  const gridContainer = useRef(null);
  const gridObject = useRef(null);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [hasGridlines, setHasGridlines] = useState(false);
  const [showCrosshairs, setShowCrosshairs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tracksModal, setTracksModal] = useState(null);

  const resetGrid = () => {
    setIsHeatmap(false);
    setHasGridlines(false);
    setShowCrosshairs(false);
    setIsLoading(true);
    setTimeout(() => gridObject.current.reload(), 200);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const fullScreen = async () => {
    if (gridContainer.current.requestFullscreen) {
      await gridContainer.current.requestFullscreen();
    } else if (gridContainer.current.webkitRequestFullScreen) {
      // Safari support: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#browser_compatibility
      gridContainer.current.webkitRequestFullScreen();
    }
  };

  const maxDaysToDeath = Math.max(...donors.map((d) => d.daysToDeath));
  const maxAgeAtDiagnosis = Math.max(...donors.map((d) => d.age));
  const maxDonorsAffected = Math.max(...genes.map((g) => g.totalDonors));

  const donorOpacityFunc = ({ fieldName, value } : { fieldName: string, value: string | number}) => {
    switch (fieldName) {
      case "vitalStatus":
        return !value || value === "not reported" ? 0 : 1;
      case "gender":
      case "ethnicity":
      case "race":
        return 1;
      case "daysToDeath":
        return value / maxDaysToDeath;
      case "age":
        return value / maxAgeAtDiagnosis;
      default:
        return value ? 1 : 0;
    }
  };

  const geneOpacityFunc = ({ fieldName, value }) => {
    switch (fieldName) {
      case "totalDonors":
        return value / maxDonorsAffected;
      case "cgc":
        return value ? 1 : 0;
      default:
        return 1;
    }
  };

  const colorMap = getColorMap(
    Array.from(new Set(donors.map((d) => d.race))),
    Array.from(new Set(donors.map((d) => d.ethnicity))),
  );

  const fillFunc = ({ fieldName, value }) => {
    if (
      typeof value === "string" &&
      colorMap?.[fieldName]?.[value] !== undefined
    ) {
      return colorMap[fieldName][value];
    }
    return colorMap[fieldName];
  };

  useEffect(() => {
    const params = {
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
      heatMap: false,
      grid: false,
      minCellHeight: 8,
      trackHeight: 12,
      margin: { top: 20, right: 5, bottom: 20, left: 0 },
      leftTextWidth: 120,
      trackPadding: 30,
      expandableGroups: ["Clinical"],
      heatMapColor: "#2E7D32",
      colorMap: {
        cnv: {
          Gain: "#e76a6a",
          Loss: "#64b5f6",
        },
        mutation: {
          frameshift_variant: "#2E7D32",
          missense_variant: "#2E7D32",
          start_lost: "#2E7D32",
          stop_gained: "#2E7D32",
          stop_lost: "#2E7D32",
        },
      },
      trackLegendLabel:
        '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>',
    };

    const grid = new OncoGrid(params);

    grid.on("render:all:start", () => {
      setIsLoading(true);
    });
    grid.on("render:all:end", () => setIsLoading(false));

    grid.on("trackMouseOver", ({ domain }: { domain: Domain }) => {
      setTooltipContent(
        <div className="p-4">
          {domain.displayId} <br />
          {domain.displayName}:{" "}
          {domain.fieldName === "age" && typeof domain.displayValue === "number"
            ? `${Math.ceil(domain.displayValue / 365.25)} years`
            : domain.displayValue.toString()}
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
          colorMap={colorMap}
          maxDaysToDeath={maxDaysToDeath}
          maxAge={maxAgeAtDiagnosis}
          maxDonors={maxDonorsAffected}
        />,
      ),
    );
    grid.on("trackMouseOut", () => {
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
  }, []);

  useEffect(() => {
    // Make sure the loading overlay is up long enough to cover heatmap transition graphics
    setIsLoading(true);
    setTimeout(() => gridObject.current.setHeatmap(isHeatmap), 200);
    setTimeout(() => setIsLoading(false), 1000);
  }, [isHeatmap]);

  useEffect(
    () => gridObject.current.setGridLines(hasGridlines),
    [hasGridlines],
  );
  useEffect(
    () => gridObject.current.setCrosshair(showCrosshairs),
    [showCrosshairs],
  );

  return (
    <>
      <div className="flex pb-8">
        <div className="basis-1/2">{`200 Most Mutated Cases and Top 50 Mutated Genes by SSM`}</div>
        <div className="flex basis-1/2 ml-auto">
          <ActionIcon variant={"outline"} classNames={{ root: "mx-1" }}>
            <MdColorLens />
          </ActionIcon>
          <ActionIcon variant={"outline"} classNames={{ root: "mx-1" }}>
            <MdDownload />
          </ActionIcon>
          <ActionIcon
            variant={"outline"}
            onClick={resetGrid}
            classNames={{ root: "mx-1" }}
          >
            <MdRefresh />
          </ActionIcon>
          <ActionIcon
            variant={"outline"}
            onClick={() => gridObject.current.cluster()}
            classNames={{ root: "mx-1" }}
          >
            <FaSortAmountDown />
          </ActionIcon>
          <ActionIcon
            variant={isHeatmap ? "filled" : "outline"}
            onClick={() => {
              setIsHeatmap(!isHeatmap);
            }}
            classNames={{ root: "mx-1" }}
          >
            <FaFire />
          </ActionIcon>
          <ActionIcon
            variant={hasGridlines ? "filled" : "outline"}
            onClick={() => setHasGridlines(!hasGridlines)}
            classNames={{ root: "mx-1" }}
          >
            <MdGridOn />
          </ActionIcon>
          <ActionIcon
            variant={showCrosshairs ? "filled" : "outline"}
            onClick={() => setShowCrosshairs(!showCrosshairs)}
            classNames={{ root: "mx-1" }}
          >
            <FaCrosshairs />
          </ActionIcon>
          <ActionIcon
            variant={"outline"}
            onClick={() => fullScreen()}
            classNames={{ root: "mx-1" }}
          >
            <MdFullscreen />
          </ActionIcon>
        </div>
      </div>
      <Tooltip content={tooltipContent} />
      {tracksModal}
      <div>
        <LoadingOverlay visible={isLoading} overlayOpacity={0.9} />
        <div
          ref={(ref) => (gridContainer.current = ref)}
          className={"oncogrid-wrapper bg-white"}
        ></div>
      </div>
    </>
  );
};

export default OncoGridWrapper;
