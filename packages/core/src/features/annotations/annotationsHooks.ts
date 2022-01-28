import { createUseCoreDataHook } from "../../dataAcess";
import { fetchAnnotations, selectAnnotationsData } from "./annotationsSlice";

export const useAnnotations = createUseCoreDataHook(
  fetchAnnotations,
  selectAnnotationsData,
);
