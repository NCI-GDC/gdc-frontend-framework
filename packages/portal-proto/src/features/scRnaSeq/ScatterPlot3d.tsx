import Plot from "react-plotly.js";
import { ScatterPlot3dProps } from "./ScatterPlot3dProps";

const ScatterPlot3d: React.VFC<ScatterPlot3dProps> = (
  props: ScatterPlot3dProps,
) => {
  const data = props.data.map((trace) => {
    return {
      x: trace.x,
      y: trace.y,
      z: trace.z,
      type: "scatter3d",
      mode: "markers",
      marker: {
        colorscale: [
          [0, "#cfe8ff"],
          [1, "#005ea2"],
        ],
        color: trace.color,
        size: 2,
        opacity: 0.8,
        // line: {
        //   color: 'rgb(204, 204, 204)',
        //   width: 0.5
        // }
      },
    };
  });

  return (
    <div>
      <Plot data={data} className="w-full h-full" />
    </div>
  );
};

export default ScatterPlot3d;
