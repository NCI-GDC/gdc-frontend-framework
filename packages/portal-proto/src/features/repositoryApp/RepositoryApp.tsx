import {
  createGdcAppWithOwnStore,
  selectCart,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  selectFilesData,
  fetchFiles,
  buildCohortGqlOperator,
  joinFilters,
  usePrevious,
} from "@gff/core";
import React, { useEffect, useState } from "react";
import { AppStore, id, AppContext, useAppSelector } from "./appApi";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { FileFacetPanel } from "./FileFacetPanel";
import { FilesView } from "@/features/files/FilesView";
import { mapGdcFileToCartFile } from "../files/utils";
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
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  useCohortCentricFiles();

  const [allFilesLoading, setAllFilesLoading] = useState(false);

  //const fileSizeSliceData = useAllFiles(cohortGqlOperator);

  /*const [
    getFileSizeSliceData, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useAllFilesMutation();*/

  //console.log(fileSizeSliceData);

  const getAllSelectedFiles = () => {
    // console.log("test"); TODO make work
    // mark as in progress
    setAllFilesLoading(true);

    return mapGdcFileToCartFile([]);
  };

  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row justify-end align-center m-2">
        <div className="flex justify-end gap-2">
          <FunctionButton>
            <DownloadIcon size={"1rem"} />
            Manifest
          </FunctionButton>
          <Link href="/user-flow/workbench/MultipleImageViewerPage">
            <FunctionButton component="a">View Images</FunctionButton>
          </Link>
          <FunctionButton
            leftIcon={<CartIcon size={"1rem"} />}
            loading={allFilesLoading}
            onClick={() => {
              addToCart(getAllSelectedFiles(), currentCart, dispatch);
              //setAddToCartLoading(false);
            }}
          >
            Add All Files to Cart
          </FunctionButton>
          <FunctionButtonRemove
            leftIcon={<VscTrash size={"1rem"} />}
            loading={allFilesLoading}
            onClick={() =>
              removeFromCart(getAllSelectedFiles(), currentCart, dispatch)
            }
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
