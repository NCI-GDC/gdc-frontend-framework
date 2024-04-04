import { useState } from "react";
import { orderBy } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FilterSet, useCnvPlot } from "@gff/core";
import ChartTitleBar from "./ChartTitleBar";
import { CountSpan } from "@/components/tailwindComponents";

const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

const CHART_NAME = "cancer-distribution-bar-chart-cnv";

/**
 * Props for the CNVPlot component
 * @property gene - gene to plot
 * @property height - height of the chart
 * @property genomicFilters - genomic filters to apply
 * @property cohortFilters - cohort filters to apply
 * @category Charts
 */
interface CNVPlotProps {
  readonly gene: string;
  readonly height?: number;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}

const hovertemplate =
  "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>";

/**
 * CNV plot component
 * @param gene - gene to plot
 * @param height - height of the chart
 * @param genomicFilters - genomic filters to apply
 * @param cohortFilters - cohort filters to apply
 * @category Charts
 */
const CNVPlot: React.FC<CNVPlotProps> = ({
  gene,
  height = undefined,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: CNVPlotProps) => {
  const router = useRouter();
  const [gainChecked, setGainChecked] = useState(true);
  const [lossChecked, setLossChecked] = useState(true);

  const { data, error, isUninitialized, isFetching, isError } = useCnvPlot({
    gene,
    cohortFilters,
    genomicFilters,
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

  const caseData = data?.cases.filter(
    (d) => d.gain !== undefined || d.loss !== undefined,
  );

  if (caseData.length < 5) {
    return null;
  }

  const caseTotal = <CountSpan>{data?.caseTotal.toLocaleString()}</CountSpan>;
  const mutationTotal = (
    <CountSpan>{data.mutationTotal.toLocaleString()}</CountSpan>
  );
  const projectCount = (
    <CountSpan>{caseData.length.toLocaleString()}</CountSpan>
  );

  const title = (
    <span>
      {caseTotal} CASES AFFECTED BY {mutationTotal} CNV EVENTS ACROSS{" "}
      {projectCount} PROJECTS
    </span>
  );

  let chartData;
  if (gainChecked && lossChecked) {
    chartData = caseData.map((d) => ({
      ...d,
      percent: (((d.gain || 0) + (d.loss || 0)) / d.total) * 100,
    }));
  } else if (gainChecked) {
    chartData = caseData
      .filter((d) => d.gain !== undefined)
      .map((d) => ({ ...d, percent: (d.gain / d.total) * 100 }));
  } else if (lossChecked) {
    chartData = caseData
      .filter((d) => d.loss !== undefined)
      .map((d) => ({ ...d, percent: (d.loss / d.total) * 100 }));
  } else {
    chartData = [...caseData];
  }

  const sortedData = chartData
    .sort((a, b) => (a.percent < b.percent ? 1 : -1))
    .slice(0, 20);

  let exportedData = sortedData;

  const datasets = [];
  if (lossChecked) {
    datasets.push({
      y: sortedData.map((d) => (d.loss / d.total) * 100),
      x: sortedData.map((d) => d.project),
      hovertemplate,
      customdata: sortedData.map((d) => [d.loss, d.total]),
      marker: {
        color: "#2378c3",
      },
    });
  }

  if (gainChecked) {
    datasets.push({
      y: sortedData.map((d) => (d.gain / d.total) * 100),
      x: sortedData.map((d) => d.project),
      hovertemplate,
      customdata: sortedData.map((d) => [d.gain, d.total]),
      marker: {
        color: "#e41d3d",
      },
    });
  }

  if (!lossChecked && !gainChecked) {
    // sort by gain value desc and then loss value desc
    const emptyData = orderBy(
      chartData.map((d) => ({ gain: 0, loss: 0, ...d })),
      ["gain", "loss"],
      ["desc", "desc"],
    ).slice(0, 20);
    exportedData = emptyData;
    datasets.push({
      y: emptyData.map(() => null),
      x: emptyData.map((d) => d.project),
    });
  }

  const chartConfig = {
    yAxisTitle: "% of Cases Affected",
    datasets,
  };

  const onClickHandler = (mouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  };

  const chartDivId = `${CHART_NAME}_${Math.floor(Math.random() * 100)}`;
  return (
    <div
      data-testid="graph-cancer-distribution-cnv"
      className="border border-base-lighter p-4"
    >
      <div>
        <ChartTitleBar
          title={title}
          filename="cancer-distribution-bar-chart"
          divId={chartDivId}
          jsonData={[
            ...exportedData.map(({ project: symbol, gain, loss, total }) => {
              return {
                symbol,
                gain: gain ? (gain / total) * 100 : 0,
                loss: loss ? (loss / total) * 100 : 0,
                total,
              };
            }),
          ]}
        />
      </div>
      <div>
        <BarChart
          divId={chartDivId}
          data={chartConfig}
          onClickHandler={onClickHandler}
          height={height}
          stacked
        />
      </div>
      <div className="text-center">
        <input
          type="checkbox"
          checked={gainChecked}
          onChange={() => setGainChecked(!gainChecked)}
          className="form-checkbox text-gdc-red"
          id="cancer-dist-gain"
        />
        <label htmlFor="cancer-dist-gain" className="pl-1 pr-2 align-middle">
          Gain
        </label>
        <input
          type="checkbox"
          checked={lossChecked}
          onChange={() => setLossChecked(!lossChecked)}
          className="form-checkbox text-gdc-blue"
          id="cancer-dist-loss"
        />
        <label htmlFor="cancer-dist-loss" className="pl-1 pr-2 align-middle">
          Loss
        </label>
      </div>
    </div>
  );
};

export default CNVPlot;
