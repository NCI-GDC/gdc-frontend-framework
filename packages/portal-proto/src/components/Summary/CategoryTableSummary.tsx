import { TempTable } from "@/features/files/FileView";
import { HeaderTitle } from "@/features/shared/tailwindComponents";

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
  <div className="flex-1">
    <div className="bg-base-lightest text-base-contrast-lighter p-2">
      <HeaderTitle>{title}</HeaderTitle>
      {!dataObject && (
        <span className="block text-center text-sm pt-4">No results found</span>
      )}
    </div>
    {dataObject ? <TempTable tableData={tableData} /> : null}
  </div>
);
