import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCnvPlot } from "@gff/core";
const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

interface CNVPlotProps {
  readonly page: "gene" | "ssms";
  readonly gene?: string;
  readonly ssms?: string;
}

const hovertemplate =
  "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>";
const sortByPercent = (a, b) => (a.percent < b.percent ? 1 : -1);

const CNVPlot: React.FC<CNVPlotProps> = ({
  page,
  gene,
  ssms,
}: CNVPlotProps) => {
  const router = useRouter();
  const [gainChecked, setGainChecked] = useState(true);
  const [lossChecked, setLossChecked] = useState(true);

  const { data, error, isUninitialized, isFetching, isError } = useCnvPlot({
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

  const title =
    page === "gene"
      ? `${data.caseTotal} CASES AFFECTED BY ${data.mutationTotal} MUTATIONS ACROSS ${data.cases.length} PROJECTS`
      : `THIS MUTATION AFFECTS ${data.caseTotal} ACROSS ${data.length} PROJECTS`;

  let datasets = [
    {
      x: data.cases.map((d) => d.project),
    },
  ] as any;

  if (gainChecked && lossChecked) {
    const filteredData = data.cases.map((d) => ({
      ...d,
      percent: (((d.gain || 0) + (d.loss || 0)) / d.total) * 100,
    }));
    const sortedData = filteredData.sort(sortByPercent).slice(0, 20);
    datasets = [
      {
        y: filteredData.map((d) => (d.loss / d.total) * 100),
        x: sortedData.map((d) => d.project),
        hovertemplate,
        customdata: sortedData.map((d) => [d.loss, d.total]),
        marker: {
          color: '#2378c3',
        },
      },
      {
        y: sortedData.map((d) => (d.gain / d.total) * 100),
        x: sortedData.map((d) => d.project),
        hovertemplate,
        customdata: sortedData.map((d) => [d.gain, d.total]),
        marker: {
          color: '#e41d3d'
        },
      },
    ];
  } else if (gainChecked) {
    const filteredData = data.cases
      .filter((d) => d.gain !== undefined)
      .map((d) => ({ ...d, percent: ((d.gain || 0) / d.total) * 100 }));
    const sortedData = filteredData.sort(sortByPercent).slice(0, 20);
    datasets = [
      {
        y: sortedData.map((d) => (d.gain / d.total) * 100),
        x: sortedData.map((d) => d.project),
        hovertemplate,
        customdata: sortedData.map((d) => [d.gain, d.total]),
        marker: {
          color: '#e41d3d',
        },
      },
    ];
  } else if (lossChecked) {
    const filteredData = data.cases
      .filter((d) => d.loss !== undefined)
      .map((d) => ({ ...d, percent: ((d.loss || 0) / d.total) * 100 }));
    const sortedData = filteredData.sort(sortByPercent).slice(0, 20);
    datasets = [
      {
        y: filteredData.map((d) => (d.loss / d.total) * 100),
        x: sortedData.map((d) => d.project),
        hovertemplate,
        customdata: sortedData.map((d) => [d.loss, d.total]),
        marker: {
          color: '#2378c3'
        },
      },
    ];
  }

  const chartData = {
    yAxisTitle: "% of Cases Affected",
    datasets,
  };

  const onClickHandler = (mouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  };

  return (
    <>
      <BarChart
        data={chartData}
        field={"cancer-distribution-bar-chart"}
        title={title}
        onClickHandler={onClickHandler}
        stacked
      />
      <input
        type="checkbox"
        checked={gainChecked}
        onChange={() => setGainChecked(!gainChecked)}
        className="form-checkbox text-gdc-red"
      />
      <label>Gain</label>
      <input
        type="checkbox"
        checked={lossChecked}
        onChange={() => setLossChecked(!lossChecked)}
        className="form-checkbox text-gdc-blue"
      />
      <label>Loss</label>
    </>
  );
};

export default CNVPlot;
