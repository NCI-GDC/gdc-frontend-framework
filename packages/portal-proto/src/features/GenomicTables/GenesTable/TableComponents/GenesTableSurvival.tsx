import { Survival, ToggledCheck } from "@/components/expandableTables/shared";
import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";

const GenesTableSurvival = ({
  SSMSAffectedCasesInCohort,
  survival,
  handleSurvivalPlotToggled,
  symbol,
}: {
  SSMSAffectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  survival: Survival;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  symbol: string;
}): JSX.Element => {
  const { numerator } = SSMSAffectedCasesInCohort ?? {
    numerator: 0,
  };
  const disabled = numerator < 10;
  const selected = survival;
  const isActive = selected.checked;
  const tooltip = disabled
    ? `Not enough data`
    : isActive
    ? `Click to remove ${selected.symbol} from plot`
    : `Click to plot ${selected.symbol}`;
  // NOTE: If button is disabled then tooltips will not show up
  // https://floating-ui.com/docs/react#disabled-elements
  return (
    <ToggledCheck
      margin="ml-0.5"
      ariaText={`Toggle survival plot for ${symbol} gene`}
      isActive={survival.checked}
      icon={<SurvivalIcon size={24} />}
      selected={survival as unknown as Record<string, string>} // need to fix this
      handleSwitch={handleSurvivalPlotToggled}
      survivalProps={{ plot: "gene.symbol" }}
      tooltip={tooltip}
      disabled={disabled}
    />
  );
};

export default GenesTableSurvival;
