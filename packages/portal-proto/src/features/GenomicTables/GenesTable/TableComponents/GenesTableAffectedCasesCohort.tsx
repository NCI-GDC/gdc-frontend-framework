import { RatioSpring } from "@/components/expandableTables/shared";

const GenesTableAffectedCasesCohort = ({
  SSMSAffectedCasesInCohort,
}: {
  SSMSAffectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
}): JSX.Element => {
  const { numerator, denominator } = SSMSAffectedCasesInCohort ?? {
    numerator: 0,
    denominator: 1,
  };
  return <RatioSpring index={0} item={{ numerator, denominator }} />;
};

export default GenesTableAffectedCasesCohort;
