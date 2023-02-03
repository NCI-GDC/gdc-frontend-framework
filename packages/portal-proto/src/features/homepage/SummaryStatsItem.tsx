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
    <div className="flex flex-col mt-1 flex-nowrap font-heading text-summarybar-text justify-start items-center">
      <div>
        <Image src={icon} width={size} height={size} />
      </div>
      <div className="-mb-1 -mt-1 text-[1.1rem] font-medium tracking-tight">
        {count && count >= 0 ? count.toLocaleString() : ""}
      </div>
      <div className="text-[0.75rem] font-semibold">{title}</div>
    </div>
  );
};
