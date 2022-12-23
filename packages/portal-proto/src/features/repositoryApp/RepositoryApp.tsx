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
  useGetAllFilesMutation,
  GdcFileIds,
  CART_LIMIT,
  GqlOperation,
  FilterSet,
} from "@gff/core";
import { useEffect, useState } from "react";
import { AppStore, id, AppContext, useAppSelector } from "./appApi";
import { MdShoppingCart as CartIcon } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import {
  addToCart,
  removeFromCart,
  showCartOverLimitNotification,
} from "@/features/cart/updateCart";
import Link from "next/link";
import { FileFacetPanel } from "./FileFacetPanel";
import { FilesView } from "@/features/files/FilesView";
import { mapGdcFileToCartFile } from "../files/utils";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import { isEqual } from "lodash";
import FunctionButton from "@/components/FunctionButton";
import { DownloadButton } from "@/components/DownloadButtons";
import FunctionButtonRemove from "@/components/FunctionButtonRemove";

const useCohortCentricFiles = () => {
  const coreDispatch = useCoreDispatch();
  const { pagination, status } = useCoreSelector(selectFilesData);

  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const prevFilters = usePrevious(allFilters);

  useEffect(() => {
    if (status === "uninitialized" || !isEqual(allFilters, prevFilters)) {
      coreDispatch(
        fetchFiles({
          filters: buildCohortGqlOperator(allFilters),
          expand: [
            "annotations", //annotations
            "cases.project", //project_id
          ],
          size: 20,
        }),
      );
    }
  }, [status, coreDispatch, allFilters, prevFilters]);

  return { allFilters, pagination };
};

const RepositoryApp = () => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { allFilters, pagination } = useCohortCentricFiles();

  const [
    getFileSizeSliceData, // This is the mutation trigger
    { isLoading: allFilesLoading }, // This is the destructured mutation result
  ] = useGetAllFilesMutation();

  const getAllSelectedFiles = (callback, filters) => {
    getFileSizeSliceData(filters)
      .unwrap()
      .then((data: GdcFileIds[]) => {
        return mapGdcFileToCartFile(data);
      })
      .then((cartFiles) => {
        callback(cartFiles, currentCart, dispatch);
      });
  };
  const buildCohortGqlOperatorWithCart = (): GqlOperation => {
    // create filter with current cart file ids
    const cartFilterSet: FilterSet = {
      root: {
        "files.file_id": {
          operator: "includes",
          field: "files.file_id",
          operands: currentCart.map((obj) => obj.file_id),
        },
      },
      mode: "and",
    };
    return buildCohortGqlOperator(joinFilters(allFilters, cartFilterSet));
  };
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-row mt-4 mx-3">
      <div className="w-1/5">
        <FileFacetPanel />
      </div>
      <div className="w-full overflow-hidden h-full">
        <div className="flex flex-row justify-end align-center m-2">
          <div className="flex justify-end gap-2">
            <DownloadButton
              customStyle={`
              flex
              flex-row
              items-center
              bg-base-lightest
              text-base-contrast-max
              border
              border-solid
              border-primary-darker
              hover:bg-primary-darker
              font-heading
              hover:text-primary-contrast-darker
              disabled:opacity-60
              disabled:border-opacity-60
              disabled:text-opacity-60
              `}
              activeText="Processing"
              inactiveText="Manifest"
              title="Download a manifest for use with the GDC Data Transfer Tool. The GDC Data Transfer Tool is recommended for transferring large volumes of data."
              endpoint="files"
              filename={`gdc_manifest.${new Date()
                .toISOString()
                .slice(0, 10)}.txt`}
              format="tsv"
              method="POST"
              options={{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }}
              fields={["file_id", "file_name", "md5sum", "file_size", "state"]}
              filters={buildCohortGqlOperator(allFilters)}
              setActive={setActive}
              active={active}
            />
            <Link href="/image-viewer/MultipleImageViewerPage">
              <FunctionButton component="a">View Images</FunctionButton>
            </Link>
            <FunctionButton
              leftIcon={<CartIcon />}
              loading={allFilesLoading}
              onClick={() => {
                // check number of files selected before making call
                if (
                  pagination?.total &&
                  pagination.total + currentCart.length > CART_LIMIT
                ) {
                  showCartOverLimitNotification(currentCart.length);
                } else {
                  getAllSelectedFiles(
                    addToCart,
                    buildCohortGqlOperator(allFilters),
                  );
                }
              }}
            >
              Add All Files to Cart
            </FunctionButton>
            <FunctionButtonRemove
              leftIcon={<VscTrash />}
              loading={allFilesLoading}
              onClick={() => {
                getAllSelectedFiles(
                  removeFromCart,
                  buildCohortGqlOperatorWithCart(),
                );
              }}
            >
              Remove All From Cart
            </FunctionButtonRemove>
          </div>
        </div>
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
