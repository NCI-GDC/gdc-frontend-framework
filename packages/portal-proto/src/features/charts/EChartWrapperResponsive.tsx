import React, { useRef } from "react";
import { init, EChartsOption } from "echarts";
import { useDeepCompareEffect } from "use-deep-compare";

export interface EChartWrapperResponsiveProps {
  readonly option: EChartsOption;
  readonly style?: React.CSSProperties;
  readonly onDimensionsChange?: (dimensions: {
    width: number;
    height: number;
  }) => void;
}

const EChartWrapperResponsive: React.FC<EChartWrapperResponsiveProps> = ({
  option,
  style,
  onDimensionsChange,
}: EChartWrapperResponsiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useDeepCompareEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const chart = init(node, null, { renderer: "svg" });
    chart.setOption(option);
    chart.resize();

    const handleResize = () => {
      const { width, height } = node.getBoundingClientRect();

      if (onDimensionsChange) {
        onDimensionsChange({ width, height });
      }
      chart.resize();
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(node);

    handleResize();

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option, onDimensionsChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        ...style,
      }}
      role="img"
    />
  );
};

export default EChartWrapperResponsive;
