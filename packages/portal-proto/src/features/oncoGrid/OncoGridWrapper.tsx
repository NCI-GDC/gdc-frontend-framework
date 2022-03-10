import OncoGrid from "oncogrid";
import { useEffect, useState, useRef } from "react";
import { donors, genes, ssmObservations, cnvObservations } from "./fixture";

const OncoGridWrapper = () => {
  const gridContainer = useRef(null);
  const gridObject = useRef(null);

  useEffect(() => {
    const params = {
      element: gridContainer.current,
      donors,
      genes,
      ssmObservations,
      cnvObservations,
      height: 450,
      width: 600,
      heatMap: false,
      grid: false,
      colorMap: {
        cnv: {
          Gain: "#e76a6a",
          Loss: "#64b5f6",
        },
        mutation: {
          frameshift_variant: "#2E7D32",
          missense_variant: "#2E7D32",
          start_lost: "#2E7D32",
          stop_gained: "#2E7D32",
          stop_lost: "#2E7D32",
        },
      },
    };

    const grid = new OncoGrid(params);
    grid.render();
    gridObject.current = grid;

    return () => gridObject.current.destroy();
  }, []);

  return (
    <>
      <div ref={ref => gridContainer.current = ref}></div>
    </>
  );
};

export default OncoGridWrapper;
