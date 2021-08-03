import Plot from 'react-plotly.js';

interface BarChartProps {
  readonly data: Record<string, any>;
}

const BarChart: React.FC<BarChartProps> = ({ data }: BarChartProps) => {

const chartData = {
    ...data.data,
    textinfo: "label+percent",
    uniformtext_mode: 'hide',
    title: null,
    showlegend: false,
    marker: {
      line: {
        color: '#ffffff',
        width: 2,
      },
    },
    textposition: "outside",
    automargin: true,
    insidetextorientation: 'horizontal',

  };

  const layout = {
    uniformtext: { mode: 'hide', minsize: 12 },
    autosize: true,
    width: "100%", height: "900px", title: data.title,

    titlefont: {
      family: 'Arial, sans-serif',
      size: 38,
    },
    xaxis: {
      tickson: "labels",
      ticklen: 4,
      automargin: true,
      dividerwidth: 2,
      tickfont: {
        size: 18,
        color: 'rgb(107, 107, 107)'
      },
      tickvals: data.tickvals,
      ticktext: data.ticktext,
      titlefont: {
        family: 'Arial, sans-serif',
        size: 24,
      },

    },
    yaxis: {
      title: data.yAxisTitle,
      titlefont: {
        family: 'Arial, sans-serif',
        size: 24,
      },
      tickfont: {
        size: 18,
        color: 'rgb(107, 107, 107)'
      },
    }
  };

  if (data.x.length > 6) {
    layout.xaxis.tickangle = 45;
  }
  var config = {responsive: true,
    toImageButtonOptions: {
      format: 'png', // one of png, svg, jpeg, webp
      filename: data.filename,
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    }
  };
  return (<div>
    <Plot data={[chartData]} layout={layout} config={config} />
  </div>);

};

export default BarChart;

