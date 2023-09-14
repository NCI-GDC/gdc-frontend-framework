import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FilterSet, useSsmPlot } from "@gff/core";
import ChartTitleBar from "./ChartTitleBar";
import { processFilters } from "src/utils";
import { CountSpan } from "@/components/tailwindComponents";

const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

const CHART_NAME = "cancer-distribution-bar-chart-ssm";

interface SSMPlotProps {
  readonly page: "gene" | "ssms";
  readonly gene?: string;
  readonly ssms?: string;
  readonly height?: number;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}

const SSMPlot: React.FC<SSMPlotProps> = ({
  page,
  gene,
  ssms,
  height = undefined,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: SSMPlotProps) => {
  const contextFilters = processFilters(genomicFilters, cohortFilters);

  const router = useRouter();

  const { data, error, isUninitialized, isFetching, isError } = useSsmPlot({
    gene,
    ssms,
    contextFilters,
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

  if (data.cases.length < 5) {
    return null;
  }

  const sortedData = data.cases
    .map((d) => ({ ...d, percent: (d.ssmCount / d.totalCount) * 100 }))
    .sort((a, b) => (a.percent < b.percent ? 1 : -1))
    .slice(0, 20);

  const caseCount = (
    <CountSpan>
      {data.cases
        .map((d) => d.ssmCount)
        .reduce((a, b) => a + b, 0)
        .toLocaleString()}
    </CountSpan>
  );

  const ssmCount = <CountSpan>{data.ssmCount.toLocaleString()}</CountSpan>;
  const projectCount = (
    <CountSpan>{data.cases.length.toLocaleString()}</CountSpan>
  );

  const title =
    page === "gene" ? (
      <span>
        {caseCount} CASES AFFECTED BY {ssmCount} MUTATIONS ACROSS {projectCount}{" "}
        PROJECTS
      </span>
    ) : (
      <span>
        THIS MUTATION AFFECTS {caseCount} CASES ACROSS {projectCount} PROJECTS
      </span>
    );

  const chartData = {
    datasets: [
      {
        x: sortedData.map((d) => d.project),
        y: sortedData.map((d) => d.percent),
        customdata: sortedData.map((d) => [d.ssmCount, d.totalCount]),
        hovertemplate:
          "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)  <extra></extra>",
      },
    ],
    yAxisTitle: "% of Cases Affected",
  };

  const chartDivId = `${CHART_NAME}_${Math.floor(Math.random() * 100)}`;

  const onClickHandler = (mouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  };

  return (
    <div className="border border-base-lighter p-4">
      <div>
        <ChartTitleBar
          title={title}
          filename="cancer-distribution-bar-chart"
          divId={chartDivId}
          jsonData={[
            ...sortedData.map(({ project: label, percent: value }) => {
              return {
                label,
                value,
              };
            }),
          ]}
        />
      </div>
      <div className="">
        <BarChart
          divId={chartDivId}
          data={chartData}
          onClickHandler={onClickHandler}
          height={height}
        />
      </div>
    </div>
  );
};

export default SSMPlot;
