import { createContext, Dispatch } from "react";

// Chart download context

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
}>({ state: [], dispatch: () => {} });

export const DownloadProgressContext = createContext<{
  downloadInProgress: boolean;
  setDownloadInProgress: ((inProgress: boolean) => void) | undefined;
}>({
  downloadInProgress: false,
  setDownloadInProgress: undefined,
});

// Selection screen context

interface SelectionScreenContextProps {
  readonly selectionScreenOpen: boolean;
  readonly setSelectionScreenOpen?: (open: boolean) => void;
  readonly app?: string;
  readonly setActiveApp?: (app?: string, demoMode?: boolean) => void;
}

export const SelectionScreenContext =
  createContext<SelectionScreenContextProps>({
    selectionScreenOpen: false,
    setSelectionScreenOpen: undefined,
    app: undefined,
    setActiveApp: undefined,
  });
