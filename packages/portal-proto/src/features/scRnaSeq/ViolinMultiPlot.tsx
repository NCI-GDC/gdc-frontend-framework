import Plot from "react-plotly.js";
import { ViolinMultiPlotProps } from "./ViolinMultiPlotProps";

const ViolinPlot: React.VFC<ViolinMultiPlotProps> = (
  props: ViolinMultiPlotProps,
) => {
  const data = [
    {
      type: "violin",
      x: props.x,
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
      transforms: [
        {
          type: "groupby",
          groups: props.x,
          styles: Object.entries(props.colors).map(([xVal, color]) => {
            return {
              target: xVal,
              value: {
                line: { color },
              },
            };
          }),
        },
      ],
    },
  ];

  const layout = {
    autosize: false,
    width: 1200,
    height: 600,
  };

  return (
    <div>
      <Plot data={data} layout={layout} className="w-full h-full" />
    </div>
  );
};

export default ViolinPlot;
