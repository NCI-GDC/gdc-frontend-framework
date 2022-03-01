import { useState } from "react";
import { orderBy } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCnvPlot } from "@gff/core";
const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

interface CNVPlotProps {
  readonly gene: string;
}

const hovertemplate =
  "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>";

const CNVPlot: React.FC<CNVPlotProps> = ({ gene }: CNVPlotProps) => {
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

  if (data.cases.length <= 5) {
    return null;
  }

  const title = `${data.caseTotal} CASES AFFECTED BY ${data.mutationTotal} MUTATIONS ACROSS ${data.cases.length} PROJECTS`;

  let filteredData = [];

  if (gainChecked && lossChecked) {
    filteredData = data.cases.map((d) => ({
      ...d,
      percent: (((d.gain || 0) + (d.loss || 0)) / d.total) * 100,
    }));
  } else if (gainChecked) {
    filteredData = data.cases
      .filter((d) => d.gain !== undefined)
      .map((d) => ({ ...d, percent: (d.gain / d.total) * 100 }));
  } else if (lossChecked) {
    filteredData = data.cases
      .filter((d) => d.loss !== undefined)
      .map((d) => ({ ...d, percent: (d.loss / d.total) * 100 }));
  } else {
    filteredData = [...data.cases];
  }

  const sortedData = filteredData
    .sort((a, b) => (a.percent < b.percent ? 1 : -1))
    .slice(0, 20);

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
    const emptyData = orderBy(
      filteredData.map((d) => ({ gain: 0, loss: 0, ...d })),
      ["gain", "loss"],
      ["desc", "desc"],
    ).slice(0, 20);
    datasets.push({
      y: emptyData.map(() => null),
      x: emptyData.map((d) => d.project),
    });
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
        filename={"cancer-distribution-bar-chart"}
        title={title}
        onClickHandler={onClickHandler}
        stacked
      />
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
    </>
  );
};

export default CNVPlot;
