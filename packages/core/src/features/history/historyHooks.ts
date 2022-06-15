import { createUseCoreDataHook } from "../../dataAccess";
import { fetchHistory, selectHistoryData } from "./historySlice";

export const useFileHistory = createUseCoreDataHook(
  fetchHistory,
  selectHistoryData,
);
