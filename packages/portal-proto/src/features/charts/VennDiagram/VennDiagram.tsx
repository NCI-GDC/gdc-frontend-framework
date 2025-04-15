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
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    updateSize();

    return () => observer.disconnect();
  }, []);

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
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        minHeight: 400,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <EChartWrapperResponsive option={option} />
    </div>
  );
};

export default VennDiagram;
