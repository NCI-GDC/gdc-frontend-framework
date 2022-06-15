import { createUseCoreDataHook } from "../../dataAccess";
import { fetchAnnotations, selectAnnotationsData } from "./annotationsSlice";

export const useAnnotations = createUseCoreDataHook(
  fetchAnnotations,
  selectAnnotationsData,
);
