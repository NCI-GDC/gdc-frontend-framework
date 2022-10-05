// Depreciated

import { useState } from "react";
import { Button, Menu } from "@mantine/core";
import {
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import {
  GdcFile,
  useFilteredFiles,
  useCoreSelector,
  useCoreDispatch,
  selectCart,
} from "@gff/core";
import EnumFacet from "../facets/EnumFacet";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { mapGdcFileToCartFile } from "./utils";
import tw from "tailwind-styled-components";
import FilesTables from "../repositoryApp/FilesTable";

export const FilesTableHeader = tw.th`
bg-primary-lighter
text-primary-contrast-lighter
px-2
`;

const FileFacetNames = [
  {
    facet_filter: "data_category",
    name: "Data Category",
    description: "No description",
  },
  {
    facet_filter: "data_type",
    name: "Data Type",
    description: "No description",
  },
  {
    facet_filter: "experimental_strategy",
    name: "Experimental Strategy",
    description: "No description",
  },
  {
    facet_filter: "analysis.workflow_type",
    name: "Analysis Workflow Type",
    description: "No description",
  },
  {
    facet_filter: "data_format",
    name: "Data Format",
    description: "No description",
  },
  {
    facet_filter: "platform",
    name: "Platform",
    description: "No description",
  },
  {
    facet_filter: "access",
    name: "Access",
    description: "No description",
  },
];

const buttonStyle =
  "mx-1 text-primary-contrast bg-primary hover:bg-primary-darker transition-colors ";

export const ContextualFilesView: React.FC = () => {
  const { data } = useFilteredFiles();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [selectedFiles] = useState<GdcFile[]>([]);

  // TODO: remove, mock data for cart
  const allFiles = Array(10001)
    .fill(0)
    .map((_, i) => data?.[i % 10]);

  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row justify-end m-2">
        <Menu>
          <Menu.Target>
            <Button className={buttonStyle}>
              <CartIcon size={"1.5rem"} />
              Update Cart
            </Button>
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
        <Button className={buttonStyle}>
          <DownloadIcon size={"1.5rem"} />
          Manifest
        </Button>
        <Link href="/user-flow/workbench/MultipleImageViewerPage" passHref>
          <Button component="a" className={buttonStyle}>
            View Images
          </Button>
        </Link>
      </div>
      <div className="flex flex-row mx-3">
        <div className="flex flex-col gap-y-4 mr-3">
          {FileFacetNames.map((x, index) => {
            return (
              <EnumFacet
                key={`${x.facet_filter}-${index}`}
                field={`${x.facet_filter}`}
                facetName={x.name}
                docType="files"
                showPercent={false}
                description={x.description}
                hooks={{
                  useUpdateFacetFilters: useUpdateFacetFilter,
                  useTotalCounts: useTotalCounts,
                  useClearFilter: useClearFilters,
                  useGetFacetData: useEnumFacet,
                }}
              />
            );
          })}
        </div>
        <FilesView />
      </div>
    </div>
  );
};

// TODO eliminate this??
export const FilesView: React.FC = () => {
  return <FilesTables />;
};
