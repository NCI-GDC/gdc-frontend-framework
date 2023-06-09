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
import { useEffect, useState, useReducer, useMemo, useContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import {
  SomaticMutations,
  SsmToggledHandler,
  buildSMTableColumn,
} from "./types";
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
  Columns,
  HandleChangeInput,
  VerticalTable,
} from "@/features/shared/VerticalTable";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import { getMutation } from "./smTableUtils";
import { SummaryModalContext } from "src/utils/contexts";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { ButtonTooltip } from "../../components/expandableTables/shared";
import { DEFAULT_SMTABLE_ORDER } from "@/features/SomaticMutations/mutationTableConfig";

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
  customColumnList?: Array<Columns>;
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
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSurvivalPlotToggled = (_1: string, _2: string, _3: string) => null,
  customColumnList = DEFAULT_SMTABLE_ORDER,
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
}: SMTableContainerProps) => {
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
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
    offset: pageSize * page,
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

  // const prevGenomicFilters = usePrevious(genomicFilters);
  // const prevCohortFilters = usePrevious(cohortFilters);
  // const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));

  // this is needed
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 200,
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
        customColumnList,
        handleSurvivalPlotToggled,
        handleSsmToggled,
        toggledSsms,
        geneSymbol,
        projectId,
        isDemoMode,
        setEntityMetadata,
        isModal,
      }),
    [
      customColumnList,
      handleSurvivalPlotToggled,
      handleSsmToggled,
      toggledSsms,
      geneSymbol,
      projectId,
      isDemoMode,
      setEntityMetadata,
      isModal,
    ],
  );

  console.log({ columnListOrder });

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
        console.log({ head: obj.newHeadings });
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
  console.log(transformResponse);

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
            cohort: cohort,
            survival: survival,
            mutationID: mutationID,
            type: type,
            DNAChange: DNAChange,
            proteinChange: proteinChange,
            consequences: consequences,
            affectedCasesInCohort: affectedCasesInCohort,
            affectedCasesAcrossTheGDC: affectedCasesAcrossTheGDC,
            impact,
          }),
        ),
        {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.floor(data?.ssmsTotal / pageSize),
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
  }, [transformResponse]);

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
    // <>
    //   {
    //     // caseFilter &&
    //     // debouncedSearchTerm.length === 0 &&
    //     // tableData.ssmsTotal === 0 ? null
    //     caseFilter ? null : (

    <>
      {showSaveModal && (
        <SaveSelectionAsSetModal
          filters={buildCohortGqlOperator(setFilters)}
          sort="occurrence.case.project.project_id"
          initialSetName={
            Object.keys(selectedMutations).length === 0
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
            Object.keys(selectedMutations).length === 0
              ? data?.ssmsTotal
              : Object.keys(selectedMutations).length
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
            Object.keys(selectedMutations).length === 0
              ? data?.ssmsTotal
              : Object.keys(selectedMutations).length
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
                  [].length ? (
                    <CountsIcon $count={[].length}>{[].length}</CountsIcon>
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
          columns={columns}
          columnSorting={"none"}
          selectableRow={false}
          showControls={true}
          // pagination is a bit for last pages
          pagination={{
            ...tempPagination,
            label: "cohorts",
          }}
          search={{
            enabled: true,
            defaultSearchTerm: debouncedSearchTerm,
          }}
          status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
          handleChange={handleChange}
        />
      </div>
    </>
  );
};

export default SMTableContainer;
