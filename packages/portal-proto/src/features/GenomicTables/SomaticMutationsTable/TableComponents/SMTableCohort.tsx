import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import { SsmToggledHandler } from "../types";
import SwitchSpring from "@/components/SwitchSpring/shared/SwitchSpring";

const SMTableCohort = ({
  isToggledSsm,
  mutationID,
  isDemoMode,
  cohort,
  handleSsmToggled,
  DNAChange,
}: {
  isToggledSsm: boolean;
  mutationID: string;
  isDemoMode: boolean;
  cohort: {
    checked: boolean;
  };
  handleSsmToggled: SsmToggledHandler;
  DNAChange: string;
}): JSX.Element => (
  <SwitchSpring
    isActive={isToggledSsm}
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
    handleSwitch={() => {
      handleSsmToggled({
        mutationID: mutationID,
        symbol: DNAChange,
      });
    }}
    tooltip={
      isDemoMode
        ? "Feature not available in demo mode"
        : isToggledSsm
        ? `Remove ${DNAChange} from cohort filters`
        : `Add ${DNAChange} to cohort filters`
    }
    disabled={isDemoMode}
  />
);

export default SMTableCohort;
