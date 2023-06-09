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
} from "@gff/core";
import { useEffect, useState, useReducer, useMemo, useContext } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import {
  SomaticMutations,
  DEFAULT_SMTABLE_ORDER,
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
import { ButtonTooltip } from "../shared";

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
  columnsList?: Array<Columns>;
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
  columnsList = DEFAULT_SMTABLE_ORDER,
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

  console.log({ data });
  const [ref, { width }] = useMeasure();
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const columnListOrder = buildSMTableColumn({
    // accessor,
    handleSurvivalPlotToggled,
    handleSsmToggled,
    toggledSsms,
    geneSymbol,
    projectId,
    isDemoMode,
    setEntityMetadata,
    isModal,
  });
  const [columns, setColumns] = useState(columnListOrder);
  // const visibleColumns = columnListOrder.filter((col) => col.visible);

  // const [smTotal, setSMTotal] = useState(0);

  // const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [tableData, setTableData] = useState<GDCSsmsTable>({
    cases: 0,
    filteredCases: 0,
    ssmsTotal: 0,
    pageSize: pageSize,
    offset: 0,
    ssms: [],
  });
  // const prevGenomicFilters = usePrevious(genomicFilters);
  // const prevCohortFilters = usePrevious(cohortFilters);
  // const sets = useCoreSelector((state) => selectSetsByType(state, "ssms"));

  // this is needed
  // const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
  //   offset: 300,
  //   duration: 1000,
  // });

  // useEffect(() => {
  //   // should happen only on mount
  //   if (searchTerm) scrollIntoView();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
    return ssms.map((sm) => {
      return getMutation(
        sm,
        selectedSurvivalPlot,
        filteredCases,
        cases,
        ssmsTotal,
      );
    });
  };

  const transformResponse = useSomaticMutationsTableFormat(tableData);
  console.log(transformResponse);
  // useEffect(() => {
  //   if (
  //     !isEqual(prevGenomicFilters, genomicFilters) ||
  //     !isEqual(prevCohortFilters, cohortFilters)
  //   )
  //     setPage(0);
  // }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  // useEffect(() => {
  //   setPage(0);
  // }, [pageSize]);

  useEffect(() => {
    if (!isFetching && isSuccess) {
      setTableData({
        ...data,
        pageSize: pageSize,
        offset: pageSize * page,
      });
    }
  }, [isFetching, isSuccess, data, pageSize, page]);

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
          count: 12,
          from: pageSize * page,
          page: page,
          pages: undefined,
          size: pageSize,
          total: data.ssmsTotal,
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

  // const combinedFilters = joinFilters(genomicFilters, cohortFilters);
  // const setFilters =
  //   Object.keys(selectedMutations).length > 0
  //     ? ({
  //         root: {
  //           "ssms.ssm_id": {
  //             field: "ssms.ssm_id",
  //             operands: Object.keys(selectedMutations),
  //             operator: "includes",
  //           },
  //         },
  //         mode: "and",
  //       } as FilterSet)
  //     : geneSymbol
  //     ? joinFilters(combinedFilters, {
  //         mode: "and",
  //         root: {
  //           "genes.symbol": {
  //             field: "genes.symbol",
  //             operator: "includes",
  //             operands: [geneSymbol],
  //           },
  //         },
  //       })
  //     : caseFilter
  //     ? caseFilter
  //     : combinedFilters;

  return (
    // <>
    //   {
    //     // caseFilter &&
    //     // debouncedSearchTerm.length === 0 &&
    //     // tableData.ssmsTotal === 0 ? null
    //     caseFilter ? null : (
    //       <>
    //         {/* {showSaveModal && (
    //         <SaveSelectionAsSetModal
    //           filters={buildCohortGqlOperator(setFilters)}
    //           sort="occurrence.case.project.project_id"
    //           initialSetName={
    //             Object.keys(selectedMutations).length === 0
    //               ? filtersToName(setFilters)
    //               : "Custom Mutation Selection"
    //           }
    //           saveCount={
    //             Object.keys(selectedMutations).length === 0
    //               ? smTotal
    //               : Object.keys(selectedMutations).length
    //           }
    //           setType={"ssms"}
    //           setTypeLabel="mutation"
    //           createSetHook={useCreateSsmsSetFromFiltersMutation}
    //           closeModal={() => setShowSaveModal(false)}
    //         />
    //       )}
    //       {
    //         showAddModal && (
    //         <AddToSetModal
    //           filters={setFilters}
    //           addToCount={
    //             Object.keys(selectedMutations).length === 0
    //               ? smTotal
    //               : Object.keys(selectedMutations).length
    //           }
    //           setType={"ssms"}
    //           setTypeLabel="mutation"
    //           singleCountHook={useSsmSetCountQuery}
    //           countHook={useSsmSetCountsQuery}
    //           appendSetHook={useAppendToSsmSetMutation}
    //           closeModal={() => setShowAddModal(false)}
    //           field={"ssms.ssm_id"}
    //           sort="occurrence.case.project.project_id"
    //         />
    //       )}
    //       {showRemoveModal && (
    //         <RemoveFromSetModal
    //           filters={setFilters}
    //           removeFromCount={
    //             Object.keys(selectedMutations).length === 0
    //               ? smTotal
    //               : Object.keys(selectedMutations).length
    //           }
    //           setType={"ssms"}
    //           setTypeLabel="mutation"
    //           countHook={useSsmSetCountsQuery}
    //           closeModal={() => setShowRemoveModal(false)}
    //           removeFromSetHook={useRemoveFromSsmSetMutation}
    //         />
    //       )} */}
    //         {/* {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>} */}

    //         {/* <div
    //         className="flex justify-between items-center mb-2"
    //         ref={targetRef}
    //       >
    //         <TableControls
    //           total={smTotal}
    //           numSelected={Object.keys(selectedMutations).length ?? 0}
    //           label={`Somatic Mutation`}
    //           options={[
    //             { label: "Save/Edit Mutation Set", value: "placeholder" },
    //             {
    //               label: "Save as new mutation set",
    //               value: "save",
    //               onClick: () => setShowSaveModal(true),
    //             },
    //             {
    //               label: "Add to existing mutation set",
    //               value: "add",
    //               disabled: Object.keys(sets).length === 0,
    //               onClick: () => setShowAddModal(true),
    //             },
    //             {
    //               label: "Remove from existing mutation set",
    //               value: "remove",
    //               disabled: Object.keys(sets).length === 0,
    //               onClick: () => setShowRemoveModal(true),
    //             },
    //           ]}
    //           additionalControls={
    //             <div className="flex gap-2">
    //               <ButtonTooltip label="Export All Except #Cases">
    //                 <FunctionButton>JSON</FunctionButton>
    //               </ButtonTooltip>
    //               <ButtonTooltip label="Export current view">
    //                 <FunctionButton>TSV</FunctionButton>
    //               </ButtonTooltip>
    //             </div>
    //           }
    //         />

    //         <TableFilters
    //           searchTerm={searchTerm}
    //           ariaTextOverwrite={
    //             searchTermsForGene?.geneSymbol &&
    //             `You are now viewing the Mutations table filtered by ${searchTermsForGene.geneSymbol}.`
    //           }
    //           handleSearch={handleSearch}
    //           columnListOrder={columnListOrder}
    //           handleColumnChange={handleColumnChange}
    //           showColumnMenu={showColumnMenu}
    //           setShowColumnMenu={setShowColumnMenu}
    //           defaultColumns={columnsList}
    //         />
    //       </div>

    //       <div ref={ref}>
    //         {!visibleColumns.length ? (
    //           <TablePlaceholder
    //             cellWidth="w-48"
    //             rowHeight={60}
    //             numOfColumns={15}
    //             numOfRows={pageSize}
    //             content={<span>No columns selected</span>}
    //           />
    //         ) : (
    //           <div ref={ref}>
    //             <SomaticMutationsTable
    //               status={
    //                 isFetching
    //                   ? "pending"
    //                   : isSuccess
    //                   ? "fulfilled"
    //                   : isError
    //                   ? "rejected"
    //                   : "uninitialized"
    //               }
    //               initialData={tableData}
    //               selectedSurvivalPlot={selectedSurvivalPlot}
    //               handleSurvivalPlotToggled={handleSurvivalPlotToggled}
    //               width={width}
    //               pageSize={pageSize}
    //               page={page}
    //               selectedMutations={selectedMutations}
    //               setSelectedMutations={setSelectedMutations}
    //               handleSMTotal={setSMTotal}
    //               columnListOrder={columnListOrder}
    //               visibleColumns={visibleColumns}
    //               searchTerm={searchTerm}
    //               handleSsmToggled={handleSsmToggled}
    //               toggledSsms={toggledSsms}
    //               isDemoMode={isDemoMode}
    //               isModal={isModal}
    //               geneSymbol={geneSymbol}
    //               projectId={projectId}
    //             />
    //           </div>
    //         )}
    //       </div>
    //       {visibleColumns.length ? (
    //         <div className="flex font-heading items-center bg-base-max border-base-lighter border-1 border-t-0 py-3 px-4">
    //           <div className="flex flex-row flex-nowrap items-center m-auto ml-0">
    //             <div className="grow-0">
    //               <div className="flex flex-row items-center text-sm ml-0">
    //                 <span className="my-auto mx-1">Show</span>
    //                 <PageSize
    //                   pageSize={pageSize}
    //                   handlePageSize={setPageSize}
    //                 />
    //                 <span className="my-auto mx-1">Entries</span>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex flex-row justify-between items-center text-sm">
    //             <span>
    //               Showing
    //               <span className="font-bold">{` ${(tableData.ssmsTotal === 0
    //                 ? 0
    //                 : page * pageSize + 1
    //               ).toLocaleString("en-US")} `}</span>
    //               -
    //               <span className="font-bold">{`${((page + 1) * pageSize <
    //               smTotal
    //                 ? (page + 1) * pageSize
    //                 : smTotal
    //               ).toLocaleString("en-US")} `}</span>
    //               of
    //               <span className="font-bold">{` ${smTotal.toLocaleString(
    //                 "en-US",
    //               )} `}</span>
    //               somatic mutations
    //             </span>
    //           </div>
    //           <div className="m-auto mr-0">
    //             <PageStepper
    //               page={page}
    //               totalPages={Math.ceil(smTotal / pageSize)}
    //               handlePage={handleSetPage}
    //             />
    //           </div>
    //         </div>
    //       ) : null} */}
    //       </>
    //     )
    //   }
    // </>
    <VerticalTable
      tableTitle={tableTitle}
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
  );
};

export default SMTableContainer;
