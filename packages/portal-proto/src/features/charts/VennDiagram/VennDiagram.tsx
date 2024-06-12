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
}: VennDiagramProps) => {
  const highlightedIndices = useMemo(
    () => chartData.filter((d) => d?.highlighted).map((d) => d.key),
    [chartData],
  );

  const { option, disableCursor } = useLayout({
    chartData,
    highlightedIndices,
    labels,
    ariaLabel,
    onClickHandler,
    interactable,
  });

  return (
    <EChartWrapper
      option={option}
      disableCursor={disableCursor}
      height={400}
      width={400}
    />
  );
};

export default VennDiagram;
