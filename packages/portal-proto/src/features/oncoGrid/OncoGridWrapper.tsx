import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import OncoGrid from "oncogrid";
import {
  ActionIcon,
  LoadingOverlay,
  Tooltip as MTooltip,
  Menu,
} from "@mantine/core";
import { FaCrosshairs, FaFire, FaSortAmountDown } from "react-icons/fa";
import {
  MdColorLens,
  MdDownload,
  MdFullscreen,
  MdGridOn,
  MdRefresh,
} from "react-icons/md";
import { useOncoGrid } from "@gff/core";
import { donorTracks, geneTracks, getFillColorMap } from "./trackConfig";
import TrackLegend from "./TrackLegend";
import MutationFilters from "./MutationFilters";
import TrackSelectionModal from "./TrackSelectionModal";
import { consequenceTypes, defaultColorMap, heatMapColor } from "./constants";
import useOncoGridDisplayData from "./useOncoGridDisplayData";
import { ssmObservations, cnvObservations, donors, genes } from "./fixture";
import ColorPaletteModal from "./ColorPaletteModal";
const Tooltip = dynamic(() => import("./Tooltip"), { ssr: false });

interface Domain {
  displayId: string;
  displayName: string;
  displayValue: string | number;
  fieldName: string;
  count: number;
  symbol?: string;
}

interface DocumentWithWebkit extends Document {
  readonly webkitExitFullscreen: () => void;
  readonly webkitFullscreenElement: Element;
}

