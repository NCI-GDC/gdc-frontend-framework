import { Image } from "@/components/Image";

interface SummaryStatsItemProp {
  readonly title: string;
  readonly icon: string;
  readonly count: number;
  readonly size?: number;
}

export const SummaryStatsItem: React.FC<SummaryStatsItemProp> = ({
  title,
  icon,
  count,
  size = 24,
}: SummaryStatsItemProp) => {
  return (
    <div className="flex flex-col flex-nowrap font-heading text-summarybar-text justify-start ` items-center">
      <div className="rounded-full bg-summarybar-icon-background flex flex-row items-center p-2 mb-1">
        <Image src={icon} width={size} height={size} />
      </div>
      <div className="-mb-1">
        {count && count >= 0 ? count.toLocaleString() : ""}
      </div>
      <div className="text-[0.7rem] font-bold">{title}</div>
    </div>
  );
};
