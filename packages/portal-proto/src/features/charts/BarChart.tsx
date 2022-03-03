
import { Config, Layout } from 'plotly.js';
import Plot from 'react-plotly.js';

interface BarChartProps {
  readonly data: Record<string, any>;
  // if defined, this determines the height of the chart. Otherwise, autosizing is used.
  readonly height?: number;
  readonly width?: number,
  readonly marginBottom?: number;
  readonly marginTop?: number;
  readonly padding?: number;
  readonly orientation?: string;
  readonly divId?: string;
  readonly title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data,
                                             marginBottom,
                                             marginTop = 30,
                                             padding = 4,
                                             orientation='v',
                                             height = undefined,
                                             width = undefined,
                                             divId,
                                             title }: BarChartProps) => {

const chartData = {
    x: orientation === "v" ? data.x : data.y,
    y: orientation  === "v" ? data.y : data.x,
    hoverinfo: "text",
    text: data.label_text,
    textposition: 'none',
    showlegend: false,
    uniformtext_mode: 'hide',
    title: title,
    marker: {
      color: 'rgb(145,145,145)',
      line: {
        color: '#bebebe',
        width: 1,
      },
    },
    type: 'bar',
    orientation: orientation,
    bargap: 0.50,
  };


const layout: Partial<Layout> =  orientation==='v' ? {
    xaxis: { // (bars are vertical)
      automargin: false,
      ticks:"outside",
      tickwidth:2,
      tickcolor:'#aaaaaa',
      ticklen:2,
      tickvals: data.tickvals,
      ticktext: data.ticktext,
      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      },
      tickangle: data.x.length > 6 ? 35 : undefined
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
      t: marginTop,
      pad: padding
    },
    autosize: true,
  } : {  // (bars are horizontal)
    yaxis: {
      automargin: false,
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
      t: marginTop,
      pad: padding
    },
    autosize: true,
  };

  const config: Partial<Config> = {
    "displaylogo": false,
    'modeBarButtonsToRemove': ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toImage']
  };
  return (
    <Plot divId={divId}
          data={chartData ? [chartData] : []}
          layout={layout}
          config={config}
          useResizeHandler={true}
          className="w-full h-full"/>
);

};

export default BarChart;

