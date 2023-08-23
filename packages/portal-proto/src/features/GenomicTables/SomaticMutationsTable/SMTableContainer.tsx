import {
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
  useCoreDispatch,
  useCreateCaseSetFromFiltersMutation,
  addNewCohortWithFilterAndMessage,
  GDCSsmsTable,
} from "@gff/core";
import { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { Loader, LoadingOverlay, Text } from "@mantine/core";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import FunctionButton from "@/components/FunctionButton";
import { CountsIcon, HeaderTitle } from "@/features/shared/tailwindComponents";
import download from "@/utils/download";
import { convertDateToString } from "@/utils/date";
import { SomaticMutation, SsmToggledHandler } from "./types";
import { SummaryModalContext } from "@/utils/contexts";
import { HandleChangeInput } from "@/components/Table/types";
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import { getMutation, useGenerateSMTableColumns } from "./utils";
import VerticalTable from "@/components/Table/VerticalTable";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { ButtonTooltip } from "@/components/expandableTables/shared";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { statusBooleansToDataStatus } from "@/features/shared/utils";
import SMTableSubcomponent from "./SMTableSubcomponent";

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
  toggledSsms?: Array<string>;
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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(
    searchTermsForGene?.geneId ?? "",
  );
  const [
    downloadMutationsFrequencyActive,
    setDownloadMutationsFrequencyActive,
  ] = useState(false);
  const dispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const [mutationID, setMutationID] = useState(undefined);
  const combinedFilters = joinFilters(genomicFilters, cohortFilters);
  const geneFilter: FilterSet = {
    mode: "and",
    root: {
      "genes.symbol": {
        field: "genes.symbol",
        operator: "includes",
        operands: [geneSymbol],
      },
    },
  };

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  /* SM Table Call */
  const { data, isSuccess, isFetching, isError } = useGetSssmTableDataQuery({
    pageSize: pageSize,
    offset: pageSize * (page - 1),
    searchTerm: searchTerm.length > 0 ? searchTerm.trim() : undefined,
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
    caseFilter: caseFilter,
  });
  /* SM Table Call end */

  /* Create Cohort*/
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

  const generateFilters = useCallback(
    async (ssmId: string) => {
      return await createSet({
        filters: buildCohortGqlOperator(combinedFilters),
      })
        .unwrap()
        .then((setId) => {
          return {
            mode: "and",
            root: {
              "cases.case_id": {
                field: "cases.case_id",
                operands: [`set_id:${setId}`],
                operator: "includes",
              },
              "ssms.ssm_id": {
                field: "ssms.ssm_id",
                operator: "includes",
                operands: [ssmId],
              },
            },
          } as FilterSet;
        });
    },
    [combinedFilters, createSet],
  );

  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const createCohort = async (name: string) => {
    const mainFilter = await generateFilters(mutationID);
    dispatch(
      addNewCohortWithFilterAndMessage({
        filters: mainFilter,
        name,
        message: "newCasesCohort",
      }),
    );
  };

  /* Create Cohort end  */

  const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);
  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const useSomaticMutationsTableFormat = (
    initialData: Omit<GDCSsmsTable, "pageSize" | "offset">,
  ) => {
    return initialData?.ssms?.map((sm) =>
      getMutation(
        sm,
        selectedSurvivalPlot,
        initialData?.filteredCases,
        initialData?.cases,
        initialData?.ssmsTotal,
      ),
    );
  };

  const formattedTableData: SomaticMutation[] =
    useSomaticMutationsTableFormat(data);

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.ssmsTotal / pageSize),
          size: pageSize,
          total: data?.ssmsTotal,
          sort: "None",
          label: "somatic mutations",
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
        };
  }, [pageSize, page, data?.ssmsTotal, isSuccess]);

  const SMTableDefaultColumns = useGenerateSMTableColumns({
    isDemoMode,
    handleSsmToggled,
    toggledSsms,
    handleSurvivalPlotToggled,
    isModal,
    geneSymbol,
    setEntityMetadata,
    projectId,
    setMutationID,
    setShowCreateCohort,
  });

  const [rowSelection, setRowSelection] = useState({});
  const selectedMutations = Object.entries(rowSelection)
    .filter(([, isSelected]) => isSelected)
    .map(
      ([index]) => (formattedTableData[index] as SomaticMutation).mutation_id,
    );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    SMTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    mutation_id: false,
  });

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
      ? joinFilters(combinedFilters, geneFilter)
      : caseFilter
      ? caseFilter
      : combinedFilters;

  const handleJSONDownload = async () => {
    setDownloadMutationsFrequencyActive(true);
    await download({
      endpoint: "ssms",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      params: {
        filters:
          buildCohortGqlOperator(
            geneSymbol
              ? joinFilters(combinedFilters, geneFilter)
              : combinedFilters,
          ) ?? {},
        filename: `mutations.${convertDateToString(new Date())}.json`,
        attachment: true,
        format: "JSON",
        pretty: true,
        fields: [
          "genomic_dna_change",
          "mutation_subtype",
          "consequence.transcript.consequence_type",
          "consequence.transcript.annotation.vep_impact",
          "consequence.transcript.annotation.sift_impact",
          "consequence.transcript.annotation.polyphen_impact",
          "consequence.transcript.is_canonical",
          "consequence.transcript.gene.gene_id",
          "consequence.transcript.gene.symbol",
          "consequence.transcript.aa_change",
          "ssm_id",
        ].join(","),
      },
      dispatch,
      done: () => setDownloadMutationsFrequencyActive(false),
    });
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setPage(1);
        break;
      case "newPageNumber":
        setExpanded({});
        setPage(obj.newPageNumber);
        break;
      case "newSearch":
        setExpanded({});
        setSearchTerm(obj.newSearch);
        setPage(1);
        break;
    }
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowId, setRowId] = useState(-1);
  const handleExpand = (row: Row<SomaticMutation>) => {
    if (Object.keys(expanded).length > 0 && row.index === rowId) {
      setExpanded({});
    } else if (
      row.original["#_affected_cases_across_the_gdc"].numerator !== 0
    ) {
      setExpanded({ [row.index]: true });
      setRowId(row.index);
    }
  };

  return (
    <>
      {caseFilter && searchTerm.length === 0 && data?.ssmsTotal === 0 ? null : (
        <>
          {searchTermsForGene?.geneSymbol && (
            <div id="announce" aria-live="polite">
              <p>
                You are now viewing the Mutations table filtered by{" "}
                {searchTermsForGene.geneSymbol}
              </p>
            </div>
          )}
          {loading && <LoadingOverlay visible />}
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
                selectedMutations.length === 0
                  ? data?.ssmsTotal
                  : selectedMutations.length
              }
              setType="ssms"
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
              setType="ssms"
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
              setType="ssms"
              setTypeLabel="mutation"
              countHook={useSsmSetCountsQuery}
              closeModal={() => setShowRemoveModal(false)}
              removeFromSetHook={useRemoveFromSsmSetMutation}
            />
          )}
          {showCreateCohort && (
            <CreateCohortModal
              onClose={() => setShowCreateCohort(false)}
              onActionClick={(newName: string) => {
                createCohort(newName);
              }}
            />
          )}
          {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>}

          <VerticalTable
            data={formattedTableData ?? []}
            columns={SMTableDefaultColumns}
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
                  zIndex={10}
                  customDataTestId="button-save-edit-mutation-set"
                />
                <ButtonTooltip label="Export All Except #Cases">
                  <FunctionButton
                    onClick={handleJSONDownload}
                    data-testid="button-json-mutation-frequency"
                  >
                    {downloadMutationsFrequencyActive ? (
                      <Loader size="sm" />
                    ) : (
                      "JSON"
                    )}
                  </FunctionButton>
                </ButtonTooltip>
                <ButtonTooltip label="Export current view" comingSoon={true}>
                  <FunctionButton data-testid="button-tsv-mutation-frequency">
                    TSV
                  </FunctionButton>
                </ButtonTooltip>

                <Text className="font-heading font-bold text-md">
                  TOTAL OF {data?.ssmsTotal?.toLocaleString("en-US")}{" "}
                  {data?.ssmsTotal == 1
                    ? "Somatic Mutation".toUpperCase()
                    : `${"Somatic Mutation".toUpperCase()}S`}
                </Text>
              </div>
            }
            search={{
              enabled: true,
              defaultSearchTerm: searchTerm,
            }}
            pagination={pagination}
            showControls={true}
            enableRowSelection={true}
            setRowSelection={setRowSelection}
            rowSelection={rowSelection}
            status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
            getRowCanExpand={() => true}
            expandableColumnIds={["#_affected_cases_across_the_gdc"]}
            renderSubComponent={({ row }) => <SMTableSubcomponent row={row} />}
            handleChange={handleChange}
            setColumnVisibility={setColumnVisibility}
            columnVisibility={columnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            expanded={expanded}
            setExpanded={handleExpand}
          />
        </>
      )}
    </>
  );
};

export default SMTableContainer;
