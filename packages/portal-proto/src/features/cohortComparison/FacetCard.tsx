import { Paper } from "@mantine/core";
import BarChart from "../charts/BarChart";
import PValue from "./PValue";
import { DAYS_IN_YEAR } from "src/constants";
import { FIELD_LABELS } from "src/fields";

const formatAgeBuckets = (bucket) => {
  const age = bucket / DAYS_IN_YEAR;
  return age === 80 ? "80+ years" : `${age} to <${age + 10} years`;
};

interface FacetCardProps {
  data: any;
  field: string;
  counts: number[];
  cohortNames: string[];
}

const FacetCard: React.FC<FacetCardProps> = ({
  data,
  field,
  counts,
  cohortNames,
}: FacetCardProps) => {
  // TODO comment here
  const formattedData = data.map((cohort, idx) => {
    const formattedCohort = cohort.buckets
      .filter((facet) => facet.key !== "_missing")
      .map((facet) => ({
        count: facet.doc_count,
        key:
          field === "diagnoses.age_at_diagnosis"
            ? formatAgeBuckets(facet.key)
            : facet.key,
      }));
    const totalInResults = formattedCohort.reduce(
      (runningSum, a) => runningSum + a.count,
      0,
    );
    const missingValue = counts[idx] - totalInResults;
    return [...formattedCohort, { count: missingValue, key: "missing" }];
  });

  const barChartData = formattedData.map((cohort, idx) => ({
    x: cohort.map((facet) => facet.key),
    y: cohort.map((facet) => (facet.count / counts[idx]) * 100),
    customdata: cohort.map((facet) => facet.count),
    hovertemplate: `<b>${cohortNames[idx]}</b><br /> %{y:.0f}% Cases (%{customdata})<extra></extra>`,
    marker: {
      color: idx === 0 ? "#8c690d" : "#2a72a5",
    }
  }));

  const divId = `cohort_comparison_bar_chart_${field}`;

  const uniqueValues = Array.from(
    new Set(formattedData.map((cohort) => cohort.map((b) => b.key)).flat()),
  );

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
      <table className="bg-white w-full text-left text-nci-gray-darker">
        <thead>
          <tr className="bg-nci-gray-lightest">
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
            const cohort1Value = formattedData[0].find(
              (facet) => facet.key === value,
            )?.count;
            const cohort2Value = formattedData[1].find(
              (facet) => facet.key === value,
            )?.count;
            return (
              <tr
                className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
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
