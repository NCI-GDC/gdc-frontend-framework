import React, { useRef, useEffect } from "react";
import { init, EChartsOption, ECharts } from "echarts";

export interface EChartWrapperProps {
  readonly option: EChartsOption;
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
  readonly height: number;
  readonly width: number;
}

const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  chartRef,
  height,
  width,
}: EChartWrapperProps) => {
  const ref = useRef<HTMLElement>(null);
  const wrapperRef = chartRef ?? ref;

  useEffect(() => {
    let chart: ECharts | undefined;

    if (
      wrapperRef.current !== null &&
      wrapperRef?.current?.clientHeight !== 0 &&
      wrapperRef?.current?.clientWidth !== 0
    ) {
      chart = init(wrapperRef.current, null, {
        renderer: "svg",
        height,
        width,
      });
      chart.setOption(option);
      chart.resize();
    }

    return () => {
      chart?.dispose();
    };
  }, [wrapperRef, height, width, option]);

  return (
    <div
      ref={wrapperRef ? (r) => (wrapperRef.current = r) : undefined}
      style={{ height, width }}
      role="img"
    />
  );
};

export default EChartWrapper;
