import { useMemo } from "react";
import { Paper } from "@mantine/core";
import saveAs from "file-saver";
import {
  CohortFacetDoc,
  DAYS_IN_YEAR,
  FilterSet,
  joinFilters,
} from "@gff/core";
import { calculatePercentageAsNumber, humanify } from "src/utils";
import BarChart from "../charts/BarChart";
import FunctionButton from "@/components/FunctionButton";
import PValue from "./PValue";
import { CohortCreationButtonWrapper } from "@/components/CohortCreationButton/";
import { CohortComparisonType } from "./CohortComparison";
interface FacetCardProps {
  readonly data: { buckets: CohortFacetDoc[] }[];
  readonly field: string;
  readonly counts: number[];
  readonly cohorts: CohortComparisonType;
}

export const FacetCard: React.FC<FacetCardProps> = ({
  data,
  field,
  counts,
  cohorts,
}: FacetCardProps) => {
  const divId = `cohort_comparison_bar_chart_${field}`;
  const fieldLabel = humanify({ term: field });

  const formatBucket = (bucket: number | string, field: string): string => {
    if (field === "diagnoses.age_at_diagnosis") {
      const age = (bucket as number) / DAYS_IN_YEAR;
      return age === 80 ? "80+ years" : `${age} to <${age + 10} years`;
    }

    return bucket as string;
  };

  const createFilters = (field: string, bucket: string): FilterSet => {
    if (field == "diagnoses.age_at_diagnosis") {
      if (Number(bucket) === 80 * DAYS_IN_YEAR) {
        return {
          mode: "and",
          root: {
            [field]: {
              field,
              operator: ">=",
              operand: Number(bucket),
            },
          },
        };
      }

      return {
        mode: "and",
        root: {
          [field]: {
            operator: "and",
            operands: [
              {
                field,
                operator: ">=",
                operand: Number(bucket),
              },
              {
                field,
                operator: "<=",
                operand: Number(bucket) + DAYS_IN_YEAR * 10 - 0.1,
              },
            ],
          },
        },
      };
    }

    return {
      mode: "and",
      root: {
        [`cases.${field}`]: {
          field: `cases.${field}`,
          operands: [bucket],
          operator: "includes",
        },
      },
    };
  };

  let formattedData = useMemo(
    () =>
      data.map((cohort, idx) => {
        const formattedCohort = cohort.buckets
          .filter((facet) => facet.key !== "_missing")
          .map((facet) => {
            return {
              key: formatBucket(facet.key, field),
              count: facet.doc_count,
              filter: createFilters(field, facet.key),
            };
          });
        // Replace '_missing' key because 1) we don't get the value back for histograms 2) to rename the key
        const totalInResults = formattedCohort.reduce(
          (runningSum, a) => runningSum + a.count,
          0,
        );
        const missingValue = counts[idx] - totalInResults;
        if (missingValue === 0) {
          return formattedCohort;
        }
        return [
          ...formattedCohort,
          {
            count: missingValue,
            key: "missing",
            filter: {
              mode: "and",
              root: {
                [field]: {
                  field,
                  operator: "missing",
                },
              },
            } as FilterSet,
          },
        ];
      }),
    [data, counts, field],
  );

  const uniqueValues = Array.from(
    new Set(formattedData.map((cohort) => cohort.map((b) => b.key)).flat()),
  );

  if (field === "diagnoses.age_at_diagnosis") {
    uniqueValues.sort();
  }

  formattedData = formattedData.map((cohort) =>
    uniqueValues.map((value) => {
      const dataPoint = cohort.find((d) => d.key === value);
      if (dataPoint) {
        return dataPoint;
      }
      return { key: value, count: undefined, filter: undefined };
    }),
  );

  const barChartData = formattedData.map((cohort, idx) => ({
    x: cohort.map((facet) => facet.key),
    y: cohort.map((facet) => (facet.count / counts[idx]) * 100),
    customdata: cohort.map((facet) => facet.count),
    hovertemplate: `<b>${
      cohorts[idx === 0 ? "primary_cohort" : "comparison_cohort"]?.name
    }</b><br /> %{y:.0f}% Cases (%{customdata:,})<extra></extra>`,
    marker: {
      color: idx === 0 ? "#1F77B4" : "#BD5800",
    },
  }));

  const downloadTSVFile = () => {
    const header = [
      `${fieldLabel}`,
      "# Cases S1",
      "% Cases S1",
      "# Cases S2",
      "% Cases S2",
    ];

    const body = uniqueValues.map((key, index) =>
      [
        key,
        ...formattedData
          .map((sub, idx) => [
            sub[index].count ?? 0,
            calculatePercentageAsNumber(sub[index].count, counts[idx]),
          ])
          .flat(),
      ].join("\t"),
    );

    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${fieldLabel}-comparison.tsv`,
    );
  };
  return (
    <Paper p="md" shadow="xs">
      <h2 className="font-heading text-lg font-semibold">{fieldLabel}</h2>
      <div className="h-[400px]">
        <BarChart
          data={{
            yAxisTitle: "% Cases",
            datasets: barChartData,
          }}
          divId={divId}
        />
      </div>
      <div className="mb-3 float-right">
        <FunctionButton
          onClick={downloadTSVFile}
          aria-label="Download TSV File"
        >
          TSV
        </FunctionButton>
      </div>
      <table className="bg-base-max w-full text-left text-base-contrast-max border-base-light border-1">
        <thead>
          <tr className="bg-base-max border-b-base-light border-b-2 font-heading text-bold">
            <th className="pl-2">{fieldLabel}</th>
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
        <tbody className="font-content text-sm text-semibold">
          {uniqueValues.map((value, idx) => {
            const cohort1Value = formattedData[0][idx].count;
            const cohort2Value = formattedData[1][idx].count;
            return (
              <tr
                className={idx % 2 ? null : "bg-base-lightest"}
                key={`${field}_${value}`}
              >
                <td className="pl-2">{value}</td>
                <td>
                  <CohortCreationButtonWrapper
                    numCases={cohort1Value}
                    label={cohort1Value?.toLocaleString() || "--"}
                    caseFilters={
                      cohort1Value === undefined
                        ? undefined
                        : joinFilters(
                            cohorts.primary_cohort.filter,
                            formattedData[0][idx].filter,
                          )
                    }
                  />
                </td>
                <td>
                  {(((cohort1Value || 0) / counts[0]) * 100).toFixed(2)} %
                </td>
                <td>
                  <CohortCreationButtonWrapper
                    numCases={cohort2Value}
                    label={cohort2Value?.toLocaleString() || "--"}
                    caseFilters={
                      cohort2Value === undefined
                        ? undefined
                        : joinFilters(
                            cohorts.comparison_cohort.filter,
                            formattedData[1][idx].filter,
                          )
                    }
                  />
                </td>
                <td>
                  {(((cohort2Value || 0) / counts[1]) * 100).toFixed(2)} %
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="float-right p-1 cursor-default">
        <PValue data={formattedData} />
      </div>
    </Paper>
  );
};

export default FacetCard;
