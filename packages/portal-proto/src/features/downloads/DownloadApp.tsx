import {
  createGdcAppWithOwnStore,
  GdcFile,
  selectCart,
  useCoreDispatch,
  useCoreSelector,
  useFacetDictionary,
  useFilteredFiles,
} from "@gff/core";
import React, { useEffect, useState } from "react";
import { AppStore, id, AppContext, useAppSelector } from "./coreApi";
import { selectRepositoryConfig } from "@/features/downloads/fileFiltersSlice";
import { Button, Menu } from "@mantine/core";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { EnumFacet } from "@/features/facets/EnumFacet";
import { FilesView } from "@/features/files/FilesView";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
import { LoadingOverlay } from "@mantine/core";

const buttonStyle =
  "mx-1 bg-nci-gray-light hover:bg-nci-gray transition-colors";

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

const DownloadApp: React.FC<ContextualFilesViewProps> = ({
  handleFileSelected,
}: ContextualFilesViewProps) => {
  const { data } = useFilteredFiles();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [selectedFiles, setSelectedFiles] = useState<GdcFile[]>([]);
  const configState = useAppSelector(selectRepositoryConfig);
  const { isSuccess: dictSuccess } = useFacetDictionary();

  const handleCheckedFiles = (e, file: GdcFile) => {
    if (e.target.checked) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
    }
  };

  const facets = getFacetInfo(configState.facets);
  console.log("facets in download", facets);

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
          <Menu.Item onClick={() => addToCart(allFiles, currentCart, dispatch)}>
            {"Add All Files"}
          </Menu.Item>
          <Menu.Item
            onClick={() => addToCart(selectedFiles, currentCart, dispatch)}
          >
            {"Add Selected Files"}
          </Menu.Item>
          <Menu.Item
            onClick={() => removeFromCart(selectedFiles, currentCart, dispatch)}
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
        <div className="flex flex-col gap-y-4 mr-3">
          <LoadingOverlay visible={!dictSuccess} />
          {facets.map((x, index) => {
            return (
              <EnumFacet
                key={`${x.field}-${index}`}
                field={`${x.field}`}
                docType="files"
                indexType="repository"
                showPercent={false}
                description={x.description}
              />
            );
          })}
        </div>
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
  App: DownloadApp,
  id: id,
  name: "Demonstration Application 3",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
  store: AppStore,
  context: AppContext,
});
