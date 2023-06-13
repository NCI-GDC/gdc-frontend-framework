import {
  useGenesTable,
  FilterSet,
  usePrevious,
  useCreateGeneSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountQuery,
  useGeneSetCountsQuery,
  useAppendToGeneSetMutation,
  useRemoveFromGeneSetMutation,
  joinFilters,
  buildCohortGqlOperator,
  selectSelectedGeneIds,
} from "@gff/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { Gene, GeneToggledHandler } from "./util";
import FunctionButton from "@/components/FunctionButton";
import { useDebouncedValue } from "@mantine/hooks";
import isEqual from "lodash/isEqual";
import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal";
import { filtersToName } from "src/utils";
import { HandleChangeInput, VerticalTable } from "../shared/VerticalTable";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "../shared/tailwindComponents";
import { Text, Tooltip } from "@mantine/core";
import { buildGenesTableColumn } from "./GenesTableColumns";
import { statusBooleansToDataStatus } from "../shared/utils";
import { getGene } from "./util";
import {
  GenesTableAffectedCasesCohort,
  GenesTableCohort,
  GenesTableSurvival,
} from "./TableRowComponents";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import { SummaryModalContext } from "src/utils/contexts";
import { CountButton } from "@/components/CountButton/CountButton";
import {
  AnnotationsIcon,
  ButtonTooltip,
} from "@/components/expandableTables/shared";

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
  toggledGenes?: ReadonlyArray<string>;
  isDemoMode?: boolean;
}

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  genomicFilters,
  cohortFilters,
  toggledGenes = [],
  isDemoMode = false,
  handleMutationCountClick,
}: GTableContainerProps) => {
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 400);

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */

  /* GeneTable call */
  const { data, isSuccess, isFetching, isError } = useGenesTable({
    pageSize: pageSize,
    offset: (page - 1) * pageSize,
    searchTerm:
      debouncedSearchTerm.length > 0 ? debouncedSearchTerm.trim() : undefined,
    genomicFilters: genomicFilters,
    isDemoMode: isDemoMode,
    overwritingDemoFilter: cohortFilters,
  });
  /* GeneTable call end */

  const { setEntityMetadata } = useContext(SummaryModalContext);
  const sets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);

  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);

  const columnListOrder = useMemo(() => buildGenesTableColumn(), []);

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

  const selectedGenes = useCoreSelector((state) =>
    selectSelectedGeneIds(state),
  );

  const setFilters =
    selectedGenes.length > 0
      ? ({
          root: {
            "genes.gene_id": {
              field: "genes.gene_id",
              operands: selectedGenes,
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : joinFilters(cohortFilters, genomicFilters);

  const useGeneTableFormat = (initialData: Record<string, any>): Gene[] => {
    const { cases, cnvCases, mutationCounts, filteredCases, genes } =
      initialData;

    return genes.map((gene) => {
      return getGene(
        gene,
        selectedSurvivalPlot,
        mutationCounts,
        filteredCases,
        cases,
        cnvCases,
      );
    });
  };

  const transformResponse = useGeneTableFormat(data?.genes);

  const [formattedTableData, tempPagination] = useMemo(() => {
    if (isSuccess) {
      return [
        transformResponse?.map(
          ({
            select,
            cohort,
            survival,
            geneID,
            symbol,
            type,
            name,
            cytoband,
            SSMSAffectedCasesAcrossTheGDC,
            SSMSAffectedCasesInCohort,
            CNVGain,
            CNVLoss,
            mutations,
            annotations,
          }: Gene) => ({
            selected: select,
            cohort: (
              <GenesTableCohort
                toggledGenes={toggledGenes}
                geneID={geneID}
                isDemoMode={isDemoMode}
                cohort={cohort}
                handleGeneToggled={handleGeneToggled}
                symbol={symbol}
              />
            ),
            survival: (
              <GenesTableSurvival
                SSMSAffectedCasesInCohort={SSMSAffectedCasesInCohort}
                survival={survival}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                symbol={symbol}
              />
            ),
            geneID: geneID,
            symbol: (
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "genes",
                    entity_id: geneID,
                    contextSensitive: true,
                    // TODO: rename
                    contextFilters: genomicFilters,
                  })
                }
                label={symbol}
              />
            ),
            name: name,
            cytoband: (
              <div className={`flex flex-col items-center`}>
                {cytoband.map((cytoband, key) => {
                  return (
                    <div key={`cytoband-${key}`} className="my-0.5">
                      {cytoband}
                    </div>
                  );
                })}
              </div>
            ),
            type: type,
            SSMSAffectedCasesInCohort: (
              <GenesTableAffectedCasesCohort
                SSMSAffectedCasesInCohort={SSMSAffectedCasesInCohort}
              />
            ),
            // need to change this
            SSMSAffectedCasesAcrossTheGDC: SSMSAffectedCasesAcrossTheGDC,
            CNVGain: CNVGain,
            CNVLoss: CNVLoss,
            mutations: (
              <CountButton
                tooltipLabel={
                  parseInt(mutations.replace(/,/g, "")) === 0
                    ? `No SSMs in ${symbol}`
                    : `Search the mutations table for ${symbol}`
                }
                disabled={parseInt(mutations.replace(/,/g, "")) === 0}
                handleOnClick={() => {
                  handleMutationCountClick(geneID, symbol);
                }}
                count={parseInt(mutations.replace(/,/g, "")) ?? 0}
              />
            ),
            annotations: (
              <Tooltip label="Cancer Gene Census">
                <span>{annotations && <AnnotationsIcon />}</span>
              </Tooltip>
            ),
          }),
        ),
        {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.genes?.genes_total / pageSize),
          size: pageSize,
          total: data?.genes?.genes_total,
          sort: "None",
          label: "genes",
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
    data?.genes?.genes_total,
    isDemoMode,
    isSuccess,
    handleSurvivalPlotToggled,
    genomicFilters,
    handleGeneToggled,
    handleMutationCountClick,
    setEntityMetadata,
    toggledGenes,
  ]);

  return (
    <>
      {showSaveModal && (
        <SaveSelectionAsSetModal
          filters={buildCohortGqlOperator(setFilters)}
          initialSetName={
            selectedGenes.length === 0
              ? filtersToName(setFilters)
              : "Custom Gene Selection"
          }
          sort="case.project.project_id"
          saveCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType={"genes"}
          setTypeLabel="gene"
          createSetHook={useCreateGeneSetFromFiltersMutation}
          closeModal={() => setShowSaveModal(false)}
        />
      )}
      {showAddModal && (
        <AddToSetModal
          filters={setFilters}
          addToCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType={"genes"}
          setTypeLabel="gene"
          singleCountHook={useGeneSetCountQuery}
          countHook={useGeneSetCountsQuery}
          appendSetHook={useAppendToGeneSetMutation}
          closeModal={() => setShowAddModal(false)}
          field={"genes.gene_id"}
          sort="case.project.project_id"
        />
      )}
      {showRemoveModal && (
        <RemoveFromSetModal
          filters={setFilters}
          removeFromCount={
            selectedGenes.length === 0
              ? data?.genes?.genes_total
              : selectedGenes.length
          }
          setType={"genes"}
          setTypeLabel="gene"
          countHook={useGeneSetCountsQuery}
          closeModal={() => setShowRemoveModal(false)}
          removeFromSetHook={useRemoveFromGeneSetMutation}
        />
      )}
      <VerticalTable
        additionalControls={
          <div className="flex gap-2 items-center">
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "Save as new gene set",
                  onClick: () => setShowSaveModal(true),
                },
                {
                  title: "Add to existing gene set",
                  disabled: Object.keys(sets || {}).length === 0,
                  onClick: () => setShowAddModal(true),
                },
                {
                  title: "Remove from existing gene set",
                  disabled: Object.keys(sets || {}).length === 0,
                  onClick: () => setShowRemoveModal(true),
                },
              ]}
              TargetButtonChildren="Save/Edit Gene Set"
              disableTargetWidth={true}
              LeftIcon={
                selectedGenes.length ? (
                  <CountsIcon $count={selectedGenes.length}>
                    {selectedGenes.length}
                  </CountsIcon>
                ) : null
              }
              menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
              customPosition="bottom-start"
            />
            <ButtonTooltip label="Export All Except #Cases and #Mutations">
              <FunctionButton>JSON</FunctionButton>
            </ButtonTooltip>
            <ButtonTooltip label="Export current view" comingSoon={true}>
              <FunctionButton>TSV</FunctionButton>
            </ButtonTooltip>

            <Text className="font-heading font-bold text-md">
              TOTAL OF {data?.genes?.genes_total?.toLocaleString("en-US")}{" "}
              {data?.genes?.genes_total == 1
                ? "Gene".toUpperCase()
                : `${"Gene".toUpperCase()}S`}
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
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        handleChange={handleChange}
      />
    </>
  );
};
