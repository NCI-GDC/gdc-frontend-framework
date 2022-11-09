import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GenesTableProps } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { getGene, createTableColumn } from "./genesTableUtils";
import { Genes } from "./types";
import { useSpring } from "react-spring";
import { searchContains } from "../shared/sharedTableUtils";
import { Subrow } from "../shared/Subrow";
import { useGetGeneTableSubrowQuery } from "@gff/core";

export const GenesTable: React.FC<GenesTableProps> = ({
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  page,
  selectedGenes,
  setSelectedGenes,
  handleGTotal,
  columnListOrder,
  visibleColumns,
  searchTerm,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(
    {} as Record<number, boolean>,
  );
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [geneID, setGeneID] = useState(undefined);

  const useGeneTableFormat = useCallback(
    (initialData) => {
      const { cases, mutationCounts, filteredCases, genes, genes_total } =
        initialData;
      return genes.map((gene) => {
        return getGene(
          gene,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
          genes_total,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  const transformResponse = useGeneTableFormat(initialData);

  useEffect(() => {
    if (transformResponse[0]?.genesTotal)
      handleGTotal(transformResponse[0].genesTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformResponse]);

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

  const getSpringWidth = (w, vc) => {
    return Math.floor(w / vc.length); // todo: decide what to show w/ no columns selected
  };

  const partitionWidth = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: getSpringWidth(width, visibleColumns), opacity: 1 },
  });

  // useEffect(() => {
  //   setVisibleColumns(columnListOrder.filter((col) => col.visible));
  // }, [columnListOrder]);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  const columns = useMemo<ColumnDef<Genes>[]>(() => {
    return visibleColumns
      .map(({ id }) => id)
      .map((accessor) => {
        return createTableColumn(
          accessor,
          partitionWidth,
          selectedGenes,
          setSelectedGenes,
          handleSurvivalPlotToggled,
          setGeneID,
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns, selectedGenes, setSelectedGenes, geneID, setGeneID]);

  useEffect(() => {
    setExpanded({});
    setExpandedProxy({});
  }, [visibleColumns, selectedGenes, page, searchTerm, pageSize]);

  // const handleColumnChange = (columnUpdate) => {
  //   setColumnListOrder(columnUpdate);
  // };

  return (
    <div>
      <ExpTable
        data={transformResponse.filter((tr) => {
          if (
            ["geneID", "symbol", "name"].some((field) =>
              searchContains(tr, field, searchTerm),
            )
          ) {
            return tr;
          }
        })}
        columns={columns}
        expanded={expanded}
        handleExpandedProxy={handleExpandedProxy}
        selectAll={setSelectedGenes}
        allSelected={selectedGenes}
        firstColumn={columnListOrder[0].id}
        headerWidth={width / visibleColumns.length}
        subrow={
          <Subrow
            id={geneID}
            width={width}
            query={useGetGeneTableSubrowQuery}
            subrowTitle={`# SSMS Affected Cases Across The GDC`}
          />
        }
      />
    </div>
  );
};
