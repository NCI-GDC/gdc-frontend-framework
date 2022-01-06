import { Config, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';

interface BarChartProps {
  readonly data: Record<string, any>;
  // if defined, this determines the height of the chart. Otherwise, autosizing is used.
  readonly height?: number;
  readonly marginBottom?: number;
  readonly orientation?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, height, marginBottom, orientation='v' }: BarChartProps) => {

const chartData = {
    x: orientation === "v" ? data.x : data.y,
    y: orientation  === "v" ? data.y : data.x,
    hoverinfo: "text",
    text: data.label_text,
    textposition: 'none',
    showlegend: false,
    uniformtext_mode: 'hide',
    title: null,
    marker: {
      color: 'rgb(34, 121, 145)',
      line: {
        color: '#4f4b4b',
        width: 2,
      },
    },
    type: 'bar',
    orientation: orientation,
    bargap: 0.50,
  };
const vertical_layout: Partial<Layout> = {
    uniformtext: {
      mode: 'show',
      minsize: 10
    },
    xaxis: {
      tickson: "labels",
      automargin: true,
      ticks:"outside",
      tickwidth:2,
      tickcolor:'#aaaaaa',
      ticklen:2,
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
        size: 14,
      },

      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      },
    },
    margin: {
      l: 80,
      r: 40,
      b: marginBottom !== undefined ? marginBottom : 100,
      t: 30,
      pad: 4
    },
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 500
      }
  };

  if (height !== undefined) {
    vertical_layout.height = height;
  } else {
    vertical_layout.autosize = true;
  }

  if (data.x.length > 6) {
    vertical_layout.xaxis.tickangle = 35;
  }

  const horizontal_layout: Partial<Layout> = {
    uniformtext: {
      mode: 'show',
      minsize: 10
    },
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
      l: 120,
      r: 10,
      b: marginBottom !== undefined ? marginBottom : 100,
      t: 40,
      pad: 4
    },
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
  };

  if (height !== undefined) {
    horizontal_layout.height = height;
  } else {
    horizontal_layout.autosize = true;
  }

  const config: Partial<Config> = {
    responsive: true,
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
    <Plot data={[chartData]} layout={ orientation==='v' ? vertical_layout : horizontal_layout } config={config} useResizeHandler={true}
           style={{width: "100%", height: "240px"}}/>
  </div>);

};

export default BarChart;

