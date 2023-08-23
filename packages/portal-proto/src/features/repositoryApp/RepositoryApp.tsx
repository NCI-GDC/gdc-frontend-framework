import {
  buildCohortGqlOperator,
  CART_LIMIT,
  FilterSet,
  GdcFile,
  GqlOperation,
  joinFilters,
  selectCart,
  selectCurrentCohortFilters,
  stringifyJSONParam,
  useCoreDispatch,
  useCoreSelector,
  useGetAllFilesMutation,
  useGetFilesQuery,
} from "@gff/core";
import { useState } from "react";
import { AppStore, useAppSelector } from "./appApi";
import { MdShoppingCart as CartIcon } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import {
  addToCart,
  removeFromCart,
  showCartOverLimitNotification,
} from "@/features/cart/updateCart";
import { FileFacetPanel } from "./FileFacetPanel";
import { mapGdcFileToCartFile } from "../files/utils";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { DownloadButton } from "@/components/DownloadButtons";
import FunctionButtonRemove from "@/components/FunctionButtonRemove";
import { useClearLocalFilterWhenCohortChanges } from "@/features/repositoryApp/hooks";
import { useImageCounts } from "@/features/repositoryApp/slideCountSlice";
import { Tooltip } from "@mantine/core";
import FilesTables from "../repositoryApp/FilesTable";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";

const persistor = persistStore(AppStore);

const useCohortCentricFiles = () => {
  const repositoryFilters = useAppSelector((state) =>
    selectFilters(state),
  ) as FilterSet;
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const { data: fileData } = useGetFilesQuery({
    case_filters: buildCohortGqlOperator(cohortFilters),
    filters: buildCohortGqlOperator(repositoryFilters),
    expand: [
      "annotations", //annotations
      "cases.project", //project_id
      "cases",
    ],
    size: 20,
  });

  const { data: imagesCount } = useImageCounts(allFilters);

  return {
    allFilters,
    pagination: fileData?.pagination,
    repositoryFilters,
    imagesCount,
  };
};

export const RepositoryApp = (): JSX.Element => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const router = useRouter();
  const { allFilters, pagination, repositoryFilters, imagesCount } =
    useCohortCentricFiles();
  const [
    getFileSizeSliceData, // This is the mutation trigger
    { isLoading: allFilesLoading }, // This is the destructured mutation result
  ] = useGetAllFilesMutation();

  const getAllSelectedFiles = (callback, filters) => {
    getFileSizeSliceData(filters)
      .unwrap()
      .then((data: GdcFile[]) => {
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

  useClearLocalFilterWhenCohortChanges();

  const viewImageDisabled =
    imagesCount.slidesCount <= 0 && imagesCount.casesWithImagesCount <= 0;
  return (
    <>
      <PersistGate persistor={persistor}>
        <div className="flex mt-4 mx-4">
          <div className="w-1/4">
            <FileFacetPanel />
          </div>
          <div
            className="w-full overflow-hidden h-full"
            data-testid="repository-table"
          >
            <div className="flex justify-end align-center">
              <div className="flex justify-end gap-2 mt-9 mb-4">
                <DownloadButton
                  data-testid="button-manifest-files-table"
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
                  toolTip="Download a manifest for use with the GDC Data Transfer Tool. The GDC Data Transfer Tool is recommended for transferring large volumes of data."
                  endpoint="files"
                  method="POST"
                  options={{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }}
                  extraParams={{
                    return_type: "manifest",
                  }}
                  filters={buildCohortGqlOperator(allFilters)}
                  setActive={setActive}
                  active={active}
                />
                <Tooltip
                  label={"No images available to be viewed"}
                  disabled={!viewImageDisabled}
                >
                  <span>
                    <FunctionButton
                      onClick={() =>
                        router.push(
                          `/image-viewer/MultipleImageViewerPage?isCohortCentric=true&additionalFilters=${encodeURIComponent(
                            stringifyJSONParam(repositoryFilters),
                          )}`,
                        )
                      }
                      disabled={viewImageDisabled}
                      data-testid="button-view-images-files-table"
                    >
                      View Images
                    </FunctionButton>
                  </span>
                </Tooltip>

                <FunctionButton
                  data-testid="button-add-all-files-table"
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
                  data-testid="button-remove-all-files-table"
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
            <FilesTables />
          </div>
        </div>
      </PersistGate>
    </>
  );
};
