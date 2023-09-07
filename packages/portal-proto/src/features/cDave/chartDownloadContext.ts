import React, { createContext, Dispatch } from "react";

interface ChartDownloadInfo {
  readonly chartRef: React.MutableRefObject<HTMLElement>;
  readonly filename: string;
}

export const chartDownloadReducer = (
  state: ChartDownloadInfo[],
  action: { type: "add" | "remove"; payload: ChartDownloadInfo[] },
): ChartDownloadInfo[] => {
  switch (action.type) {
    case "add":
      console.log(action);
      return [...state, ...action.payload];
    case "remove":
      return state.filter(
        (d) =>
          !action.payload.map((chart) => chart.filename).includes(d.filename),
      );
    default:
      return state;
  }
};

export const DashboardDownloadContext = createContext<{
  state: ChartDownloadInfo[];
  dispatch: Dispatch<{ type: "add" | "remove"; payload: ChartDownloadInfo[] }>;
}>(undefined);
