import { createUseCoreDataHook } from "../../dataAcess";
import { fetchHistory, selectHistoryData } from "./historySlice";

export const useHistory = createUseCoreDataHook(
  fetchHistory,
  selectHistoryData,
);
