import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { GenesTableProps } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { getGene, createTableColumn } from "./genesTableUtils";
import { Genes } from "./types";
import { Subrow } from "../shared/Subrow";
import { useGetGeneTableSubrowQuery } from "@gff/core";
import { SummaryModalContext } from "src/utils/contexts";

export const GenesTable: React.FC<GenesTableProps> = ({
  status,
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  toggledGenes,
  width,
  pageSize,
  page,
  selectedGenes,
  setSelectedGenes,
  handleGTotal,
  columnListOrder,
  visibleColumns,
  searchTerm,
  isDemoMode = false,
  genomicFilters,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [geneID, setGeneID] = useState(undefined);

  const useGeneTableFormat = useCallback(
    (initialData: Record<string, any>) => {
      const {
        cases,
        cnvCases,
        mutationCounts,
        filteredCases,
        genes,
        genes_total,
      } = initialData;
      return genes.map((gene) => {
        return getGene(
          gene,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
          cnvCases,
          genes_total,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  useEffect(
    () => {
      if (transformResponse[0]?.genesTotal)
        handleGTotal(transformResponse[0].genesTotal);
      else handleGTotal(0);
    },
    // TODO resolve dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transformResponse],
  );

  const handleExpandedProxy = (exp: ExpandedState) => {
    setExpandedProxy(exp);
  };
  // `exp` is non-mutable within the lexical scope of handleExpandedProxy
  //  this effect hook is a workaround that updates expanded after expandedProxy updates
  useEffect(() => {
    const proxy = Object.keys(expandedProxy);
    const exp = Object.keys(expanded);
    // before: no rows expanded, after: 1 row expanded
    if (proxy.length === 1 && exp.length === 0) {
      setExpandedId(Number(proxy[0]));
      setExpanded(expandedProxy);
    }
    // before: 1 row expanded, after: none expanded
    if (proxy.length === 0) {
      setExpandedId(undefined);
      setExpanded({});
    }
    // before: 1 row expanded, after: new row expanded, initial row unexpanded
    if (proxy.length === 2) {
      const subsequentExpandId = Number(
        proxy.filter((key) => Number(key) !== expandedId)[0],
      );
      setExpandedId(subsequentExpandId);
      setExpanded({ [subsequentExpandId]: true });
      setExpandedProxy({ [subsequentExpandId]: true }); // this line used for rerender
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedProxy]);

  const { setEntityMetadata } = useContext(SummaryModalContext);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = useMemo<ColumnDef<Genes>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          selectedGenes,
          setSelectedGenes,
          handleSurvivalPlotToggled,
          handleGeneToggled,
          toggledGenes,
          setGeneID,
          isDemoMode,
          setEntityMetadata,
          genomicFilters,
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visibleColumns,
    selectedGenes,
    setSelectedGenes,
    geneID,
    setGeneID,
    handleSurvivalPlotToggled,
  ]);

  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedGenes, page, searchTerm, pageSize]);

  return (
    <>
      <ExpTable
        status={status}
        data={transformResponse}
        columns={columns}
        expanded={expanded}
        handleExpandedProxy={handleExpandedProxy}
        selectAll={setSelectedGenes}
        allSelected={selectedGenes}
        firstColumn={columnListOrder[0].id}
        subrow={
          <Subrow
            id={geneID}
            width={width}
            query={useGetGeneTableSubrowQuery}
            subrowTitle={`# SSMS Affected Cases Across The GDC`}
          />
        }
      />
    </>
  );
};
