import {
  GDCSsmsTable,
  FilterSet,
  usePrevious,
  useGetSssmTableDataQuery,
  useSsmSetCountQuery,
  useSsmSetCountsQuery,
  useAppendToSsmSetMutation,
  useRemoveFromSsmSetMutation,
  useCreateSsmsSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  joinFilters,
  buildCohortGqlOperator,
  selectSelectedMutationIds,
} from "@gff/core";
import { useEffect, useState, useMemo, useContext } from "react";
import { SomaticMutations, SsmToggledHandler, getMutation } from "./utils";
import { useDebouncedValue, useScrollIntoView } from "@mantine/hooks";
import { Text } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import FunctionButton from "@/components/FunctionButton";
import { CountsIcon, HeaderTitle } from "@/features/shared/tailwindComponents";
import {
  HandleChangeInput,
  VerticalTable,
} from "@/features/shared/VerticalTable";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import { SummaryModalContext } from "src/utils/contexts";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { ButtonTooltip } from "../../components/expandableTables/shared";
import {
  SMTableAffectedCasesCohort,
  SMTableCohort,
  SMTableDNAChange,
  SMTableProteinChange,
  SMTableSurvival,
  SMTableConsequences,
  SMTableImpacts,
} from "./TableRowComponents";
import { buildSMTableColumn } from "./SMTableColumns";

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot?: Record<string, string>;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: ReadonlyArray<string>;
  geneSymbol?: string;
  tableTitle?: string;
  isDemoMode?: boolean;
  /*
   * filter about case id sent from case summary for SMT
   */
  caseFilter?: FilterSet;
  /*
   * project id for case summary SM Table
   */
  projectId?: string;
  /*
   * boolean used to determine if the links need to be opened in a summary modal or a Link
   */
  isModal?: boolean;
  /*
   *  This is being sent from GenesAndMutationFrequencyAnalysisTool when mutation count is clicked in genes table
   */
  searchTermsForGene?: { geneId?: string; geneSymbol?: string };
  isMutationFreqApp?: boolean;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSurvivalPlotToggled = (_1: string, _2: string, _3: string) => null,
  geneSymbol = undefined,
  projectId = undefined,
  genomicFilters = { mode: "and", root: {} },
  cohortFilters = { mode: "and", root: {} },
  caseFilter = undefined,
  handleSsmToggled = () => null,
  toggledSsms = [],
  isDemoMode = false,
  isModal = false,
  tableTitle = undefined,
  searchTermsForGene,
  isMutationFreqApp = false,
}: SMTableContainerProps) => {
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(
    searchTermsForGene?.geneId ?? "",
  );
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 400);
  /* States for table end */

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  /* SSMTable call */
  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * (page - 1),
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm.trim() : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
    caseFilter: caseFilter,
  });
  /* SSMTable call end */
  const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));
  const { setEntityMetadata } = useContext(SummaryModalContext);

  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);

  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  // need to fix the offset
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 100,
    duration: 1000,
  });

  useEffect(() => {
    // should happen only on mount
    if (searchTerm) scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnListOrder = useMemo(
    () =>
      buildSMTableColumn({
        geneSymbol,
        projectId,
        isModal,
        isMutationFreqApp,
      }),
    [geneSymbol, projectId, isModal, isMutationFreqApp],
  );

  const [columns, setColumns] = useState(columnListOrder);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setPage(1);
        break;
      case "newPageNumber":
        setPage(obj.newPageNumber);
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setPage(1);
        break;
      case "newHeadings":
        setColumns(obj.newHeadings);
        break;
    }
  };

  const useSomaticMutationsTableFormat = (initialData: GDCSsmsTable) => {
    const { cases, filteredCases, ssmsTotal, ssms } = initialData;
    return ssms?.map((sm) =>
      getMutation(sm, selectedSurvivalPlot, filteredCases, cases, ssmsTotal),
    );
  };

  const transformResponse = useSomaticMutationsTableFormat({
    ...data,
    pageSize: pageSize,
    offset: pageSize * page,
  });

  const [formattedTableData, tempPagination] = useMemo(() => {
    if (isSuccess) {
      return [
        transformResponse?.map(
          ({
            select,
            cohort,
            survival,
            mutationID,
            DNAChange,
            type,
            proteinChange,
            consequences,
            affectedCasesInCohort,
            affectedCasesAcrossTheGDC,
            impact,
          }: SomaticMutations) => ({
            selected: select,
            ...(isMutationFreqApp && {
              cohort: (
                <SMTableCohort
                  toggledSsms={toggledSsms}
                  mutationID={mutationID}
                  isDemoMode={isDemoMode}
                  cohort={cohort}
                  handleSsmToggled={handleSsmToggled}
                  DNAChange={DNAChange}
                />
              ),
            }),
            ...(isMutationFreqApp && {
              survival: (
                <SMTableSurvival
                  affectedCasesInCohort={affectedCasesInCohort}
                  survival={survival}
                  proteinChange={proteinChange}
                  handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                />
              ),
            }),
            mutationID: mutationID,
            type: type,
            DNAChange: (
              <SMTableDNAChange
                DNAChange={DNAChange}
                mutationID={mutationID}
                isModal={isModal}
                geneSymbol={geneSymbol}
                setEntityMetadata={setEntityMetadata}
              />
            ),
            proteinChange: (
              <SMTableProteinChange
                proteinChange={proteinChange}
                shouldOpenModal={isModal && geneSymbol === undefined}
                shouldLink={projectId !== undefined}
                setEntityMetadata={setEntityMetadata}
              />
            ),
            consequences: <SMTableConsequences consequences={consequences} />,
            affectedCasesInCohort: (
              <SMTableAffectedCasesCohort
                affectedCasesInCohort={affectedCasesInCohort}
              />
            ),
            // need to change this
            affectedCasesAcrossTheGDC: affectedCasesAcrossTheGDC,
            impact: <SMTableImpacts impact={impact} />,
          }),
        ),
        {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.ssmsTotal / pageSize),
          size: pageSize,
          total: data?.ssmsTotal,
          sort: "None",
          label: "somatic mutations",
        },
      ];
    } else
      return [
        [],
        {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
        },
      ];
  }, [
    transformResponse,
    page,
    pageSize,
    data?.ssmsTotal,
    toggledSsms,
    geneSymbol,
    handleSsmToggled,
    isDemoMode,
    isModal,
    isSuccess,
    projectId,
    setEntityMetadata,
    isMutationFreqApp,
    handleSurvivalPlotToggled,
  ]);

  // for selected mutation use new selector
  const selectedMutations = useCoreSelector((state) =>
    selectSelectedMutationIds(state),
  );

  const combinedFilters = joinFilters(genomicFilters, cohortFilters);
  const setFilters =
    selectedMutations.length > 0
      ? ({
          root: {
            "ssms.ssm_id": {
              field: "ssms.ssm_id",
              operands: selectedMutations,
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : geneSymbol
      ? joinFilters(combinedFilters, {
          mode: "and",
          root: {
            "genes.symbol": {
              field: "genes.symbol",
              operator: "includes",
              operands: [geneSymbol],
            },
          },
        })
      : caseFilter
      ? caseFilter
      : combinedFilters;

  return (
    <>
      {caseFilter &&
      debouncedSearchTerm.length === 0 &&
      data?.ssmsTotal === 0 ? null : (
        <>
          {showSaveModal && (
            <SaveSelectionAsSetModal
              filters={buildCohortGqlOperator(setFilters)}
              sort="occurrence.case.project.project_id"
              initialSetName={
                selectedMutations.length === 0
                  ? filtersToName(setFilters)
                  : "Custom Mutation Selection"
              }
              saveCount={
                Object.keys(selectedMutations).length === 0
                  ? data?.ssmsTotal
                  : Object.keys(selectedMutations).length
              }
              setType={"ssms"}
              setTypeLabel="mutation"
              createSetHook={useCreateSsmsSetFromFiltersMutation}
              closeModal={() => setShowSaveModal(false)}
            />
          )}
          {showAddModal && (
            <AddToSetModal
              filters={setFilters}
              addToCount={
                selectedMutations.length === 0
                  ? data?.ssmsTotal
                  : selectedMutations.length
              }
              setType={"ssms"}
              setTypeLabel="mutation"
              singleCountHook={useSsmSetCountQuery}
              countHook={useSsmSetCountsQuery}
              appendSetHook={useAppendToSsmSetMutation}
              closeModal={() => setShowAddModal(false)}
              field={"ssms.ssm_id"}
              sort="occurrence.case.project.project_id"
            />
          )}
          {showRemoveModal && (
            <RemoveFromSetModal
              filters={setFilters}
              removeFromCount={
                selectedMutations.length === 0
                  ? data?.ssmsTotal
                  : selectedMutations.length
              }
              setType={"ssms"}
              setTypeLabel="mutation"
              countHook={useSsmSetCountsQuery}
              closeModal={() => setShowRemoveModal(false)}
              removeFromSetHook={useRemoveFromSsmSetMutation}
            />
          )}
          <div ref={targetRef}>
            {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>}
            <VerticalTable
              additionalControls={
                <div className="flex gap-2 items-center">
                  <DropdownWithIcon
                    dropdownElements={[
                      {
                        title: "Save as new mutation set",
                        onClick: () => setShowSaveModal(true),
                      },
                      {
                        title: "Add to existing mutation set",
                        disabled: Object.keys(sets).length === 0,
                        onClick: () => setShowAddModal(true),
                      },
                      {
                        title: "Remove from existing mutation set",
                        disabled: Object.keys(sets).length === 0,
                        onClick: () => setShowRemoveModal(true),
                      },
                    ]}
                    TargetButtonChildren="Save/Edit Mutation Set"
                    disableTargetWidth={true}
                    LeftIcon={
                      selectedMutations.length ? (
                        <CountsIcon $count={selectedMutations.length}>
                          {selectedMutations.length}
                        </CountsIcon>
                      ) : null
                    }
                    menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
                    customPosition="bottom-start"
                  />
                  <ButtonTooltip label="Export All Except #Cases">
                    <FunctionButton>JSON</FunctionButton>
                  </ButtonTooltip>
                  <ButtonTooltip label="Export current view">
                    <FunctionButton>TSV</FunctionButton>
                  </ButtonTooltip>

                  <Text className="font-heading font-bold text-md">
                    TOTAL OF {data?.ssmsTotal?.toLocaleString("en-US")}{" "}
                    {data?.ssmsTotal == 1
                      ? "Somatic Mutation".toUpperCase()
                      : `${"Somatic Mutation".toUpperCase()}S`}
                  </Text>
                </div>
              }
              tableData={formattedTableData}
              columns={columns} // show columns is bit messed up
              columnSorting="none"
              selectableRow={false}
              showControls={true}
              pagination={tempPagination}
              search={{
                enabled: true,
                defaultSearchTerm: debouncedSearchTerm,
              }}
              status={statusBooleansToDataStatus(
                isFetching,
                isSuccess,
                isError,
              )}
              handleChange={handleChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default SMTableContainer;
