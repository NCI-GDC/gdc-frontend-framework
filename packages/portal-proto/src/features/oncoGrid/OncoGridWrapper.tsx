import OncoGrid from "oncogrid";
import { useCoreDispatch, useOncoGrid } from "@gff/core";
import { useEffect, useState, useRef } from "react";
import { donors, genes, ssmObservations, cnvObservations } from "./fixture";

const OncoGridWrapper = () => {
  const { data } = useOncoGrid({
    consequenceTypeFilters: [
      "missense_variant",
      "frameshift_variant",
      "start_lost",
      "stop_lost",
      "stop_gained",
    ],
    cnvFilters: ["Loss", "Gain"],
  });
  const gridRef = useRef(null);

  useEffect(() => {
    const params = {
      element: "#onco-grid-div",
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
    gridRef.current = grid;

    return () => gridRef.current.destroy();
  }, []);

  return (
    <>
      <div id="onco-grid-div"></div>
    </>
  );
};

export default OncoGridWrapper;
