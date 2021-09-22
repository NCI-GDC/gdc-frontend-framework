import { Config, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';

interface BarChartProps {
  readonly data: Record<string, any>;
  // if defined, this determines the height of the chart. Otherwise, autosizing is used.
  readonly height?: number;
  readonly marginBottom?: number;
  readonly orientation?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, height, marginBottom, orientation='h' }: BarChartProps) => {

const chartData = {
    y: data.x,
    x: data.y,
    textinfo: "label+percent",
    showlegend: false,
    uniformtext_mode: 'hide',
    title: null,
    marker: {
      line: {
        color: '#4f4b4b',
        width: 2,
      },
    },
    type: 'bar',
    orientation: orientation,
  textposition: "outside",
  automargin: true,
  insidetextorientation: 'horizontal'

  };

  const layout: Partial<Layout> = {
    yaxis: {
      automargin: true,
      ticks:"outside",
      tickwidth:2,
      tickcolor:'#aaaaaa',
      ticklen:2,
      tickvals: data.tickvals,
      ticktext: data.ticktext,
      autorange:"reversed",
      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      }

    },
    xaxis: {
      title: data.yAxisTitle,
      titlefont: {
        family: 'Arial, sans-serif',
        size: 14,
      },

      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      },
    },
    margin: {
      l: 100,
      r: 20,
      b: marginBottom !== undefined ? marginBottom : 100,
      t: 30,
      pad: 4
    },
  };

 // if (height !== undefined) {
 //   layout.height = height;
//  } else {
    layout.autosize = true;
//  }

 // if (data.x.length > 6) {
  //  layout.yaxis.tickangle = 35;
  //}


  const config: Partial<Config> = {responsive: true,
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
           style={{width: "100%", height: "240px"}}/>
  </div>);

};

export default BarChart;