const OncoGridWrapper: React.FC = () => {
  const gridContainer = useRef(null);
  const fullOncoGridContainer = useRef(null);
  const gridObject = useRef(null);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [hasGridlines, setHasGridlines] = useState(false);
  const [showCrosshairs, setShowCrosshairs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tracksModal, setTracksModal] = useState(null);
  const [consequenceTypeFilters, setConsequenceTypeFilters] = useState(
    Object.keys(consequenceTypes),
  );
  const [cnvFilters, setCnvFilters] = useState(["loss", "gain"]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorMap, setColorMap] = useState(defaultColorMap);

  const { data, isFetching } = useOncoGrid({
    consequenceTypeFilters,
    cnvFilters,
  });

  useEffect(() => {
    const customColorTheme = localStorage.getItem("oncogridActiveTheme");
    if (customColorTheme) {
      setColorMap(JSON.parse(customColorTheme));
    }
  }, []);

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const { donors, genes, ssmObservations, cnvObservations } =
    useOncoGridDisplayData(data);

  const resetGrid = () => {
    setIsHeatmap(false);
    setHasGridlines(false);
    setShowCrosshairs(false);
    setIsLoading(true);
    setTimeout(() => gridObject.current.reload(), 200);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleFullscreen = async () => {
    // Webkit vendor prefix for Safari support: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#browser_compatibility
    if (!isFullscreen) {
      if (fullOncoGridContainer.current.requestFullscreen) {
        await fullOncoGridContainer.current.requestFullscreen();
      } else if (fullOncoGridContainer.current.webkitRequestFullScreen) {
        fullOncoGridContainer.current.webkitRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as DocumentWithWebkit).webkitExitFullscreen) {
        (document as DocumentWithWebkit).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const eventListener = () => {
      setIsFullscreen(
        document?.fullscreenElement !== null ||
          (document as DocumentWithWebkit)?.webkitFullscreenElement !== null,
      );
    };

    window.addEventListener("fullscreenchange", eventListener);
    window.addEventListener("webkitfullscreenchange", eventListener);

    return () => {
      window.removeEventListener("fullscreenschange", eventListener);
      window.removeEventListener("webkitfullscreenschange", eventListener);
    };
  }, []);

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
          colorMap={fillColorMap}
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
    setTracksModal,
    setTooltipContent,
    colorMap,
    setIsLoading,
    JSON.stringify(ssmObservations),
    JSON.stringify(cnvObservations),
    JSON.stringify(donors),
    JSON.stringify(genes),
  ]);

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
    <div
      ref={(ref) => (fullOncoGridContainer.current = ref)}
      className={`bg-white p-4 ${isFullscreen ? "overflow-scroll" : ""}`}
    >
      <div className="flex pb-8">
        <div className="basis-1/2">{`${donors.length} Most Mutated Cases and Top ${genes.length} Mutated Genes by SSM`}</div>
        <div className="flex basis-1/2 justify-end">
          <MTooltip label={"Customize Colors"} withArrow>
            <Menu
              control={
                <ActionIcon variant={"outline"} classNames={{ root: "mx-1" }}>
                  <MdColorLens />
                </ActionIcon>
              }
            >
              <Menu.Item onClick={() => setShowColorModal(true)}>
                Customize color
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  localStorage.setItem(
                    "oncogridActiveTheme",
                    JSON.stringify(defaultColorMap),
                  );
                  setColorMap(defaultColorMap);
                }}
              >
                Reset to default
              </Menu.Item>
            </Menu>
          </MTooltip>
          <MTooltip label={"Download"} withArrow>
            <ActionIcon variant={"outline"} classNames={{ root: "mx-1" }}>
              <MdDownload />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Reload Grid"} withArrow>
            <ActionIcon
              variant={"outline"}
              onClick={resetGrid}
              classNames={{ root: "mx-1" }}
            >
              <MdRefresh />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Cluster Data"} withArrow>
            <ActionIcon
              variant={"outline"}
              onClick={() => gridObject.current.cluster()}
              classNames={{ root: "mx-1" }}
            >
              <FaSortAmountDown />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Toggle Heatmap View"} withArrow>
            <ActionIcon
              variant={isHeatmap ? "filled" : "outline"}
              onClick={() => {
                setIsHeatmap(!isHeatmap);
              }}
              classNames={{ root: "mx-1" }}
            >
              <FaFire />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Toggle Gridlines"} withArrow>
            <ActionIcon
              variant={hasGridlines ? "filled" : "outline"}
              onClick={() => setHasGridlines(!hasGridlines)}
              classNames={{ root: "mx-1" }}
            >
              <MdGridOn />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Toggle Crosshairs"} withArrow>
            <ActionIcon
              variant={showCrosshairs ? "filled" : "outline"}
              onClick={() => setShowCrosshairs(!showCrosshairs)}
              classNames={{ root: "mx-1" }}
            >
              <FaCrosshairs />
            </ActionIcon>
          </MTooltip>
          <MTooltip label={"Fullscreen "} withArrow>
            <ActionIcon
              variant={isFullscreen ? "filled" : "outline"}
              onClick={() => toggleFullscreen()}
              classNames={{ root: "mx-1" }}
            >
              <MdFullscreen />
            </ActionIcon>
          </MTooltip>
        </div>
      </div>
      <MutationFilters
        colorMap={colorMap}
        heatmapMode={isHeatmap}
        consequenceTypeFilters={consequenceTypeFilters}
        setConsequenceTypeFilters={setConsequenceTypeFilters}
        cnvFilters={cnvFilters}
        setCnvFilters={setCnvFilters}
      ></MutationFilters>
      <Tooltip content={tooltipContent} />
      <ColorPaletteModal
        opened={showColorModal}
        closeModal={() => setShowColorModal(false)}
        colorMap={colorMap}
        setNewColorMap={setColorMap}
      />
      {tracksModal}
      <div>
        <LoadingOverlay visible={isLoading} overlayOpacity={0.9} />
        {consequenceTypeFilters.length === 0 && (
          <>
            The current selection has no results. Please select more mutation
            types or reload the page to continue exploration.
          </>
        )}
        <div
          ref={(ref) => (gridContainer.current = ref)}
          className={`oncogrid-wrapper bg-white ${
            consequenceTypeFilters.length === 0 ? "invisible" : "visible"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default OncoGridWrapper;
