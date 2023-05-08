import { HeaderTitle } from "@/features/shared/tailwindComponents";
import { IconType } from "react-icons";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";

export interface SummaryCardProps {
  readonly title?: string;
  readonly message?: JSX.Element;
  readonly Icon?: IconType;
  readonly tableData: HorizontalTableProps["tableData"];
}

export const SummaryCard = ({
  title = "Summary",
  message,
  tableData,
  Icon,
}: SummaryCardProps): JSX.Element => {
  return (
    <div>
      <div className="flex gap-2 bg-base-lightest p-2">
        {Icon && (
          <Icon className="inline-block mt-1 align-baseline text-primary-content-darkest" />
        )}
        <HeaderTitle>{title}</HeaderTitle>
      </div>

      {message && <div className="mt-2 text-sm">{message}</div>}
      <div className={message && "pt-2"}>
        <HorizontalTable tableData={tableData} />
      </div>
    </div>
  );
};
