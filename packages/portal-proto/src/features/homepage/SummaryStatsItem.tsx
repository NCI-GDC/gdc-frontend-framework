import { ReactElement } from "react";

interface SummaryStatsItemProp {
  readonly title: string;
  readonly icon: ReactElement;
  readonly count: number;
}

export const SummaryStatsItem: React.FC<SummaryStatsItemProp> = ({
  title,
  icon,
  count,
}: SummaryStatsItemProp) => {
  return (
    <div className="font-heading text-summarybar-text mt-1 flex flex-col flex-nowrap items-center justify-start">
      <div>{icon}</div>
      <div className="-mb-1 mt-1 text-[1.1rem] font-medium tracking-tight">
        {count && count >= 0 ? count.toLocaleString() : ""}
      </div>
      <div className="text-sm font-semibold">{title}</div>
    </div>
  );
};
