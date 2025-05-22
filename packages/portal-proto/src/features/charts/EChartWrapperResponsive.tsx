import React, { useEffect, useRef } from "react";
import { init, EChartsOption, ECharts } from "echarts";
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
  const chartInstanceRef = useRef<ECharts>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const chart = init(node, null, { renderer: "svg" });
    chartInstanceRef.current = chart;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepCompareEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(option);
    }
  }, [option]);

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
