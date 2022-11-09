import { SpringValue } from "react-spring";
import { Row } from "@tanstack/react-table";
import { SomaticMutations } from "../somaticMutations/types";
import { Genes } from "../genes/types";

export interface Column {
  visible: boolean;
  columnName: string;
  id: string;
}

export type TableType = SomaticMutations | Genes;

export type SelectedReducer<T extends TableType> = {
  selected?: Record<string, Row<T>[]>;
};

export type SelectReducerAction<T extends TableType> = {
  type: "select" | "deselect" | "selectAll" | "deselectAll";
  rows: Row<T>[];
};

export interface TableColumnState {
  id: string;
  columnName: string;
  visible: boolean;
}

export interface Survival {
  name: string;
  symbol: string;
  checked: boolean;
}

export interface AffectedCasesProps {
  row: any;
  ratio: any;
}

export interface ColumnDefinition {
  accessorKey: string;
  header: () => JSX.Element;
  cell: ({ row }: { row: any }) => JSX.Element;
}

export interface TableColumnDefinition {
  header: string;
  footer: (props: any) => string;
  columns: ColumnDefinition[];
}

export interface WidthSpring {
  width: SpringValue; // number [ 0 - maxWidth ] (in pixels)
  opacity: SpringValue; // number [ 0 - 1 ]
}
