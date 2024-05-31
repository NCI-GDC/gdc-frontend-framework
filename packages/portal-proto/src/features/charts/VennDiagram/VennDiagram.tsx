import { useMemo } from "react";
import EChartWrapper from "@/features/cDave/CDaveCard/EChartWrapper";
import { useLayout } from "./useLayouts";
import { VennDiagramProps } from "./types";

const VennDiagram: React.FC<VennDiagramProps> = ({
  chartData,
  labels,
  onClickHandler,
  interactable = true,
}: VennDiagramProps) => {
  const highlightedIndices = useMemo(
    () => chartData.filter((d) => d?.highlighted).map((d) => d.key),
    [chartData],
  );

  const option = useLayout({
    chartData,
    highlightedIndices,
    labels,
    onClickHandler,
    interactable,
  });

  return (
    <EChartWrapper
      option={option}
      label="Venn Diagram"
      height={400}
      width={400}
    />
  );
};

export default VennDiagram;
