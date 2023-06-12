import { SwitchSpring } from "@/components/expandableTables/shared";
import CohortInactiveIcon from "public/user-flow/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/user-flow/icons/cohort-dna.svg";
import { SsmToggledHandler } from "../utils";

const SMTableCohort = ({
  toggledSsms,
  mutationID,
  isDemoMode,
  cohort,
  handleSsmToggled,
  DNAChange,
}: {
  toggledSsms: readonly string[];
  mutationID: string;
  isDemoMode: boolean;
  cohort: {
    checked: boolean;
  };
  handleSsmToggled: SsmToggledHandler;
  DNAChange: string;
}): JSX.Element => (
  <SwitchSpring
    isActive={toggledSsms.includes(mutationID)}
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
        : toggledSsms.includes(mutationID)
        ? `Click to remove ${DNAChange} from cohort filters`
        : `Click to add ${DNAChange} to cohort filters`
    }
    disabled={isDemoMode}
  />
);

export default SMTableCohort;
