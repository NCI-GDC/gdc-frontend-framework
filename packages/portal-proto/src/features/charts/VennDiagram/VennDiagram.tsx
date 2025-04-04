import { useMemo } from "react";
import EChartWrapper from "@/features/charts/EChartWrapper";
import { useLayout } from "./useLayouts";
import { VennDiagramProps } from "./types";

const VennDiagram: React.FC<VennDiagramProps> = ({
  chartData,
  labels,
  ariaLabel,
  onClickHandler,
  interactable = true,
  width = 400,
  height = 400,
}: VennDiagramProps) => {
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
    width,
    height,
  });

  return <EChartWrapper option={option} height={height} width={width} />;
};

export default VennDiagram;
