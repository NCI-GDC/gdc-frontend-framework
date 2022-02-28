import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSmssPlot } from "@gff/core";
const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

interface SSMPlotProps {
  readonly page: "gene" | "ssms";
  readonly gene?: string;
  readonly ssms?: string;
}

const SSMPlot: React.FC<SSMPlotProps> = ({
  page,
  gene,
  ssms,
}: SSMPlotProps) => {
  const router = useRouter();

  const { data, error, isUninitialized, isFetching, isError } = useSmssPlot({
    gene,
  });

  if (isUninitialized) {
    return <div>Initializing chart...</div>;
  }

  if (isFetching) {
    return <div>Fetching chart...</div>;
  }

  if (isError) {
    return <div>Failed to fetch chart: {error}</div>;
  }

  const title = `${data.cases
    .map((d) => d.smssCount)
    .reduce((a, b) => a + b, 0)} CASES AFFECTED BY ${
    data.smssCount
  } MUTATIONS ACROSS ${data.cases.length} PROJECTS`;
  const sortedData = data.cases
    .map((d) => ({ ...d, percent: (d.smssCount / d.totalCount) * 100 }))
    .sort((a, b) => (a.percent < b.percent ? 1 : -1))
    .slice(0, 20);

  const chartData = {
    datasets: [
      {
        x: sortedData.map((d) => d.project),
        y: sortedData.map((d) => d.percent),
        customdata: sortedData.map((d) => [d.smssCount, d.totalCount]),
        hoverTemplate:
          "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)  <extra></extra>",
      },
    ],
    yAxisTitle: "% of Cases Affected",
  };

  const onClickHandler = (mouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  };

  return (
    <BarChart
      data={chartData}
      field={"cancer-distribution-bar-chart"}
      title={title}
      onClickHandler={onClickHandler}
    />
  );
};

export default SSMPlot;
