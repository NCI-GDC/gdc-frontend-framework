import { FilterSet } from "@gff/core";
import { createContext, Dispatch, SetStateAction } from "react";

export const URLContext = createContext({ prevPath: "", currentPath: "" });

export type entityType = null | "project" | "case" | "file" | "ssms" | "genes";
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  contextSensitive?: boolean;
  contextFilters?: FilterSet;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);

interface ChartDownloadInfo {
  readonly chartRef: React.MutableRefObject<HTMLElement>;
  readonly filename: string;
}

export const LoggedInContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}>(null);

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
}>(undefined);

export const DownloadProgressContext = createContext({
  downloadInProgress: false,
  setDownloadInProgress: undefined,
});
