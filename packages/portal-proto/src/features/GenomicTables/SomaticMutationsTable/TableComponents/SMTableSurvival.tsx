import { IoMdTrendingDown as SurvivalIcon } from "react-icons/io";
import ToggledCheck from "../../SharedComponent/ToggledCheck";
import { Survival } from "../types";

const SMTableSurvival = ({
  affectedCasesInCohort,
  survival,
  proteinChange,
  handleSurvivalPlotToggled,
}: {
  affectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  survival: Survival;
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}): JSX.Element => {
  const { numerator } = affectedCasesInCohort ?? {
    numerator: 0,
  };
  const disabled = numerator < 10;
  const isActive = survival.checked;
  const tooltip = disabled
    ? `Not enough data`
    : isActive
    ? `Click to remove ${survival.name} from plot`
    : `Click to plot ${survival.name}`;

  return (
    <ToggledCheck
      ariaText={`Toggle survival plot for ${proteinChange} mutation`}
      margin="ml-0.5"
      isActive={survival?.checked}
      icon={<SurvivalIcon size={24} />}
      survivalProps={{ plot: "gene.ssm.ssm_id" }}
      selected={survival as unknown as Record<string, string>} // need to fix this
      disabled={disabled}
      handleSwitch={handleSurvivalPlotToggled}
      tooltip={tooltip}
    />
  );
};

export default SMTableSurvival;
