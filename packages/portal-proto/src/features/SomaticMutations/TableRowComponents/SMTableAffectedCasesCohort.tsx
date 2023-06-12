import { RatioSpring } from "@/components/expandableTables/shared";

const SMTableAffectedCasesCohort = ({
  affectedCasesInCohort,
}: {
  affectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
}): JSX.Element => {
  const { numerator, denominator } = affectedCasesInCohort ?? {
    numerator: 0,
    denominator: 1,
  };
  return <RatioSpring index={0} item={{ numerator, denominator }} />;
};

export default SMTableAffectedCasesCohort;
