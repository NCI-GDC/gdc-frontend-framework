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
        cmin: 0,
        cmax: 5,
        colorscale: [
          [0, "#cfe8ff"],
          [1, "#005ea2"],
        ],
        color: trace.color,
        size: 3,
      },
    };
  });

  const layout = {
    autosize: false,
    width: 600,
    height: 600,
  };

  return (
    <div>
      <Plot data={data} layout={layout} className="w-full h-full" />
    </div>
  );
};

export default ScatterPlot2d;
