import { useEffect } from "react";
import { Alert, Loader, Paper, Tooltip } from "@mantine/core";
import {
  buildCohortGqlOperator,
  useGetSurvivalPlotQuery,
  FilterSet,
  GqlOperation,
  useCreateCaseSetFromFiltersMutation,
  GqlIntersection,
} from "@gff/core";
import SurvivalPlot from "../charts/SurvivalPlot";
import makeIntersectionFilters from "./makeIntersectionFilters";
import CohortCreationButton from "@/components/CohortCreationButton";

const survivalDataCompletenessFilters: readonly GqlOperation[] = [
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

export const makeSurvivalCaseFilters = (
  primaryCohortSetId: string,
  comparisonCohortSetId: string,
): GqlIntersection => ({
  op: "and",
  content: [
    ...survivalDataCompletenessFilters,
    {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [`set_id:${primaryCohortSetId}`],
          },
        },
        {
          op: "excludeifany",
          content: {
            field: "cases.case_id",
            value: `set_id:${comparisonCohortSetId}`,
          },
        },
      ],
    },
  ],
});

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
  readonly cohorts?: {
    primary_cohort: {
      filter: FilterSet;
      name: string;
    };
    comparison_cohort: {
      filter: FilterSet;
      name: string;
    };
  };
  readonly setSurvivalPlotSelectable: (selectable: boolean) => void;
  readonly caseSetIds: string[];
}

const SurvivalCard: React.FC<SurvivalCardProps> = ({
  counts,
  cohorts,
  setSurvivalPlotSelectable,
  caseSetIds,
}: SurvivalCardProps) => {
  const filters = makeIntersectionFilters(
    buildCohortGqlOperator(cohorts?.primary_cohort.filter),
    buildCohortGqlOperator(cohorts?.comparison_cohort.filter),
    caseSetIds,
  );
  const [createPrimarySurvivalCaseSet, survivalPrimaryCaseSetResponse] =
    useCreateCaseSetFromFiltersMutation();
  const [createComparisonSurvivalCaseSet, survivalComparisonCaseSetResponse] =
    useCreateCaseSetFromFiltersMutation();
  const { data, isUninitialized, isFetching, isError } =
    useGetSurvivalPlotQuery({
      filters: [filters.cohort1, filters.cohort2],
    });

  useEffect(() => {
    createPrimarySurvivalCaseSet({
      filters: makeSurvivalCaseFilters(caseSetIds[0], caseSetIds[1]),
    });

    createComparisonSurvivalCaseSet({
      filters: makeSurvivalCaseFilters(caseSetIds[0], caseSetIds[1]),
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <h2 className="font-heading text-lg font-semibold">Survival Analysis</h2>
      {data?.survivalData.length === 0 ? (
        <div className="p-1">
          {"No Survival data available for this Cohort Comparison"}
        </div>
      ) : (
        <>
          {isError ? (
            <Alert>{"Something's gone wrong"}</Alert>
          ) : isFetching || isUninitialized ? (
            <Loader />
          ) : (
            <SurvivalPlot data={data} hideLegend />
          )}
          <div className="font-heading mt-[1.5rem]">
            <table className="bg-base-max w-full text-left text-base-contrast-max border-base-light border-1">
              <thead>
                <tr className="bg-base-lightest border-b-base-light border-b-2">
                  <th>
                    <Tooltip label={tooltipLabel}>
                      <span className="underline decoration-dashed pl-2">
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
              <tbody className="font-content text-md">
                <tr>
                  <td className="pl-2">Overall Survival Analysis</td>
                  <td>
                    <CohortCreationButton
                      numCases={
                        survivalPrimaryCaseSetResponse.isSuccess
                          ? cohort1Count
                          : undefined
                      }
                      label={cohort1Count.toLocaleString()}
                      caseFilters={{
                        mode: "and",
                        root: {
                          "cases.case_id": {
                            field: "cases.case_id",
                            operands: [
                              `set_id:${survivalPrimaryCaseSetResponse.data}`,
                            ],
                            operator: "includes",
                          },
                        },
                      }}
                    />
                  </td>
                  <td>{((cohort1Count / counts[0]) * 100).toFixed(0)}%</td>
                  <td>
                    <CohortCreationButton
                      numCases={
                        survivalComparisonCaseSetResponse.isSuccess
                          ? cohort2Count
                          : undefined
                      }
                      label={cohort2Count.toLocaleString()}
                      caseFilters={{
                        mode: "and",
                        root: {
                          "cases.case_id": {
                            field: "cases.case_id",
                            operands: [
                              `set_id:${survivalComparisonCaseSetResponse.data}`,
                            ],
                            operator: "includes",
                          },
                        },
                      }}
                    />
                  </td>
                  <td>{((cohort2Count / counts[1]) * 100).toFixed(0)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </Paper>
  );
};

export default SurvivalCard;
