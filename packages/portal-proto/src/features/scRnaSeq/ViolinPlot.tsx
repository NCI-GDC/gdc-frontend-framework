import Plot from "react-plotly.js";
import { ViolinPlotProps } from "./ViolinPlotProps";

const ViolinPlot: React.VFC<ViolinPlotProps> = (props: ViolinPlotProps) => {
  const data = [
    {
      type: "violin",
      y: props.y,
      points: "none",
      box: {
        visible: true,
      },
      // boxpoints: false,
      line: {
        color: "blue",
      },
      // fillcolor: '#8dd3c7',
      opacity: 0.6,
      meanline: {
        visible: true,
      },
      x0: props.label,
    },
  ];

  const layout = {};

  return (
    <>
      <Plot
        data={data}
        layout={layout}
        className="w-full h-full"
        useResizeHandler={true}
      />
    </>
  );
};

export default ViolinPlot;
