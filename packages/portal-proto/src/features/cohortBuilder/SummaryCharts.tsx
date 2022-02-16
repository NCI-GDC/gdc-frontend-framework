import { useState } from "react";
import { FacetChart } from "../charts/FacetChart";

const SummaryStatsTop: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row items-center h-12 bg-nci-cyan-light w-100">
      <div className="px-4">Summary Statistics</div>
    </div>
  );
};

interface SummaryChartsProps {
  fields:  string[];
  chartHeight?: number;
}
export const SummaryCharts: React.FC<SummaryChartsProps> =  ({ fields, chartHeight = 120} :  SummaryChartsProps) => {

  return (
    <div className="p-1.5">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {fields.map((name, index) => {
          return (<FacetChart
            field={name}
            height={chartHeight}
            marginBottom={0}
            showXLabels={false}
            key={`summary-chart-${index}`}
          />)
        })
        }

      </div>
  </div>

  );
};

export default SummaryCharts;
