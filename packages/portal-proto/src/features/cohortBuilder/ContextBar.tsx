import React, { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Menu, Tabs } from "@mantine/core";
import { ContextualCasesView } from "../cases/CasesView";
import CountButton from "./CountButton";
import { useCohortFacetFilters } from "./CohortGroup";
import CohortManager from "./CohortManager";
import {
  DeleteCohortNotification,
  DiscardChangesCohortNotification,
  NewCohortNotification,
  SavedCohortNotification,
} from "@/features/cohortBuilder/CohortNotifications";

import {
  useCoreDispatch,
  setCurrentCohortId,
  useCoreSelector,
  selectAvailableCohorts,
  DEFAULT_COHORT_ID,
  selectCurrentCohortId,
  selectCohortMessage,
  selectCurrentCohortName,
  clearCohortMessage,
  setCohortList,
  useGetCohortsByContextIdQuery,
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
import QueryExpressionSection from "./QueryExpressionSection";

const ContextBar: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const { data: cohortsListData } = useGetCohortsByContextIdQuery();
  useEffect(() => {
    if (cohortsListData) {
      coreDispatch(setCohortList(cohortsListData));
    }
  }, [coreDispatch, cohortsListData]);

  const [isGroupCollapsed, setIsGroupCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(DEFAULT_COHORT_ID);

  const setCohort = (id: string) => {
    coreDispatch(setCurrentCohortId(id));
  };
  const handleCohortSelection = (idx: string) => {
    setCohort(idx);
  };

  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );
  const currentCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
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
        if (cmdAndParam[0] === "savedCohort") {
          showNotification({
            message: <SavedCohortNotification />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
        if (cmdAndParam[0] === "discardChanges") {
          showNotification({
            message: <DiscardChangesCohortNotification />,
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
      <QueryExpressionSection
        filters={filters}
        currentCohortName={currentCohortName}
        currentCohortId={currentCohortId}
      />
      <hr className="border-2" />
    </div>
  );
};

export default ContextBar;
