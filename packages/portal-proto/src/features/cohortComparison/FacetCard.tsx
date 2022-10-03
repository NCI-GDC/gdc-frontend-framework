import { useMemo } from "react";
import { Paper } from "@mantine/core";
import { CohortFacetDoc, DAYS_IN_YEAR } from "@gff/core";
import { FIELD_LABELS } from "src/fields";
import BarChart from "../charts/BarChart";
import PValue from "./PValue";
import { Button } from "@mantine/core";
import saveAs from "file-saver";

const formatBucket = (bucket: number | string, field: string): string => {
  if (field === "diagnoses.age_at_diagnosis") {
    const age = (bucket as number) / DAYS_IN_YEAR;
    return age === 80 ? "80+ years" : `${age} to <${age + 10} years`;
  }

  return bucket as string;
};
interface FacetCardProps {
  readonly data: { buckets: CohortFacetDoc[] }[];
  readonly field: string;
  readonly counts: number[];
  readonly cohortNames: string[];
}

const FacetCard: React.FC<FacetCardProps> = ({
  data,
  field,
  counts,
  cohortNames,
}: FacetCardProps) => {
  let formattedData = useMemo(
    () =>
      data.map((cohort, idx) => {
        const formattedCohort = cohort.buckets
          .filter((facet) => facet.key !== "_missing")
          .map((facet) => {
            return {
              key: formatBucket(facet.key, field),
              count: facet.doc_count,
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
        return [...formattedCohort, { count: missingValue, key: "missing" }];
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
      return { key: value, count: undefined };
    }),
  );

  const barChartData = formattedData.map((cohort, idx) => ({
    x: cohort.map((facet) => facet.key),
    y: cohort.map((facet) => (facet.count / counts[idx]) * 100),
    customdata: cohort.map((facet) => facet.count),
    hovertemplate: `<b>${cohortNames[idx]}</b><br /> %{y:.0f}% Cases (%{customdata:,})<extra></extra>`,
    marker: {
      color: idx === 0 ? "#1F77B4" : "#BD5800",
    },
  }));

  const divId = `cohort_comparison_bar_chart_${field}`;

  const downloadTSVFile = () => {
    let strOut = `${FIELD_LABELS[field]}\t# Cases S1\t% Cases S1\t# Cases S2\t% Cases S2\n`;
    strOut += "";

    uniqueValues.forEach((value, idx) => {
      const cohort1Value = formattedData[0][idx].count;
      const cohort2Value = formattedData[1][idx].count;
      strOut += `${value}\t${cohort1Value?.toString() || "0"}\t${(
        ((cohort1Value || 0) / counts[0]) *
        100
      ).toFixed(2)}\t${cohort2Value?.toString() || "0"}\t${(
        ((cohort2Value || 0) / counts[1]) *
        100
      ).toFixed(2)}\n`;
    });

    saveAs(
      new Blob([strOut], {
        type: "text/plain;charset=us-ascii",
      }),
      `${FIELD_LABELS[field]}-comparison.tsv`,
    );

    return false;
  };

  return (
    <Paper p="md">
      <h2 className="text-lg font-semibold">{FIELD_LABELS[field]}</h2>
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
        <Button
          variant="default"
          onClick={downloadTSVFile}
          aria-label="Download TSV File"
          className="bg-base-lightest text-base-contrast-lightest"
        >
          TSV
        </Button>
      </div>
      <table className="bg-base-lightest w-full text-left text-primary-content-darker">
        <thead>
          <tr className="bg-base-lightest">
            <th>{FIELD_LABELS[field]}</th>
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
          {uniqueValues.map((value, idx) => {
            const cohort1Value = formattedData[0][idx].count;
            const cohort2Value = formattedData[1][idx].count;
            return (
              <tr
                className={idx % 2 ? null : "bg-accent-warm-lightest"}
                key={`${field}_${value}`}
              >
                <td>{value}</td>
                <td>{cohort1Value?.toLocaleString() || "--"}</td>
                <td>
                  {(((cohort1Value || 0) / counts[0]) * 100).toFixed(2)} %
                </td>
                <td>{cohort2Value?.toLocaleString() || "--"}</td>
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
