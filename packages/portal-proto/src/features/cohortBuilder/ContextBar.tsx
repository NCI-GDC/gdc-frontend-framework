import React, { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Menu, Tabs, Divider } from "@mantine/core";
import { ContextualCasesView } from "../cases/CasesView";
import CountButton from "./CountButton";
import { convertFilterToComponent } from "./QueryRepresentation";
import { useCohortFacetFilters } from "./CohortGroup";
import CohortManager from "./CohortManager";
import {
  DeleteCohortNotification,
  NewCohortNotification,
} from "@/features/cohortBuilder/CohortNotifications";
import { truncateString } from "src/utils";

import {
  useCoreDispatch,
  clearCohortFilters,
  setCurrentCohortId,
  useCoreSelector,
  selectAvailableCohorts,
  DEFAULT_COHORT_ID,
  selectCurrentCohortId,
  selectCohortMessage,
  selectCurrentCohortName,
  clearCohortMessage,
} from "@gff/core";

import {
  MdDownload as DownloadIcon,
  MdInsertChartOutlined as SummaryChartIcon,
  MdOutlineViewComfy as TableIcon,
  MdFileCopy as FilesIcon,
} from "react-icons/md";
import { FaCartPlus as AddToCartIcon } from "react-icons/fa";

import SummaryFacets, { SummaryFacetInfo } from "./SummaryFacets";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import FunctionButton from "@/components/FunctionButton";

const ContextBar: React.FC = () => {
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(DEFAULT_COHORT_ID);

  const handleCohortSelection = (idx: string) => {
    setCohort(idx);
  };

  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );
  const currentCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
  const setCohort = (id: string) => {
    coreDispatch(setCurrentCohortId(id));
  };

  const cohortMessage = useCoreSelector((state) => selectCohortMessage(state));

  useEffect(() => {
    if (cohortMessage) {
      const cmdAndParam = cohortMessage.split("|", 2);
      if (cmdAndParam.length == 2) {
        if (cmdAndParam[0] === "newCohort") {
          showNotification({
            message: <NewCohortNotification cohortName={cmdAndParam[1]} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
        if (cmdAndParam[0] === "deleteCohort") {
          showNotification({
            message: <DeleteCohortNotification cohortName={cmdAndParam[1]} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
      }
      coreDispatch(clearCohortMessage());
    }
  }, [cohortMessage, coreDispatch, currentCohortName]);

  useEffect(() => {
    setCurrentIndex(currentCohortId);
  }, [currentCohortId]);

  // TODO: move this to a configuration files or slice
  const [summaryFields] = useState([
    {
      field: "cases.primary_site",
      name: "Primary Site",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.disease_type",
      name: "Disease Type",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.project_id",
      name: "Project",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.program.name",
      name: "Program Name",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.gender",
      name: "Gender",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.race",
      name: "Race",
      docType: "cases",
      indexType: "repository",
    },
  ] as ReadonlyArray<SummaryFacetInfo>);

  const filters = useCohortFacetFilters();

  const CohortBarWithProps = () => (
    <CohortManager
      // TODO: need to connect to cohort persistence
      // eslint-disable-next-line react/prop-types
      cohorts={cohorts}
      onSelectionChanged={handleCohortSelection}
      startingId={currentIndex}
    />
  );

  const clearAllFilters = () => {
    coreDispatch(clearCohortFilters());
  };

  return (
    <div
      className="font-heading bg-base-lightest flex flex-col"
      data-tour="context_bar"
    >
      <CollapsibleContainer
        Top={CohortBarWithProps}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      >
        <div className="flex flex-col ">
          <div className="relative p-2">
            <div className="flex flex-row absolute ml-2">
              <Menu>
                <Menu.Target>
                  <FunctionButton>
                    <DownloadIcon size="1.5rem" />
                    <CountButton
                      countName="fileCounts"
                      label="Files"
                      className="px-2"
                    />
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AddToCartIcon size="1.5rem" />}>
                    Add to Cart
                  </Menu.Item>
                  <Menu.Item icon={<DownloadIcon size="1.5rem" />}>
                    Download Manifest
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu>
                <Menu.Target>
                  <FunctionButton className="ml-2">
                    <FilesIcon size="1.5rem" className="mr-1" /> Metadata
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Biospecimen</Menu.Item>
                  <Menu.Item>Clinical</Menu.Item>
                  <Menu.Item>Sample Sheet</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            <Tabs
              classNames={{
                tab: SecondaryTabStyle,
                tabsList: "px-2 mb-4 border-0",
                root: "border-0",
              }}
              data-tour="cohort_summary"
              defaultValue="summary"
            >
              <Tabs.List position="right">
                <Tabs.Tab
                  data-tour="cohort_summary_charts"
                  value="summary"
                  icon={<SummaryChartIcon size="1.5rem" />}
                >
                  Summary View
                </Tabs.Tab>

                <Tabs.Tab
                  data-tour="cohort_summary_table"
                  value="table"
                  icon={<TableIcon size="1.5rem" />}
                >
                  Table View
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="summary">
                <SummaryFacets fields={summaryFields} />{" "}
              </Tabs.Panel>
              <Tabs.Panel value={"table"}>
                <ContextualCasesView />
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </CollapsibleContainer>
      <div className="flex items-center bg-white shadow-[0_-2px_6px_0_rgba(0,0,0,0.16)] border-primary-darkest border-l-4 p-4 mt-3">
        {Object.keys(filters.root).length !== 0 ? (
          <div className="flex flex-col w-full">
            <div className="flex">
              <p
                className="font-bold text-primary-darkest pr-4"
                title={
                  currentCohortName.length > 30 ? currentCohortName : undefined
                }
              >
                {truncateString(currentCohortName, 30)}
              </p>
              <button
                className="text-primary-darkest text-sm font-montserrat"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap bg-base-lightest w-full overflow-scroll max-h-32 p-2">
              {Object.keys(filters.root).map((k) => {
                return convertFilterToComponent(filters.root[k]);
              })}
            </div>
          </div>
        ) : (
          <span className="text-md text-primary-darkest ">
            Currently viewing all cases in the GDC. Further refine your cohort
            with tools such as the Cohort Builder.
          </span>
        )}
      </div>
      <hr className="border-2" />
    </div>
  );
};

export default ContextBar;
