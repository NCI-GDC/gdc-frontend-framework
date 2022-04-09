import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
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
import { DocumentWithWebkit } from "../types";
import { toggleFullScreen } from "../../utils";

import MutationFilters from "./MutationFilters";
import { cnvTypes, consequenceTypes, defaultColorMap } from "./constants";
import useOncoGridDisplayData from "./useOncoGridDisplayData";
import ColorPaletteModal from "./ColorPaletteModal";
import useOncoGridObject from "./useOncoGridObject";
const Tooltip = dynamic(() => import("./Tooltip"), { ssr: false });

const OncoGridWrapper: React.FC = () => {
  const fullOncoGridContainer = useRef(null);
  const gridContainer = useRef(null);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [hasGridlines, setHasGridlines] = useState(false);
  const [showCrosshairs, setShowCrosshairs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tracksModal, setTracksModal] = useState(null);
  const [consequenceTypeFilters, setConsequenceTypeFilters] = useState(
    Object.keys(consequenceTypes),
  );
  const [cnvFilters, setCnvFilters] = useState(Object.keys(cnvTypes));
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorMap, setColorMap] = useState(defaultColorMap);

  const { data, isUninitialized, isFetching } = useOncoGrid({
    consequenceTypeFilters,
    cnvFilters,
  });

  const { donors, genes, ssmObservations, cnvObservations } =
    useOncoGridDisplayData(data);

  const gridObject = useOncoGridObject({
    donors,
    genes,
    ssmObservations,
    cnvObservations,
    setTooltipContent,
    setTracksModal,
    isHeatmap,
    colorMap,
    gridContainer,
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
    if (!isUninitialized) {
      // Make sure the loading overlay is up long enough to cover heatmap transition graphics
      setIsLoading(true);
      setTimeout(() => gridObject.current.setHeatmap(isHeatmap), 200);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isHeatmap, gridObject]);

  useEffect(
    () => gridObject.current.setGridLines(hasGridlines),
    [hasGridlines, gridObject],
  );
  useEffect(
    () => gridObject.current.setCrosshair(showCrosshairs),
    [showCrosshairs, gridObject],
  );

  const resetGrid = () => {
    setCnvFilters(Object.keys(cnvTypes));
    setConsequenceTypeFilters(Object.keys(consequenceTypes));
    setIsHeatmap(false);
    setHasGridlines(false);
    setShowCrosshairs(false);
    setIsLoading(true);
    setTimeout(() => gridObject.current.reload(), 200);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div
      ref={(ref) => (fullOncoGridContainer.current = ref)}
      className={`bg-white p-16 ${isFullscreen ? "overflow-scroll" : ""}`}
    >
      <div className="flex pb-8">
        <div className="basis-1/2">{`${donors.length} Most Mutated Cases and Top ${genes.length} Mutated Genes by SSM`}</div>
        <div className="flex basis-1/2 justify-end">
          <MTooltip
            withinPortal={false}
            position="top"
            label={"Customize Colors"}
            withArrow
          >
            <Menu
              control={
                <ActionIcon variant={"outline"} classNames={{ root: "mx-1" }}>
                  <MdColorLens />
                </ActionIcon>
              }
              withinPortal={false}
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
          <MTooltip
            label={"Download"}
            withinPortal={false}
            position="top"
            withArrow
          >
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
          <MTooltip
            label={"Cluster Data"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <ActionIcon
              variant={"outline"}
              onClick={() => gridObject.current.cluster()}
              classNames={{ root: "mx-1" }}
            >
              <FaSortAmountDown />
            </ActionIcon>
          </MTooltip>
          <MTooltip
            label={"Toggle Heatmap View"}
            withinPortal={false}
            position="top"
            withArrow
          >
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
          <MTooltip
            label={"Toggle Gridlines"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <ActionIcon
              variant={hasGridlines ? "filled" : "outline"}
              onClick={() => setHasGridlines(!hasGridlines)}
              classNames={{ root: "mx-1" }}
            >
              <MdGridOn />
            </ActionIcon>
          </MTooltip>
          <MTooltip
            label={"Toggle Crosshairs"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <ActionIcon
              variant={showCrosshairs ? "filled" : "outline"}
              onClick={() => setShowCrosshairs(!showCrosshairs)}
              classNames={{ root: "mx-1" }}
            >
              <FaCrosshairs />
            </ActionIcon>
          </MTooltip>
          <MTooltip
            label={"Fullscreen "}
            withinPortal={false}
            position="top"
            withArrow
          >
            <ActionIcon
              variant={isFullscreen ? "filled" : "outline"}
              onClick={() => toggleFullScreen(fullOncoGridContainer)}
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
      />
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
            consequenceTypeFilters.length === 0 || isLoading
              ? "invisible"
              : "visible"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default OncoGridWrapper;
