import {
  createGdcAppWithOwnStore,
  GdcFile,
  selectCart,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilterSet,
  selectFilesData,
  fetchFiles,
  buildCohortGqlOperator,
  joinFilters,
  usePrevious,
} from "@gff/core";
import React, { useEffect, useState } from "react";
import { AppStore, id, AppContext, useAppSelector } from "./appApi";
import { Button, Menu, Text } from "@mantine/core";
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
import tw from "tailwind-styled-components";

const FileActionButton = tw(Button)`
mx-1 
bg-secondary-darker 
text-secondary-content-lightest 
hover:bg-secondary-darkest
hover:text-secondary-content-lightest 
transition-colors
border-1
border-secondary-darkest
`;

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

const useCohortCentricFiles = () => {
  const coreDispatch = useCoreDispatch();
  const { data, pagination, status, error } = useCoreSelector(selectFilesData);

  const repositoryFilters = useAppSelector((state) => selectFilters(state));
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
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
        <Text transform="uppercase" size="lg" weight={700}>
          Files
        </Text>
        <Menu>
          <Menu.Target>
            <FileActionButton>
              <CartIcon size={"1.5rem"} />
              Update Cart
            </FileActionButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() =>
                addToCart(mapGdcFileToCartFile(allFiles), currentCart, dispatch)
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
        <FileActionButton>
          <DownloadIcon size={"1.5rem"} />
          Manifest
        </FileActionButton>
        <Link href="/user-flow/workbench/MultipleImageViewerPage">
          <FileActionButton component="a">View Images</FileActionButton>
        </Link>
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
