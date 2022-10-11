import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SomaticMutationsTableProps, DEFAULT_SMTABLE_ORDER } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
// import { SMTableControls } from "./MTableControls";
// import { SMTableFilters } from "./MTableFilters";
// import { getMutation, createTableColumn } from "./mutationsTableUtils";
// import { MutationsColumns } from "@/features/shared/table-utils";
import { useSpring } from "react-spring";
import PageSize from "../shared/PageSize";
import PageStepper from "../shared/PageStepper";

export const SomaticMutationsTable: React.FC<SomaticMutationsTableProps> = ({
  initialData,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  pageSize,
  handlePageSize,
  offset,
  handleOffset,
  selectedMutations,
  selectMutation,
  selectAll,
}: SomaticMutationsTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnListOrder, setColumnListOrder] = useState(DEFAULT_SMTABLE_ORDER);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState(
    DEFAULT_SMTABLE_ORDER.filter((col) => col.visible),
  );

  return <></>;
};

export default SomaticMutationsTable;
