import { useEffect, useState, useRef, useMemo } from "react";
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
  FilterSet,
  joinFilters,
  selectCurrentCohortFilters,
  useCoreSelector,
  useOncoGrid,
} from "@gff/core";
import { elementToSVG } from "dom-to-svg";
import html2canvas from "html2canvas";
import saveAs from "file-saver";
import { uniq } from "lodash";
import { DocumentWithWebkit } from "../types";
import { toggleFullScreen } from "../../utils";

import MutationFilters from "./MutationFilters";
import { cnvTypes, consequenceTypes, defaultColorMap } from "./constants";
import useOncoGridDisplayData from "./useOncoGridDisplayData";
import ColorPaletteModal from "./ColorPaletteModal";
import useOncoGridObject from "./useOncoGridObject";
import PositionedTooltip from "./PositionedTooltip";
import TrackLegend from "./TrackLegend";
import { donorTracks, geneTracks } from "./trackConfig";
import {
  selectGeneAndSSMFilters,
  clearGeneAndSSMFilters,
} from "@/features/oncoGrid/geneAndSSMFiltersSlice";
import { useAppDispatch, useAppSelector } from "@/features/oncoGrid/appApi";

const OncoGridWrapper: React.FC = () => {
  const appDispatch = useAppDispatch();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );

  const cohortAndGenomicFilters = useMemo(
    () => joinFilters(cohortFilters, genomicFilters),
    [cohortFilters, genomicFilters],
  );

  const fullOncoGridContainer = useRef(null);
  const gridContainer = useRef(null);
  const downloadContainer = useRef<null | HTMLDivElement>(null);
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
  const [showColorTooltip, setShowColorTooltip] = useState(false);

  const { data, isUninitialized, isFetching } = useOncoGrid({
    consequenceTypeFilters,
    cnvFilters,
    cohortAndGenomicFilters,
  });

  const { donors, genes, ssmObservations, cnvObservations } =
    useOncoGridDisplayData(data);

  const {
    gridObject,
    fillColorMap,
    maxAgeAtDiagnosis,
    maxDaysToDeath,
    maxDonorsAffected,
  } = useOncoGridObject({
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
    appDispatch(clearGeneAndSSMFilters());
  }, [cohortFilters, appDispatch]);

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

  const backgroundColor = "bg-base-max";

  const handleDownloadSVG = () => {
    if (downloadContainer.current) {
      const dom = gridContainer.current.cloneNode(true);
      dom.classList.remove(backgroundColor);
      downloadContainer.current.insertBefore(
        dom,
        downloadContainer.current.children[1],
      );
      const svg = elementToSVG(downloadContainer.current);
      const svgStr = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgStr], { type: "image/svg+xml" });

      saveAs(blob, "oncogrid.svg");
      downloadContainer.current.removeChild(dom);
      dom && dom.remove();
    }
  };

  const handleDownloadPNG = async () => {
    if (downloadContainer.current) {
      const dom = gridContainer.current.cloneNode(true);
      dom.classList.remove(backgroundColor);
      dom
        .querySelectorAll("foreignObject")
        .forEach((foreignObject) => foreignObject.remove());

      downloadContainer.current.insertBefore(
        dom,
        downloadContainer.current.children[1],
      );
      const canvas = await html2canvas(downloadContainer.current);

      canvas.toBlob((blob) => {
        saveAs(blob, "oncogrid.png");
      }, "image/png");
      downloadContainer.current.removeChild(dom);
      dom && dom.remove();
    }
  };

  const handleDownloadJSON = async () => {
    const { genes, cases, totalCases, ssmOccurrences, cnvOccurrences } = data;
    const json = {
      genes,
      ssm_occurrences: ssmOccurrences.map(({ ssm, ...occurrence }) => ({
        ...occurrence,
        ssm: {
          ...(ssm ?? {}),
          consequence: ssm?.consequence.filter(
            ({ transcript }) => transcript.is_canonical,
          ),
        },
      })),
      cnv_occurrences: cnvOccurrences,
      cases,
      totalCases,
    };

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });

    saveAs(blob, "oncogrid.json");
  };

  return (
    <div
      ref={(ref) => (fullOncoGridContainer.current = ref)}
      className={`${backgroundColor} p-16  ${
        isFullscreen ? "overflow-scroll" : ""
      }`}
    >
      <div className="flex pb-8">
        <div className="basis-1/2">
          <h2 className="text-montserrat text-center text-lg text-primary-content-dark mb-3">
            {`${donors.length} Most Mutated Cases and Top ${genes.length} Mutated Genes by SSM`}
          </h2>
        </div>
        <div className="flex basis-1/2 justify-end">
          <Tooltip
            position="top"
            label={"Customize Colors"}
            withArrow
            opened={showColorTooltip}
            onMouseEnter={() => setShowColorTooltip(true)}
            onMouseLeave={() => setShowColorTooltip(false)}
          >
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
                  <Menu.Item
                    onClick={() => {
                      setShowColorModal(true);
                      setShowColorTooltip(false);
                    }}
                  >
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
          <Menu
            position="bottom-start"
            offset={1}
            transitionProps={{ duration: 0 }}
          >
            <Menu.Target>
              <div className="flex">
                <Tooltip
                  label={"Download"}
                  withinPortal={false}
                  position="top"
                  withArrow
                >
                  <Button
                    variant={"outline"}
                    size="xs"
                    classNames={{ root: "mx-1" }}
                  >
                    <MdDownload />
                  </Button>
                </Tooltip>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={handleDownloadSVG}>SVG</Menu.Item>
              <Menu.Item onClick={handleDownloadPNG}>PNG</Menu.Item>
              <Menu.Item onClick={handleDownloadJSON}>JSON</Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={isLoading}
          overlayOpacity={0.9}
        />
        <PositionedTooltip content={tooltipContent} />
        {consequenceTypeFilters.length === 0 && (
          <>
            The current selection has no results. Please select more mutation
            types or reload the page to continue exploration.
          </>
        )}
        <div
          ref={(ref) => (gridContainer.current = ref)}
          className={`oncogrid-wrapper ${backgroundColor} ${
            consequenceTypeFilters.length === 0 || isLoading
              ? "invisible"
              : "visible"
          }`}
        />
      </div>

      <div
        className="fixed top-0 -translate-y-full w-[1280px] h-[1520px]"
        aria-hidden
      >
        <div ref={downloadContainer} className="w-full h-full overflow-hidden">
          <h2 className="text-montserrat text-center text-lg text-primary-content-dark mb-3">
            {`${donors.length} Most Mutated Cases and Top ${genes.length} Mutated Genes by SSM`}
          </h2>
          <div className="flex justify-evenly">
            {uniq(
              [...donorTracks, ...geneTracks].map((track) => track.group),
            ).map((track) => (
              <TrackLegend
                key={track}
                track={track}
                fillMap={fillColorMap}
                maxAge={maxAgeAtDiagnosis}
                maxDaysToDeath={maxDaysToDeath}
                maxDonors={maxDonorsAffected}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OncoGridWrapper;
