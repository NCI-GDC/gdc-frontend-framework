import React, { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Menu, Tabs } from "@mantine/core";
import { ContextualCasesView } from "../cases/CasesView/CasesView";
import CountButton from "./CountButton";
import { useCohortFacetFilters } from "./CohortGroup";
import CohortManager from "./CohortManager";
import {
  DeleteCohortNotification,
  DiscardChangesCohortNotification,
  ErrorCohortNotification,
  NewCohortNotification,
  SavedCohortNotification,
} from "@/features/cohortBuilder/CohortNotifications";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  DEFAULT_COHORT_ID,
  selectCurrentCohortId,
  setActiveCohort,
  selectCohortMessage,
  selectCurrentCohortName,
  clearCohortMessage,
  setCohortList,
  useGetCohortsByContextIdQuery,
  buildGqlOperationToFilterSet,
  setActiveCohortList,
  DataStatus,
  Cohort,
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

interface Error {
  data: {
    message: string;
  };
  status: number;
}

const ContextBar: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const { data: cohortsListData, error: getCohortError } =
    useGetCohortsByContextIdQuery();

  useEffect(() => {
    // If cohortsListData is undefined that means either user doesn't have any cohorts saved as of now
    // or call to fetch the cohort list errored out.
    // In that case we need to check if the error is due to context id not being provided.
    // If that's case then we get rid of all saved, unsaved cohort from the local cohortAdapter by unsending undefined payload

    if (cohortsListData) {
      const updatedList: Cohort[] = cohortsListData.map((data) => ({
        ...data,
        filters: buildGqlOperationToFilterSet(data.filters),
        caseSet: {
          caseSetId: buildGqlOperationToFilterSet(data.filters),
          status: "fulfilled" as DataStatus,
        },
        caseCount: data?.case_ids.length,
      }));
      coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      // TODO determine if setActiveCohortList is really needed
    } else if ((getCohortError as Error)?.status === 400) {
      const noGdcContext =
        ((getCohortError as Error)?.data.message as string) ===
        "Bad Request: [400] - Context id not provided.";
      if (noGdcContext) {
        coreDispatch(setCohortList(undefined)); // setting to undefined will not require caseSet
      }
    }
  }, [getCohortError, coreDispatch, cohortsListData]);

  const [isGroupCollapsed, setIsGroupCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(DEFAULT_COHORT_ID);

  const setCohort = (id: string) => {
    coreDispatch(setActiveCohort(id));
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
      const cmdAndParam = cohortMessage.split("|", 3);
      if (cmdAndParam.length == 3) {
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
        if (cmdAndParam[0] === "error") {
          showNotification({
            message: <ErrorCohortNotification errorType={cmdAndParam[1]} />,
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
      name: "Program",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.gender",
      name: "Gender",
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
      className="font-heading bg-base-max flex flex-col"
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
                    <DownloadIcon />
                    <CountButton
                      countName="fileCounts"
                      label="Files"
                      className="px-2"
                    />
                  </FunctionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AddToCartIcon />}>Add to Cart</Menu.Item>
                  <Menu.Item icon={<DownloadIcon />}>
                    Download Manifest
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu>
                <Menu.Target>
                  <FunctionButton className="ml-2">
                    <FilesIcon className="mr-1" /> Metadata
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
              keepMounted={false}
            >
              <Tabs.List position="right">
                <Tabs.Tab
                  data-tour="cohort_summary_charts"
                  value="summary"
                  icon={<SummaryChartIcon />}
                >
                  Summary View
                </Tabs.Tab>

                <Tabs.Tab
                  data-tour="cohort_summary_table"
                  value="table"
                  icon={<TableIcon />}
                >
                  Table View
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="summary">
                <SummaryFacets fields={summaryFields} />
              </Tabs.Panel>
              <Tabs.Panel value="table">
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
