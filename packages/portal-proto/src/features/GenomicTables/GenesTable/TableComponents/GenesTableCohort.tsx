import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import { GeneToggledHandler } from "../types";
import SwitchSpring from "@/components/SwitchSpring/shared/SwitchSpring";

const GenesTableCohort = ({
  toggledGenes,
  geneID,
  isDemoMode,
  cohort,
  handleGeneToggled,
  symbol,
}: {
  toggledGenes: readonly string[];
  geneID: string;
  isDemoMode: boolean;
  cohort: { checked: boolean };
  handleGeneToggled: GeneToggledHandler;
  symbol: string;
}): JSX.Element => {
  return (
    <SwitchSpring
      isActive={toggledGenes.includes(geneID)}
      icon={
        isDemoMode ? (
          <CohortInactiveIcon
            width={16}
            height={16}
            aria-label="inactive cohort icon"
            viewBox="-4 -1 30 30"
          />
        ) : (
          <CohortActiveIcon
            width={16}
            height={16}
            aria-label="active cohort icon"
            viewBox="-4 -1 30 30"
          />
        )
      }
      selected={cohort}
      handleSwitch={() =>
        handleGeneToggled({
          geneID: geneID,
          symbol: symbol,
        })
      }
      tooltip={
        isDemoMode
          ? "Feature not available in demo mode"
          : toggledGenes.includes(geneID)
          ? `Remove ${symbol} from cohort filters`
          : `Add ${symbol} to cohort filters`
      }
      disabled={isDemoMode}
    />
  );
};

export default GenesTableCohort;
