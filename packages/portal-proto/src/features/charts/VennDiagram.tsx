import { useState } from 'react';
import { Config, Layout, Shape, PlotMouseEvent } from 'plotly.js';
import Plot from 'react-plotly.js';
import { useEffect } from 'react';

const threeCircleLayout : Partial<Shape>[] = [
  {
    opacity: 1,
    xref: 'x',
    yref: 'y',
    fillcolor: 'rgb(237, 237, 237)',
    x0: 1,
    y0: 2,
    x1: 3,
    y1: 4,
    type: 'circle',
    line: {
      color: 'black',
      width: 2,
    },
    layer: 'below',
  }, {
    opacity: 1,
    xref: 'x',
    yref: 'y',
    fillcolor: 'rgb(237, 237, 237)',
    x0: 2,
    y0: 2,
    x1: 4,
    y1: 4,
    type: 'circle',
    line: {
      color: 'black',
      width: 2,
    },
    layer: 'below',
  },
  {
    opacity: 1,
    xref: 'x',
    yref: 'y',
    fillcolor: 'rgb(237, 237, 237)',
    x0: 1.5,
    y0: 1,
    x1: 3.5,
    y1: 3,
    type: 'circle',
    line: {
      color: 'black',
      width: 2,
    },
    layer: 'below',
  },
  // Shape for circle 1 and 2 intersection
  {
    opacity: 1,
    fillcolor: 'rgb(237, 237, 237)',
    type: 'path',
    path: 'M 2 2.85 Q 2 3.6, 2.5 3.85 Q 3 3.6, 3 2.85 Q 2.5 3.15, 2 2.85',
    line: {
      color: 'black',
      width: 1,
    },
    layer: 'below',
  },
  // Circle 1 and 3 intersection
  {
    opacity: 1,
    fillcolor: 'rgb(237, 237, 237)',
    type: 'path',
    path: 'M 2.5 2.15 Q 2 1.8, 1.5 2.13 Q 1.65 2.75, 2 2.85 Q 2.325 2.15, 2.5 2.15',
    line: {
      color: 'black',
      width: 1,
    },
    layer: 'below',
  },
  //Circle 2 and 3 intersection
  {
    opacity: 1,
    fillcolor: 'rgb(237, 237, 237)',
    type: 'path',
    path: 'M 3 2.85 Q 3.35 2.75, 3.5 2.13 Q 3 1.85, 2.5 2.15 Q 2.75 2.15, 3 2.855',
    line: {
      color: 'black',
      width: 1,
    },
    layer: 'below',
  },
  // Union of all 3 circles
  {
    opacity: 1,
    fillcolor: 'rgb(237, 237, 237)',
    type: 'path',
    path: 'M 2.5 2.15 Q 2.15 2.35, 2 2.85 Q 2.5 3.15, 3 2.85 Q 2.75 2.15, 2.5 2.15',
    line: {
      color: 'black',
      width: 1,
    },
    layer: 'below',
  }
];


interface chartData {
  readonly key: string;
  readonly value: number;
  readonly highlighted: boolean;
}

interface VennDiagramProps {
  readonly chartData: chartData[]; 
  readonly labels: string[];
  readonly onClickHandler?: Function;
}

const VennDiagram : React.FC<VennDiagramProps> = ({ chartData, labels, onClickHandler } : VennDiagramProps) => {
  const layoutWithHighlighting = threeCircleLayout.map((layout, idx) => {
    if (chartData[idx].highlighted) {
      return {...layout, fillcolor: 'rgb(165, 218, 235)'};
    } else {
      return layout;
    }
  });

  const initialLayout : Partial<Layout> = {
    xaxis: {
     showticklabels: false,
     autotick: false,
     showgrid: false,
     zeroline: false,
     range: [0, 5],
   },
   yaxis: {
     showticklabels: false,
     autotick: false,
     showgrid: false,
     zeroline: false,
     range: [0, 5],
   },
   shapes: layoutWithHighlighting,
   height: 400,
   width: 450,
   margin: {
     l: 0,
     r: 0,
     t: 0,
     b: 0,
   }
  };

  const [layout, setLayout] = useState(initialLayout);

  useEffect(() => {
    const copyLayout = threeCircleLayout.map((layout, idx) => {
      if (chartData[idx].highlighted) {
        return {...layout, fillcolor: 'rgb(165, 218, 235)'};
      } else {
        return layout;
      }
    });
    setLayout({...initialLayout, shapes: copyLayout});
  }, [chartData]);

  const config: Partial<Config> = {
    responsive: true,
    "displaylogo": false,
    'modeBarButtonsToRemove': ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toImage']
  };

  // TODO; rethink maybe, key order not assured
  const dataLabels = {
    c1Label : { x: 1.5, y: 3.25 },
    c2Label : { x: 3.5, y: 3.25 },
    c3Label : { x: 2.5, y: 1.75 },
    c1c2Label : { x: 2.5, y: 3.25 },
    c1c3Label : { x: 2, y: 2.25 },
    c2c3Label : { x: 3, y: 2.25 },
    c1c2c3Label : {x: 2.5, y: 2.5},
  };

  // Labels for the chart 
  const data = {
    x: [...Object.values(dataLabels).map(v => v.x), 1, 4, 2.5],
    y: [...Object.values(dataLabels).map(v => v.y), 3.75, 3.75, .75],
    type: 'scatter',
    mode: 'text',
    text: [...chartData.map(d => d.value), ...labels],
    textfont: {
      color: 'black',
      size: 12,
      family: 'Arial'
    },
 };

  
  const onHover = (mouseEvent: PlotMouseEvent) => {
    const dataIndex = mouseEvent.points[0].pointIndex;
    const copyLayout = layoutWithHighlighting.map((layout, idx) => {
      if (idx === dataIndex) {
       return {...layout, fillcolor: 'rgb(165, 218, 235)'};
      } else {
        return layout;
      }
    });
    setLayout({...initialLayout, shapes: copyLayout});
  }

  const onUnhover = () => {
    setLayout(initialLayout);
  }
  

  const onClick = (mouseEvent : PlotMouseEvent) => {
    if (onClickHandler) {
      onClickHandler(chartData[mouseEvent.points[0].pointIndex].key);
    }
  }

  return (
    <Plot data={[data]} layout={layout} config={config} onClick={onClick} onHover={onHover} onUnhover={onUnhover} />
  );
}

export default VennDiagram;