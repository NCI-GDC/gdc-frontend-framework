import { SpringValue } from "react-spring";

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
