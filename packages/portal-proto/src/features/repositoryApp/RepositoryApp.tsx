import {
  createGdcAppWithOwnStore,
  GdcFile,
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
import { Menu, Text } from "@mantine/core";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { FileFacetPanel } from "./FileFacetPanel";
import { FilesView } from "@/features/files/FilesView";
import { mapGdcFileToCartFile } from "../files/utils";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import { isEqual } from "lodash";
import FunctionButton from "@/components/FunctionButton";

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

const useCohortCentricFiles = () => {
  const coreDispatch = useCoreDispatch();
  const { data, pagination, status, error } = useCoreSelector(selectFilesData);

  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const prevFilters = usePrevious(allFilters);

  useEffect(() => {
    if (status === "uninitialized" || !isEqual(allFilters, prevFilters)) {
      coreDispatch(fetchFiles({ filters: buildCohortGqlOperator(allFilters) })); // eslint-disable-line
    }
  }, [status, coreDispatch, allFilters, prevFilters]);

  return {
    data,
    pagination,
    error,
    isUninitialized: status === "uninitialized",
    isFetching: status === "pending",
    isSuccess: status === "fulfilled",
    isError: status === "rejected",
  };
};

const RepositoryApp: React.FC<ContextualFilesViewProps> = ({
  handleFileSelected,
}: ContextualFilesViewProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [selectedFiles, setSelectedFiles] = useState<GdcFile[]>([]);

  const { data, pagination, isSuccess } = useCohortCentricFiles();

  const handleCheckedFiles = (e, file: GdcFile) => {
    if (e.target.checked) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    }
  };

  // TODO: remove, mock data for cart
  const allFiles = Array(10001)
    .fill(0)
    .map((_, i) => data?.[i % 10]);
  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row justify-end align-center m-2">
        <Text transform="uppercase" size="lg" weight={700}>
          Total of{" "}
        </Text>
        <Text className="mx-2" transform="uppercase" size="lg" weight={1000}>
          {isSuccess ? pagination.total : "   "}
        </Text>
        <Text transform="uppercase" size="lg" className="mr-6" weight={700}>
          Files
        </Text>
        <div className="flex justify-end gap-2">
          <Menu>
            <Menu.Target>
              <FunctionButton>
                <CartIcon size={"1.5rem"} />
                Update Cart
              </FunctionButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() =>
                  addToCart(
                    mapGdcFileToCartFile(allFiles),
                    currentCart,
                    dispatch,
                  )
                }
              >
                {"Add All Files"}
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  addToCart(
                    mapGdcFileToCartFile(selectedFiles),
                    currentCart,
                    dispatch,
                  )
                }
              >
                {"Add Selected Files"}
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  removeFromCart(
                    mapGdcFileToCartFile(selectedFiles),
                    currentCart,
                    dispatch,
                  )
                }
              >
                {"Remove Selected Files"}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <FunctionButton>
            <DownloadIcon size={"1.5rem"} />
            Manifest
          </FunctionButton>
          <Link href="/user-flow/workbench/MultipleImageViewerPage">
            <FunctionButton component="a">View Images</FunctionButton>
          </Link>
        </div>
      </div>
      <div className="flex flex-row mx-3">
        <FileFacetPanel />
        <FilesView
          files={data}
          handleFileSelected={handleFileSelected}
          handleCheckedFiles={handleCheckedFiles}
        />
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
});

export const RepositoryAppId: string = id;
