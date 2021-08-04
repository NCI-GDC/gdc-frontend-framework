import Plot from 'react-plotly.js';

interface BarChartProps {
  readonly data: Record<string, any>;
}

const BarChart: React.FC<BarChartProps> = ({ data }: BarChartProps) => {

const chartData = {
    x: data.x,
    y: data.y,
    textinfo: "label+percent",
    showlegend: false,
    marker: {
      line: {
        color: '#4f4b4b',
        width: 2,
      },
    },
    type: 'bar',


  };

  const layout = {
    uniformtext: { mode: 'show', minsize: 12 },
    autosize: true,
    xaxis: {
      tickson: "labels",
      automargin: true,
      ticks:"outside",
      tickwidth:2,
      tickcolor:'#aaaaaa',
      ticklen:2,
      tickmode: 'array',
      tickvals: data.tickvals,
      ticktext: data.ticktext,
      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      }

    },
    yaxis: {
      title: data.yAxisTitle,
      titlefont: {
        family: 'Arial, sans-serif',
        size: 18,
      },

      tickfont: {
        size: 14,
        color: 'rgb(107, 107, 107)'
      },
    },
    margin: {
      l: 80,
      r: 40,
      b: 100,
      t: 0,
      pad: 4
    },
  };

  if (data.x.length > 6) {
    layout.xaxis.tickangle = 35;
  }


  const config = {responsive: true,
    toImageButtonOptions: {
      format: 'png', // one of png, svg, jpeg, webp
      filename: data.filename,
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    },
    "displaylogo": false,
    'modeBarButtonsToRemove': ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
  };
  return (<div>
    <Plot data={[chartData]} layout={layout} config={config} useResizeHandler={true}
          style={{width: "100%", height: "100%"}}/>
  </div>);

};

export default BarChart;

