import React, { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Tabs } from "@mantine/core";
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
  NewCohortNotificationWithSetAsCurrent,
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
  Modals,
  showModal,
} from "@gff/core";
import { MdFilterAlt as CohortFilterIcon } from "react-icons/md";
import {
  MdDownload as DownloadIcon,
  MdInsertChartOutlined as SummaryChartIcon,
  MdOutlineViewComfy as TableIcon,
} from "react-icons/md";
import SummaryFacets, { SummaryFacetInfo } from "./SummaryFacets";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import QueryExpressionSection from "./QueryExpressionSection";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";

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
        id: data.id,
        name: data.name,
        filters: buildGqlOperationToFilterSet(data.filters),
        caseSet: {
          caseSetId: buildGqlOperationToFilterSet(data.filters),
          status: "fulfilled" as DataStatus,
        },
        modified_datetime: data.modified_datetime,
        saved: true,
        modified: false,
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
        if (cmdAndParam[0] === "newCasesCohort") {
          showNotification({
            message: (
              <NewCohortNotificationWithSetAsCurrent
                cohortName={cmdAndParam[1]}
                cohortId={cmdAndParam[2]}
              />
            ),
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
        if (cmdAndParam[0] === "newProjectsCohort") {
          showNotification({
            message: (
              <NewCohortNotificationWithSetAsCurrent
                cohortName={cmdAndParam[1]}
                cohortId={cmdAndParam[2]}
              />
            ),
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
  const [activeTab, setActiveTab] = useState<string | null>("summary");

  return (
    <div
      className="font-heading bg-base-max flex flex-col"
      data-tour="context_bar"
    >
      <CollapsibleContainer
        Top={() => (
          <CohortManager
            cohorts={cohorts}
            onSelectionChanged={handleCohortSelection}
            startingId={currentIndex}
          />
        )}
        isCollapsed={isGroupCollapsed}
        toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
        onlyIcon={false}
      >
        <div className="flex flex-col bg-nci-violet-lightest">
          <div className="relative p-2">
            <div className="flex flex-row absolute ml-2 gap-4">
              <DropdownWithIcon
                dropdownElements={[
                  { title: "Add to Cart" },
                  { title: "Download Manifest" },
                  { title: "Metadata" },
                  { title: "Sample Sheet" },
                ]}
                TargetButtonChildren={
                  <CountButton countName="fileCount" label="Files" />
                }
                LeftIcon={
                  <DownloadIcon size="1rem" aria-label="Files dropdown" />
                }
              />

              <DropdownWithIcon
                dropdownElements={[
                  {
                    title: "Cases",
                    onClick: () =>
                      coreDispatch(
                        showModal({ modal: Modals.GlobalCaseSetModal }),
                      ),
                  },
                  {
                    title: "Genes",
                    onClick: () =>
                      coreDispatch(
                        showModal({ modal: Modals.GlobalGeneSetModal }),
                      ),
                  },
                  {
                    title: "Mutations",
                    onClick: () =>
                      coreDispatch(
                        showModal({ modal: Modals.GlobalMutationSetModal }),
                      ),
                  },
                ]}
                TargetButtonChildren="Custom Filters"
                LeftIcon={
                  <CohortFilterIcon
                    size="1rem"
                    aria-label="Custom cohort filters"
                  />
                }
                menuLabelText="Filter your cohort by:"
                menuLabelCustomClass="font-bold text-primary"
              />

              {activeTab === "summary" && (
                <>
                  <DropdownWithIcon
                    dropdownElements={[
                      { title: "JSON (Coming Soon)" },
                      { title: "TSV (Coming Soon)" },
                    ]}
                    TargetButtonChildren="Biospecimen"
                  />

                  <DropdownWithIcon
                    dropdownElements={[
                      { title: "JSON (Coming Soon)" },
                      { title: "TSV (Coming Soon)" },
                    ]}
                    TargetButtonChildren="Clinical"
                  />
                </>
              )}
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
              value={activeTab}
              onTabChange={setActiveTab}
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
    </div>
  );
};

export default ContextBar;
