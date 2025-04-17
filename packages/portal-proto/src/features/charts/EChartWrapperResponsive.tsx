import React, { useRef, useEffect } from "react";
import { init, EChartsOption, ECharts } from "echarts";
import { useDeepCompareEffect } from "use-deep-compare";

export interface EChartWrapperProps {
  readonly option: EChartsOption;
  readonly chartRef?: React.MutableRefObject<HTMLDivElement>;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

const EChartWrapperResponsive: React.FC<EChartWrapperProps> = ({
  option,
  chartRef,
  className,
  style,
}: EChartWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = chartRef ?? ref;

  useDeepCompareEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const chart = init(node, null, { renderer: "svg" });
    chart.setOption(option);
    chart.resize();

    const observer = new ResizeObserver(() => {
      chart.resize();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return (
    <div
      ref={wrapperRef}
      className={className}
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
