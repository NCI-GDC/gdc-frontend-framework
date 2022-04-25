import { useEffect } from "react";
import { Paper, Tooltip } from "@mantine/core";
import {
  useSurvivalPlot,
  useCoreSelector,
  selectAvailableCohortByName,
  buildCohortGqlOperator,
  GqlOperation,
} from "@gff/core";
import SurvivalPlot from "../charts/SurvivalPlot";

const tooltipLabel = (
  <>
    <p>
      Criteria for including a case from your cohorts in the survival analysis:
    </p>
    <p>- the case is in only one of your cohorts, not both</p>
    <p>- the case has the required data for the analysis</p>
  </>
);

const makeSurvivalFilters = ({
  cohort1Filters,
  cohort2Filters,
  caseIds,
}: {
  cohort1Filters: GqlOperation;
  cohort2Filters: GqlOperation;
  caseIds: string[][];
}): GqlOperation[] => {
  // Data should be in only one of the cohorts, not both so exclude cases ids from the other set
  const cohort1Content = [];
  if (cohort1Filters) {
    cohort1Content.push(cohort1Filters);
  }
  if (caseIds[1]) {
    cohort1Content.push({
      op: "exclude",
      content: { field: "cases.case_id", value: caseIds[1] },
    });
  }

  const cohort2Content = [];
  if (cohort2Filters) {
    cohort2Content.push(cohort2Filters);
  }
  if (caseIds[0]) {
    cohort2Content.push({
      op: "exclude",
      content: { field: "cases.case_id", value: caseIds[0] },
    });
  }

  return [
    {
      op: "and",
      content: cohort1Content,
    },
    {
      op: "and",
      content: cohort2Content,
    },
  ];
};

interface SurvivalCardProps {
  readonly counts: number[];
  readonly cohortNames: string[];
  readonly setSurvivalPlotSelectable: (selectable: boolean) => void;
  readonly caseIds: string[][];
}

const SurvivalCard: React.FC<SurvivalCardProps> = ({
  counts,
  cohortNames,
  setSurvivalPlotSelectable,
  caseIds,
}: SurvivalCardProps) => {
  const cohort1Filters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      selectAvailableCohortByName(state, cohortNames[0]).filters,
    ),
  );

  const cohort2Filters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      selectAvailableCohortByName(state, cohortNames[1]).filters,
    ),
  );

  const filters = makeSurvivalFilters({
    cohort1Filters,
    cohort2Filters,
    caseIds,
  });
  const { data } = useSurvivalPlot({ filters });

  useEffect(() => {
    setSurvivalPlotSelectable(data?.survivalData.length !== 0);
  }, [data, setSurvivalPlotSelectable]);

  const cohort1Count = data?.survivalData[0]
    ? data.survivalData[0].donors?.length
    : 0;
  const cohort2Count = data?.survivalData[1]
    ? data.survivalData[1].donors?.length
    : 0;

  return (
    <Paper p="md" className="min-w-[600px]">
      <h2 className="text-lg font-semibold">Survival Analysis</h2>
      {data?.survivalData.length === 0 ? (
        <div className="p-1">
          {"No Survival data available for this Cohort Comparison"}
        </div>
      ) : (
        <>
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
        </>
      )}
    </Paper>
  );
};

export default SurvivalCard;
