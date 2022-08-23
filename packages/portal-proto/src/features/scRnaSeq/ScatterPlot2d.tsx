import Plot from "react-plotly.js";
import { ScatterPlot2dProps } from "./ScatterPlot2dProps";

const ScatterPlot2d: React.VFC<ScatterPlot2dProps> = (
  props: ScatterPlot2dProps,
) => {
  const data = props.data.map((trace) => {
    return {
      x: trace.x,
      y: trace.y,
      type: "scatter",
      mode: "markers",
      marker: {
        color: trace.color,
        size: 3,
      },
    };
  });

  return (
    <div>
      <Plot data={data} />
    </div>
  );
};

export default ScatterPlot2d;
