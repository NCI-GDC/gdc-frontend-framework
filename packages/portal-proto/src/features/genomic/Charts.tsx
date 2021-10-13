import Plot from 'react-plotly.js';
import GeneData from "./genes.json";
import MutationData from "./mutations.json";

const createChartData = (which) => {
  const input_data = (which === "gene") ? GeneData["MostFrequentGenes"] : MutationData["MostFrequentMutation"];

  const data = {
    x: input_data.map(item => item.gene_label),
    y: input_data.map(item => item.percent),
    labels: null,
    type: "bar",
    filename: (which === "gene") ? "gene_chart.svg" : "mutation_chart.svg",
    chart_title: (which === "gene") ? "Distribution of Most Frequently Mutated Genes" : "Distribution of Mutations"
  };

  return data;
}

const GeneMutationChart = ({which} ) => {
  const chart_data = createChartData(which);

  const chartData = {
    ...chart_data,
    textinfo: "label+percent",
    uniformtext_mode: 'hide',
    title: null,
    margin: {
      t: 10,
      b: 10,
      l: 10,
      r: 10,
    },
    showlegend: false,
    marker: {
      line: {
        color: '#ffffff',
        width: 2,
      },
    },
    textposition: "outside",
    automargin: false,
    insidetextorientation: 'horizontal',

  };

   const layout = {
    uniformtext: { mode: 'hide', minsize: 8 } ,
    width: "100%", height: "100%", title: chart_data.chart_title,
    titlefont: {
      family: 'Arial, sans-serif',
      size: 24,
    },
    xaxis: {
      dividerwidth: 2,
      tickangle: 45,
      tickfont: {
        size: 12,
        color: 'rgb(107, 107, 107)'
      },
    },
    yaxis: {
      title: '% Cases Affected',
      titlefont: {
        family: 'Arial, sans-serif',
        size: 24,
      },
      tickfont: {
        size: 16,
        color: 'rgb(107, 107, 107)'
      },
    }
  };
  const config = {responsive: false,
    toImageButtonOptions: {
      format: 'png', // one of png, svg, jpeg, webp
      filename: chart_data.filename,
      height: 500,
      width: 700,
      scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    },
    "displaylogo": false,
    'modeBarButtonsToRemove': ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']

  }
  return (<div>
    <Plot data={[chartData]} layout={layout} config={config}/>
  </div>);

};

export default GeneMutationChart;
