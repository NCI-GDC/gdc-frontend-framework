import {
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
} from "@/features/shared/tailwindComponents";

export const PercentageLabel = ({
  countPercentage,
  count,
}: {
  countPercentage: number;
  count: number;
}): JSX.Element => (
  <div className="flex h-6">
    <div className="basis-1/3 text-right">{count.toLocaleString()}</div>
    <div className="basis-2/3 pl-1">
      <PercentBar>
        <PercentBarComplete style={{ width: `${countPercentage}%` }} />
        <PercentBarLabel>{`${countPercentage.toFixed(2)}%`}</PercentBarLabel>
      </PercentBar>
    </div>
  </div>
);
