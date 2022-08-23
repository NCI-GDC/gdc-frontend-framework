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
        cmin: 0,
        cmax: 5,
        colorscale: [
          [0, "#cfe8ff"],
          [1, "#005ea2"],
        ],
        color: trace.color,
        size: 2,
        opacity: 0.8,
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

export default ScatterPlot3d;
