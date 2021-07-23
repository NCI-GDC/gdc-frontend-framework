import { createUseCoreDataHook } from "../../dataAcess";
import { fetchFiles, selectFilesData } from "./filesSlice";

export const useFiles = createUseCoreDataHook(fetchFiles, selectFilesData);
