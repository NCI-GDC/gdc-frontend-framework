import {
  createUseCoreDataHook,
  createUseFiltersCoreDataHook,
} from "../../dataAcess";
import { fetchFiles, selectFilesData } from "./filesSlice";
import { selectCurrentCohortFilters } from "../cohort/cohortFilterSlice";

export const useFiles = createUseCoreDataHook(fetchFiles, selectFilesData);

export const useFilteredFiles = createUseFiltersCoreDataHook(
  fetchFiles,
  selectFilesData,
  selectCurrentCohortFilters,
);
