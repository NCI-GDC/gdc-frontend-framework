import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ChartjsBarChart = ({ data }) => {
  const canvasRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const chart = new Chart(canvasRef.current.getContext("2d"), {
      type: "bar",
      data,
    });

    return () => chart.destroy();
    /*
    const meta = chart.getDatasetMeta(0);
    console.log(meta);

  function clearActive() {
    if (selectedIndex > -1) {
      meta.controller.removeHoverStyle(meta.data[selectedIndex], 0, selectedIndex);
    }
  }

  function activate() {
    meta.controller.setHoverStyle(meta.data[selectedIndex], 0, selectedIndex);
    //chart.tooltip.setActiveElements([{datasetIndex: 0, index: selectedIndex}]);
    chart.render();
  }

  function activateNext() {
    clearActive();
    setSelectedIndex((selectedIndex + 1) % meta.data.length);
    activate();
  }

  function activatePrev() {
    clearActive();
    setSelectedIndex((selectedIndex || meta.data.length) -1);
    activate();
  }

  canvasRef.current.addEventListener("focus", function(){
    console.log('HI');
    if (selectedIndex === -1) {
      activateNext();
    } else {
      activate();
    }
  });
  
  canvasRef.current.addEventListener("blur", function(){
    clearActive();
    chart.render();
  });
  
  canvasRef.current.addEventListener("keydown", function(e) {
    if (e.key === 'ArrowRight') {
      activateNext();
    } else if (e.key === 'ArrowLeft') {
      activatePrev();
    }
  });
  */
  }, []);

  return <canvas ref={canvasRef} tabIndex={0} />;
};

export default ChartjsBarChart;
