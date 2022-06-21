import { createUseCoreDataHook } from "../../dataAccess";
import { fetchProjects, selectProjectsData } from "./projectsSlice";

export const useProjects = createUseCoreDataHook(
  fetchProjects,
  selectProjectsData,
);
