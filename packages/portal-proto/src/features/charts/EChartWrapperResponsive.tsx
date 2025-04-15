import React, { useRef, useEffect } from "react";
import { init, EChartsOption, ECharts } from "echarts";
import { useDeepCompareEffect } from "use-deep-compare";

export interface EChartWrapperProps {
  readonly option: EChartsOption;
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
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
  const chartInstanceRef = useRef<ECharts | null>(null);

  useDeepCompareEffect(() => {
    if (!wrapperRef.current) return;

    const chart = init(wrapperRef.current, null, { renderer: "svg" });
    chartInstanceRef.current = chart;
    chart.setOption(option);
    chart.resize();

    return () => {
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [option]);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || !chartInstanceRef.current) return;

    const observer = new ResizeObserver(() => {
      chartInstanceRef.current?.resize();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={(el) => {
        if (el) wrapperRef.current = el;
      }}
      className={className}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        minHeight: 400,
        ...style,
      }}
      role="img"
    />
  );
};

export default EChartWrapperResponsive;
