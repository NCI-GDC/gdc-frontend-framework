import { createUseCoreDataHook } from "../../dataAcess";
import { fetchProjects, selectProjectsData } from "./projectsSlice";

export const useProjects = createUseCoreDataHook(
  fetchProjects,
  selectProjectsData,
);
