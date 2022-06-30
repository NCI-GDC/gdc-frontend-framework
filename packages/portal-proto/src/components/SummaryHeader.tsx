import { HorizontalTable, HorizontalTableProps } from "./HorizontalTable";
import { TypeIcon } from "./TypeIcon";

interface SummaryHeaderProps {
  iconText: string;
  headerTitle: string | number;
}
export const SummaryHeader = ({
  iconText,
  headerTitle,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <div className="bg-white py-4 px-8 shadow-lg">
      <TypeIcon iconText={iconText} />
      <span className="text-2xl text-nci-blue-darker">{headerTitle}</span>
    </div>
  );
};

export interface SummaryCardProps {
  readonly title?: string;
  readonly message?: JSX.Element;
  readonly Icon?: any;
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
      <div className="flex gap-2">
        {Icon && <Icon className="inline-block mt-1 align-baseline" />}
        <h2 className="bg-white text-lg">{title}</h2>
      </div>

      {message && <div className="mt-2 text-sm">{message}</div>}
      <div className={message && "pt-2"}>
        <HorizontalTable tableData={tableData} />
      </div>
    </div>
  );
};
