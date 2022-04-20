import { Paper, Tooltip } from "@mantine/core";
import {
  useSurvivalPlot,
  selectCurrentCohortCaseGqlFilters,
  useCoreSelector,
  selectAvailableCohortByName,
  buildCohortGqlOperator,
} from "@gff/core";
import SurvivalPlot from "../charts/SurvivalPlot";

const dataCompletenessFilters = [
  {
    op: "or",
    content: [
      {
        op: "and",
        content: [
          {
            op: ">",
            content: {
              field: "demographic.days_to_death",
              value: 0,
            },
          },
        ],
      },
      {
        op: "and",
        content: [
          {
            op: ">",
            content: {
              field: "diagnoses.days_to_last_follow_up",
              value: 0,
            },
          },
        ],
      },
    ],
  },
  {
    op: "not",
    content: { field: "demographic.vital_status" },
  },
];

const tooltipLabel = (
  <>
    <p>
      Criteria for including a case from your cohorts in the survival analysis:
    </p>
    <p>- the case is in only one of your cohorts, not both</p>
    <p>- the case has the required data for the analysis</p>
  </>
);

interface SurvivalCardProps {
  readonly counts: number[];
  readonly comparisonCohort: string;
}

const SurvivalCard: React.FC<SurvivalCardProps> = ({
  counts,
  comparisonCohort,
}: SurvivalCardProps) => {
  const cohort1Filters = useCoreSelector((state) =>
    selectCurrentCohortCaseGqlFilters(state),
  );
  const cohort2Filters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      selectAvailableCohortByName(state, comparisonCohort).filters,
    ),
  );

  // TODO: limit to cases that are only within a single cohort
  const { data } = useSurvivalPlot({
    filters: [
      {
        op: "and",
        content: cohort1Filters
          ? [...dataCompletenessFilters, cohort1Filters]
          : [...dataCompletenessFilters],
      },
      {
        op: "and",
        content: cohort2Filters
          ? [...dataCompletenessFilters, cohort2Filters]
          : [...dataCompletenessFilters],
      },
    ],
  });

  const cohort1Count = data?.survivalData[0]
    ? data.survivalData[0].donors?.length
    : 0;
  const cohort2Count = data?.survivalData[1]
    ? data.survivalData[1].donors?.length
    : 0;

  return (
    <Paper p="md" className="min-w-[600px]">
      <h2 className="text-lg font-semibold">Survival Analysis</h2>
      <SurvivalPlot data={data} hideLegend />
      <table className="bg-white w-full text-left text-nci-gray-darker">
        <thead>
          <tr className="bg-nci-gray-lightest">
            <th>
              <Tooltip label={tooltipLabel} wrapLines>
                <span className="underline decoration-dashed">
                  {"Cases included in Analysis"}
                </span>
              </Tooltip>
            </th>
            <th>
              # Cases S<sub>1</sub>
            </th>
            <th>%</th>
            <th>
              # Cases S<sub>2</sub>
            </th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Overall Survival Analysis</td>
            <td>{cohort1Count}</td>
            <td>{((cohort1Count / counts[0]) * 100).toFixed(0)}%</td>
            <td>{cohort2Count}</td>
            <td>{((cohort2Count / counts[1]) * 100).toFixed(0)}%</td>
          </tr>
        </tbody>
      </table>
    </Paper>
  );
};

export default SurvivalCard;
