import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import Router from "next/router";
import { createHumanBody, colorCodes } from "@nci-gdc/sapien";
import { useMouse } from "@mantine/hooks";
import { Modal, Text } from "@mantine/core";
import {
  useBodyplotCountsQuery,
  FilterSet,
  BodyplotDataElement,
  HUMAN_BODY_MAPPINGS,
  useCoreSelector,
  selectHasUnsavedCohorts,
  selectUnsavedCohortName,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

const createCohort = (site: string) => {
  const key = site.replace(/-/g, " ");
  const e = HUMAN_BODY_MAPPINGS[key];
  Router.push({
    pathname: "/analysis_page",
    query: {
      app: "",
      operation: "createCohort",
      filters: JSON.stringify(buildBodyplotFilter(e)),
      name: site,
    },
  });
};

interface ExploreCohortModalProps {
  readonly opened: boolean;
  readonly setOpened: (opened: boolean) => void;
  readonly site: string;
}

const ExploreCohortModal: React.FC<ExploreCohortModalProps> = ({
  opened,
  setOpened,
  site,
}: ExploreCohortModalProps) => {
  const hasUnsavedCohorts = useCoreSelector((state) =>
    selectHasUnsavedCohorts(state),
  );

  const unsavedCohortName = useCoreSelector((state) =>
    selectUnsavedCohortName(state),
  );

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Explore Cohort"
    >
      <p className="p-4">
        Explore this <b>{site}</b> cohort in the Analysis Center?{" "}
        {hasUnsavedCohorts && (
          <>
            This will replace the <b>{unsavedCohortName}</b> cohort.{" "}
          </>
        )}
      </p>
      <ModalButtonContainer>
        <FunctionButton onClick={() => setOpened(false)}>No</FunctionButton>
        <DarkFunctionButton onClick={() => createCohort(site)}>
          Yes
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

const SCALE_CASE_COUNT = 1000;

interface PopupContentProps {
  label: string | number;
  caseCount: string | number;
  fileCount: string | number;
  setSize: (_1: number[]) => void;
}

/**
 * PopupContent is the content that appears when a user hovers over a body part
 * @param label - the name of the body part
 * @param caseCount - the number of cases that have data for this body part
 * @param fileCount - the number of files that have data for this body part
 * @param setSize - a function that sets the size of the popup
 */
const PopupContent = ({
  label,
  caseCount,
  fileCount,
  setSize,
}: PopupContentProps): JSX.Element => {
  // get the size of the content, so we can position the popup
  const contentRef = useRef(null);

  useEffect(() => {
    const { width, height } = contentRef?.current?.getBoundingClientRect() ?? {
      width: 0,
      height: 0,
    };
    setSize([width, height]);
  }, [setSize]);

  return (
    <div
      ref={contentRef}
      className="flex flex-col border-2 rounded border-base-lighter bg-base-max p-2"
    >
      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-t border-base-lighter"></div>
      <Text size="lg" color="red">
        {label}
      </Text>
      <div className="flex flex-row">
        <Text size="sm">{caseCount.toLocaleString()} cases </Text>
        <Text size="sm" className="pl-1">
          ({fileCount.toLocaleString()} files)
        </Text>
      </div>
    </div>
  );
};

const buildBodyplotFilter = (data: BodyplotDataElement): FilterSet => {
  const toLowerCaseAll = (arr) => arr.map((item) => item.toLowerCase());
  return {
    mode: "and",
    root: {
      "cases.primary_site": {
        operator: "includes",
        field: "cases.primary_site",
        operands: [...toLowerCaseAll(data.byPrimarySite)],
      },
      "cases.diagnoses.tissue_or_organ_of_origin": {
        operator: "includes",
        field: "cases.diagnoses.tissue_or_organ_of_origin",
        operands: [...toLowerCaseAll(data.byTissueOrOrganOfOrigin)],
      },
    },
  };
};

/**
 * Bodyplot is the component that renders the bodyplot
 */
export const Bodyplot = (): JSX.Element => {
  const [extents, setExtents] = useState([0, 0]);
  const [createCohortModalOpen, setCreateCohortModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(undefined);
  const [bodyplotTooltipContent, setBodyplotTooltipContent] =
    useState(undefined);

  const { data } = useBodyplotCountsQuery();
  const root = document.getElementById("human-body-parent");

  const processedData = useMemo(() => {
    return data
      ? data
          .map((d) => ({
            ...d,
            caseCount: d.caseCount / SCALE_CASE_COUNT,
            color: colorCodes[d.key],
          }))
          .sort((a, b) => (a.key > b.key ? 1 : -1))
      : [];
  }, [data]);

  const bodyplotRef = useRef(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // get the mouse position

  const mouseOutHandler = useCallback(
    () => setBodyplotTooltipContent(undefined),
    [],
  );

  useMemo(() => {
    if (bodyplotRef?.current) {
      createHumanBody({
        title: "Cases by Major Primary Site",
        selector: bodyplotRef.current,
        width: 500,
        height: 500,
        data: processedData ?? [],
        labelSize: "12px",
        primarySiteKey: "key",
        fileCountKey: "fileCount",
        caseCountKey: "caseCount",
        tickInterval: 1,
        offsetLeft: root ? root.offsetLeft : 0,
        offsetTop: root ? root.offsetTop : 0,
        clickHandler: (e) => {
          setSelectedSite(e.key);
          setCreateCohortModalOpen(true);
        },
        mouseOverHandler: setBodyplotTooltipContent,
        mouseOutHandler: mouseOutHandler,
      });
    }
  }, [mouseOutHandler, processedData, root, bodyplotRef]);

  return (
    <div ref={mouseRef} className="relative">
      <div
        className={`${
          bodyplotTooltipContent ? "opacity-100" : "opacity-0"
        }  overflow-visible transition-opacity duration-500 z-[1800] shadow-lg absolute`}
        style={{ left: x - extents[0] - 20, top: y - extents[1] / 2 }}
      >
        {bodyplotTooltipContent && (
          <PopupContent
            label={bodyplotTooltipContent?.key}
            caseCount={bodyplotTooltipContent?.caseCount * SCALE_CASE_COUNT}
            fileCount={bodyplotTooltipContent?.fileCount}
            setSize={setExtents}
          />
        )}
      </div>
      {createCohortModalOpen && (
        <ExploreCohortModal
          opened
          setOpened={setCreateCohortModalOpen}
          site={selectedSite}
        />
      )}
      <div id="human-body-root" ref={bodyplotRef}></div>
    </div>
  );
};
