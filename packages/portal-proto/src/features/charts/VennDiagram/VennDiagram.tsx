import { useState, useCallback, useMemo } from "react";
import { useLayout } from "./useLayouts";
import { VennDiagramProps } from "./types";
import EChartWrapperResponsive from "../EChartWrapperResponsive";

const VennDiagram: React.FC<VennDiagramProps> = ({
  chartData,
  labels,
  ariaLabel,
  onClickHandler,
  interactable = true,
}: VennDiagramProps) => {
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const highlightedIndices = useMemo(
    () => chartData.filter((d) => d?.highlighted).map((d) => d.key),
    [chartData],
  );

  const option = useLayout({
    chartData,
    highlightedIndices,
    labels,
    ariaLabel,
    onClickHandler,
    interactable,
    width: dimensions.width,
    height: dimensions.height,
  });

  const handleDimensionsChange = useCallback(
    (newDimensions: { width: number; height: number }) => {
      setDimensions(newDimensions);
    },
    [],
  );

  return (
    <EChartWrapperResponsive
      option={option}
      onDimensionsChange={handleDimensionsChange}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        minHeight: 400,
        margin: "0 auto",
      }}
    />
  );
};

export default VennDiagram;
