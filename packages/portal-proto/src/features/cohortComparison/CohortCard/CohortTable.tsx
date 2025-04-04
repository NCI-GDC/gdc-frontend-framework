import { CohortComparisonType } from "../CohortComparison";

const CohortTable = ({
  cohorts,
  counts,
  casesFetching,
}: {
  cohorts: CohortComparisonType;
  counts: number[];
  casesFetching: boolean;
}) => {
  const headerClass =
    "px-4 py-2 text-left font-bold text-primary-dark border-b border-base-lighter";

  const cellClass = "px-4 py-2 border-b border-base-lighter";

  const formatCount = (index: number) => {
    if (casesFetching || counts.length === 0) return "...";
    return counts[index] ? counts[index].toLocaleString() : "0";
  };

  return (
    <table className="w-full border border-base-lighter">
      <thead>
        <tr className="bg-base-max">
          <th className={headerClass}>Cohort</th>
          <th className={`${headerClass} text-right`}># Cases</th>
        </tr>
      </thead>
      <tbody>
        {cohorts && (
          <>
            <tr className="bg-base-lightest">
              <td className={`${cellClass} font-bold text-primary-dark`}>
                {cohorts.primary_cohort?.name}
              </td>
              <td
                className={`${cellClass} text-right text-secondary-contrast-lighter`}
              >
                {formatCount(0)}
              </td>
            </tr>
            <tr className="bg-base-max">
              <td className={`${cellClass} font-bold text-[#BD5800]`}>
                {cohorts.comparison_cohort?.name}
              </td>
              <td
                className={`${cellClass} text-right text-secondary-contrast-lighter`}
              >
                {formatCount(1)}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};

export default CohortTable;
