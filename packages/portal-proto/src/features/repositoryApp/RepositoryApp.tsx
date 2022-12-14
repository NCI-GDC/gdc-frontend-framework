import {
  createGdcAppWithOwnStore,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  selectFilesData,
  fetchFiles,
  buildCohortGqlOperator,
  joinFilters,
  usePrevious,
} from "@gff/core";
import React, { useEffect } from "react";
import { AppStore, id, AppContext, useAppSelector } from "./appApi";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import Link from "next/link";
import { FileFacetPanel } from "./FileFacetPanel";
import { FilesView } from "@/features/files/FilesView";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import { isEqual } from "lodash";
import FunctionButton from "@/components/FunctionButton";
import FunctionButtonRemove from "@/components/FunctionButtonRemove";

const useCohortCentricFiles = () => {
  const coreDispatch = useCoreDispatch();
  const { status } = useCoreSelector(selectFilesData);

  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const prevFilters = usePrevious(allFilters);

  const cohortGqlOperator = buildCohortGqlOperator(allFilters);

  useEffect(() => {
    if (status === "uninitialized" || !isEqual(allFilters, prevFilters)) {
      coreDispatch(
        fetchFiles({
          filters: cohortGqlOperator,
          expand: [
            "annotations", //annotations
            "cases.project", //project_id
          ],
          size: 20,
        }),
      );
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, coreDispatch, allFilters, prevFilters]);

  //TODO make this in a way that the call only happens when the user hits the button
};

const RepositoryApp = () => {
  useCohortCentricFiles();

  //const fileSizeSliceData = useAllFiles(cohortGqlOperator);

  /*const [
    getFileSizeSliceData, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useAllFilesMutation();*/

  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row justify-end align-center m-2">
        <div className="flex justify-end gap-2">
          <FunctionButton>
            <DownloadIcon size={"1rem"} />
            Manifest
          </FunctionButton>
          <Link href="/image-viewer/MultipleImageViewerPage">
            <FunctionButton component="a">View Images</FunctionButton>
          </Link>
          <FunctionButton
            leftIcon={<CartIcon size={"1rem"} />}
            onClick={() => {
              alert("Coming soon!");
            }}
          >
            Add All Files to Cart
          </FunctionButton>
          <FunctionButtonRemove
            leftIcon={<VscTrash size={"1rem"} />}
            onClick={() => {
              alert("Coming soon!");
            }}
          >
            Remove All From Cart
          </FunctionButtonRemove>
        </div>
      </div>
      <div className="flex flex-row mx-3">
        <FileFacetPanel />
        <FilesView />
      </div>
    </div>
  );
};

// creates and registers the App with the Analysis Tool Framework
export default createGdcAppWithOwnStore({
  App: RepositoryApp,
  id: id,
  name: "Repository Tool",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
  store: AppStore,
  context: AppContext,
  persist: true,
});

export const RepositoryAppId: string = id;
