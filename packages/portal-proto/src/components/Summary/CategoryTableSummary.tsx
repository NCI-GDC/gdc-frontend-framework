import { TempTable } from "@/features/files/FileView";

interface CategoryTableSummaryProps {
  title: string;
  dataObject: Array<Record<string, any>>;
  tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
}

export const CategoryTableSummary = ({
  title,
  dataObject,
  tableData,
}: CategoryTableSummaryProps): JSX.Element => (
  <div className="flex-1">
    <div className="bg-white text-nci-gray p-2">
      <h2 className="text-lg font-medium">{title}</h2>
      {!dataObject && (
        <span className="block text-center text-sm pt-4">No results found</span>
      )}
    </div>
    {dataObject ? <TempTable tableData={tableData} /> : null}
  </div>
);
