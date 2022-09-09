import { useEffect, useState, useRef } from "react";
import { LoadingOverlay, Button, Box, Tooltip, Menu } from "@mantine/core";
import { FaCrosshairs, FaFire, FaSortAmountDown } from "react-icons/fa";
import {
  MdColorLens,
  MdDownload,
  MdFullscreen,
  MdGridOn,
  MdRefresh,
} from "react-icons/md";
import {
  clearGenomicFilters,
  selectCurrentCohortFilterSet,
  useCoreDispatch,
  useCoreSelector,
  useOncoGrid,
} from "@gff/core";
import { DocumentWithWebkit } from "../types";
import { toggleFullScreen } from "../../utils";

import MutationFilters from "./MutationFilters";
import { cnvTypes, consequenceTypes, defaultColorMap } from "./constants";
import useOncoGridDisplayData from "./useOncoGridDisplayData";
import ColorPaletteModal from "./ColorPaletteModal";
import useOncoGridObject from "./useOncoGridObject";

const OncoGridWrapper: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
  );
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

  /**
   * Remove genomic filters when cohort changes
   */
  useEffect(() => {
    coreDispatch(clearGenomicFilters());
  }, [cohortFilters, coreDispatch]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className={`bg-base-lightest p-16  ${
        isFullscreen ? "overflow-scroll" : ""
      }`}
    >
      <div className="flex pb-8">
        <div className="basis-1/2">{`${donors.length} Most Mutated Cases and Top ${genes.length} Mutated Genes by SSM`}</div>
        <div className="flex basis-1/2 justify-end">
          <Tooltip position="top" label={"Customize Colors"} withArrow>
            <Box>
              <Menu>
                <Menu.Target>
                  <Button
                    variant={"outline"}
                    size="xs"
                    classNames={{ root: "mx-1" }}
                  >
                    <MdColorLens />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
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
                </Menu.Dropdown>
              </Menu>
            </Box>
          </Tooltip>
          <Tooltip
            label={"Download"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button variant={"outline"} size="xs" classNames={{ root: "mx-1" }}>
              <MdDownload />
            </Button>
          </Tooltip>
          <Tooltip label={"Reload Grid"} withArrow>
            <Button
              variant={"outline"}
              size="xs"
              onClick={resetGrid}
              classNames={{ root: "mx-1" }}
            >
              <MdRefresh />
            </Button>
          </Tooltip>
          <Tooltip
            label={"Cluster Data"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button
              variant={"outline"}
              size="xs"
              onClick={() => gridObject.current.cluster()}
              classNames={{ root: "mx-1" }}
            >
              <FaSortAmountDown />
            </Button>
          </Tooltip>
          <Tooltip
            label={"Toggle Heatmap View"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button
              size="xs"
              variant={isHeatmap ? "filled" : "outline"}
              onClick={() => {
                setIsHeatmap(!isHeatmap);
              }}
              classNames={{
                root: `mx-1 ${isHeatmap ? "bg-primary-lighter" : null}`,
              }}
            >
              <FaFire />
            </Button>
          </Tooltip>
          <Tooltip
            label={"Toggle Gridlines"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button
              size="xs"
              variant={hasGridlines ? "filled" : "outline"}
              onClick={() => setHasGridlines(!hasGridlines)}
              classNames={{
                root: `mx-1 ${hasGridlines ? "bg-primary-lighter" : null}`,
              }}
            >
              <MdGridOn />
            </Button>
          </Tooltip>
          <Tooltip
            label={"Toggle Crosshairs"}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button
              size="xs"
              variant={showCrosshairs ? "filled" : "outline"}
              onClick={() => setShowCrosshairs(!showCrosshairs)}
              classNames={{
                root: `mx-1 ${showCrosshairs ? "bg-primary-lighter" : null}`,
              }}
            >
              <FaCrosshairs />
            </Button>
          </Tooltip>
          <Tooltip
            label={"Fullscreen "}
            withinPortal={false}
            position="top"
            withArrow
          >
            <Button
              size="xs"
              variant={isFullscreen ? "filled" : "outline"}
              onClick={() => toggleFullScreen(fullOncoGridContainer)}
              classNames={{
                root: `mx-1 ${isFullscreen ? "bg-primary-lighter" : null}`,
              }}
            >
              <MdFullscreen />
            </Button>
          </Tooltip>
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

      <ColorPaletteModal
        opened={showColorModal}
        closeModal={() => setShowColorModal(false)}
        colorMap={colorMap}
        setNewColorMap={setColorMap}
      />
      {tracksModal}
      <div className="relative">
        <LoadingOverlay visible={isLoading} overlayOpacity={0.9} />
        {consequenceTypeFilters.length === 0 && (
          <>
            The current selection has no results. Please select more mutation
            types or reload the page to continue exploration.
          </>
        )}
        <Tooltip.Floating
          withinPortal
          position="left"
          offset={10}
          label={tooltipContent}
          disabled={tooltipContent === null}
        >
          <Box>
            <div
              ref={(ref) => (gridContainer.current = ref)}
              className={`oncogrid-wrapper bg-base-lightest ${
                consequenceTypeFilters.length === 0 || isLoading
                  ? "invisible"
                  : "visible"
              }`}
            />
          </Box>
        </Tooltip.Floating>
      </div>
    </div>
  );
};

export default OncoGridWrapper;
