import { Config, Layout, PlotMouseEvent, PlotData } from 'plotly.js';
import Plot from 'react-plotly.js';
import dynamic from 'next/dynamic'
const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

interface BarChartData {
  datasets: Record<string, any>[],
  yAxisTitle?: string;
  tickvals?: any;
  ticktext?: any;
}

interface BarChartProps {
  readonly data: BarChartData;
  // if defined, this determines the height of the chart. Otherwise, autosizing is used.
  readonly height?: number;
  readonly marginBottom?: number;
  readonly orientation?: string;
  readonly title?: string;
  readonly jsonData?: Record<string, any>;
  readonly field: string;
  readonly onClickHandler?: (mouseEvent: PlotMouseEvent) => void;
  readonly stacked?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, height, marginBottom, orientation='v', title, jsonData, field, onClickHandler, stacked=false }: BarChartProps) => {

const chartData = data.datasets.map(dataset => ({
    x: orientation === "v" ? dataset.x : dataset.y,
    y: orientation  === "v" ? dataset.y : dataset.x,
    hoverinfo: "text",
    text: dataset.label_text,
    hovertemplate: dataset.hovertemplate,
    customdata: dataset.customdata,
    textposition: 'none',
    showlegend: false,
    uniformtext_mode: 'hide',
    title: null,
    marker: {
      color: dataset?.marker?.color,
      line: {
        color: '#4f4b4b',
        width: 2,
      },
    },
    type: 'bar',
    orientation: orientation,
    bargap: 0.50,
}));

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
    barmode: stacked ? 'stack' : 'group'
  };

  if (height !== undefined) {
    vertical_layout.height = height;
  } else {
    vertical_layout.autosize = true;
  }

  if (data.datasets[0].x.length > 6) {
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
    barmode: stacked ? 'stack' : 'group'
  };

  if (height !== undefined) {
    horizontal_layout.height = height;
  } else {
    horizontal_layout.autosize = true;
  }

  const config: Partial<Config> = {responsive: true,
    "displaylogo": false,
    'modeBarButtonsToRemove': ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toImage']
  };

  // Create unique ID for this chart
  const divId = `${field}_${Math.floor(Math.random() * 100)}`;

  return (
    <div>
    <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
      {title}
      <DownloadOptions chartDivId={divId} chartName={field} jsonData={jsonData} />
    </div>
    <Plot divId={divId} data={chartData} layout={ orientation==='v' ? vertical_layout : horizontal_layout } config={config} useResizeHandler={true}
           style={{width: "100%", height: "240px"}} onClick={onClickHandler} />
    </div>
  );

};

export default BarChart;

