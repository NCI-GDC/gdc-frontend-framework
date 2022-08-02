import {
  createGdcAppWithOwnStore,
  GdcFile,
  selectCart,
  useCoreDispatch,
  useCoreSelector,
  useFilteredFiles,
  selectCurrentCohortFilterSet,
} from "@gff/core";
import React, { useState } from "react";
import { AppStore, id, AppContext } from "./appApi";
import { Button, Menu } from "@mantine/core";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { FileFacetPanel } from "./FileFacetPanel";
import { FilesView } from "@/features/files/FilesView";
import { mapGdcFileToCartFile } from "../files/utils";

const buttonStyle =
  "mx-1 bg-nci-gray-light hover:bg-nci-gray transition-colors";

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

const RepositoryApp: React.FC<ContextualFilesViewProps> = ({
  handleFileSelected,
}: ContextualFilesViewProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [selectedFiles, setSelectedFiles] = useState<GdcFile[]>([]);
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
  );
  const { data } = useFilteredFiles();

  console.log("cohortFilter", cohortFilters);

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
      <div className="flex flex-row justify-end m-2">
        <Menu
          control={
            <Button className={buttonStyle}>
              <CartIcon size={"1.5rem"} />
              Update Cart
            </Button>
          }
        >
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
        </Menu>
        <Button className={buttonStyle}>
          <DownloadIcon size={"1.5rem"} />
          Manifest
        </Button>
        <Link href="/user-flow/workbench/MultipleImageViewerPage">
          <Button component="a" className={buttonStyle}>
            View Images
          </Button>
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
  name: "Demonstration Application 3",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
  store: AppStore,
  context: AppContext,
});

export const RepositoryAppId: string = id;
