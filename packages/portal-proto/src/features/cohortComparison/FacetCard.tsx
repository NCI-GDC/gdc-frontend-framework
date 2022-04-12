import { Paper } from "@mantine/core";
import BarChart from "../charts/BarChart";
import PValue from "./PValue";

const formatAgeBuckets = (bucket) => {
  return `${bucket / 365.25} to <${(bucket / 365.25) + 10} years`; 
}

interface FacetCardProps {
  data: any;
  field: string;
  title: string;
}

const FacetCard: React.FC<FacetCardProps> = ({ data, field, title } : FacetCardProps) => {
  const totals = data?.map((cohort) =>
    cohort.buckets
      ?.map((b) => b.doc_count)
      .reduce((runningSum, a) => runningSum + a),
  );

  const barChartData = data.map((cohort, idx) => ({
    x: cohort?.buckets?.map((b) => field === 'diagnoses.age_at_diagnosis' ? formatAgeBuckets(b.key) : b.key) || [],
    y: cohort?.buckets?.map((b) => (b.doc_count / totals[idx]) * 100) || [],
  }));

  const divId = `cohort_comparison_bar_chart_${field}`;

  return (
    <Paper p="md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="h-[500px]">
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
            <th>{title}</th>
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
          {data.buckets?.map((value, idx) => (
            <tr
              className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
              key={`${field}_${value.key}`}
            >
              <td>{value.key}</td>
              <td>{value.doc_count}</td>
              <td>{((value.doc_count / total) * 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <PValue values={data} /> */}
    </Paper>
  );
};

export default FacetCard;
