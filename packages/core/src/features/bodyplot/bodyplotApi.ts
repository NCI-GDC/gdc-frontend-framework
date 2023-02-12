import { CoreState } from "../../reducers";

export const selectBodyplotCounts = (
  state: CoreState,
): Record<string, string> => state.bodyplot.bodyplotCounts;
