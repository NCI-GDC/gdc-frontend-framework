import { useRef, useState, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });
    };
    const observer = new ResizeObserver(update);
    observer.observe(node);
    update();
    return () => observer.disconnect();
  }, []);

  console.log({ dimensions });

  const highlightedIndices = chartData
    .filter((d) => d?.highlighted)
    .map((d) => d.key);

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

  return (
    <EChartWrapperResponsive
      option={option}
      chartRef={containerRef}
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
