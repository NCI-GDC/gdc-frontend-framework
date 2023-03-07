import { HeaderTitle } from "@/features/shared/tailwindComponents";
import { BasicTable } from "../Tables/BasicTable";

interface CategoryTableSummaryProps {
  title: string;
  dataObject: Array<Record<string, any>>;
  tableData: {
    readonly headers: string[] | JSX.Element[];
    readonly tableRows: any[];
  };
}

export const CategoryTableSummary = ({
  title,
  dataObject,
  tableData,
}: CategoryTableSummaryProps): JSX.Element => (
  <div className="basis-1/2">
    <div className="text-base-contrast-lighter">
      <HeaderTitle>{title}</HeaderTitle>
      {!dataObject && (
        <span className="block text-center text-sm pt-4">No results found</span>
      )}
    </div>
    {dataObject ? <BasicTable tableData={tableData} /> : null}
  </div>
);
