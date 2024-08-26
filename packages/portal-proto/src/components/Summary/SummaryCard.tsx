import { HeaderTitle } from "@/components/tailwindComponents";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";

export interface SummaryCardProps {
  readonly title?: string;
  readonly tableData: HorizontalTableProps["tableData"];
  readonly customDataTestID?: string;
}

export const SummaryCard = ({
  title = "Summary",
  tableData,
  customDataTestID,
}: SummaryCardProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 flex-grow">
      {title !== "" ? (
        <HeaderTitle>{title}</HeaderTitle>
      ) : (
        <div className="h-7" />
      )}

      <HorizontalTable
        customDataTestID={customDataTestID}
        tableData={tableData}
      />
    </div>
  );
};
