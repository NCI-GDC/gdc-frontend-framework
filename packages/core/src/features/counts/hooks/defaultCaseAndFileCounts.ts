import { selectCohortCounts } from "../../cohort";
import { useCoreSelector } from "../../../hooks";

export const useDefaultCaseCountHook = () => {
  const counts = useCoreSelector((state) => selectCohortCounts(state));
  return {
    data: counts?.caseCount || 0,
    isFetching: counts.status === "pending",
    isSuccess: counts.status === "fulfilled",
    isError: counts.status === "rejected",
  };
};

export const useDefaultFileCountHook = () => {
  const counts = useCoreSelector((state) => selectCohortCounts(state));
  return {
    data: counts?.fileCount || 0,
    isFetching: counts.status === "pending",
    isSuccess: counts.status === "fulfilled",
    isError: counts.status === "rejected",
  };
};
