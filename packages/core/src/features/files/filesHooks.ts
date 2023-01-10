import {
  createUseCoreDataHook,
  createUseFiltersCoreDataHook,
} from "../../dataAccess";
import { fetchFiles, selectFilesData } from "./filesSlice";
import { selectCurrentCohortFilters } from "../cohort/availableCohortsSlice";
import { useFilesSize } from "./totalFileSizeSlice";
import { useGetAllFilesMutation, GdcFileIds } from "./allFilesMutation";

export const useFiles = createUseCoreDataHook(fetchFiles, selectFilesData);

export const useFilteredFiles = createUseFiltersCoreDataHook(
  fetchFiles,
  selectFilesData,
  selectCurrentCohortFilters,
);

export { useFilesSize, useGetAllFilesMutation, GdcFileIds };
