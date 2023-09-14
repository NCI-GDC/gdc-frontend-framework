import { HeaderTitle } from "@/components/tailwindComponents";

import { ColumnDef } from "@tanstack/react-table";
import VerticalTable from "../Table/VerticalTable";

interface CategoryTableSummaryProps<TData> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

function CategoryTableSummary<TData>({
  title,
  data,
  columns,
}: CategoryTableSummaryProps<TData>): JSX.Element {
  return (
    <div className="basis-1/2">
      <div className="text-base-contrast-lighter">
        <HeaderTitle>{title}</HeaderTitle>
      </div>
      <VerticalTable data={data} columns={columns} />
    </div>
  );
}

export default CategoryTableSummary;
