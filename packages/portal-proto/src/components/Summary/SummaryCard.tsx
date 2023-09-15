import { HeaderTitle } from "@/components/tailwindComponents";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";

export interface SummaryCardProps {
  readonly title?: string;
  readonly message?: JSX.Element;
  readonly tableData: HorizontalTableProps["tableData"];
  readonly customDataTestID?: string;
}

export const SummaryCard = ({
  title = "Summary",
  message,
  tableData,
  customDataTestID,
}: SummaryCardProps): JSX.Element => {
  return (
    <div>
      <div
        className={`p-2 pl-0 pb-0 ${
          title.length === 0 && !message && "mb-7"
        } flex justify-between`}
      >
        <HeaderTitle>{title}</HeaderTitle>
        {message && <div className="text-sm">{message}</div>}
      </div>

      <div className={message && "mt-2"}>
        <HorizontalTable
          customDataTestID={customDataTestID}
          tableData={tableData}
        />
      </div>
    </div>
  );
};
