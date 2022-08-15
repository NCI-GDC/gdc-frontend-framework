import { useState } from "react";
import fileSize from "filesize";
import { Table, Button, Select, Pagination, Menu, Text } from "@mantine/core";
import {
  MdLock as LockedIcon,
  MdLockOpen as OpenIcon,
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
import { EnumFacet } from "../facets/EnumFacet";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import Link from "next/link";
import { mapGdcFileToCartFile } from "./utils";
import tw from "tailwind-styled-components";

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

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
  "mx-1 text-primary-content-lightest bg-primary hover:bg-primary-darker transition-colors ";

export const ContextualFilesView: React.FC<ContextualFilesViewProps> = ({
  handleFileSelected,
}: ContextualFilesViewProps) => {
  const { data } = useFilteredFiles();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [selectedFiles, setSelectedFiles] = useState<GdcFile[]>([]);

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
        <Link href="/user-flow/workbench/MultipleImageViewerPage">
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

export interface FilesViewProps {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly handleFileSelected?: (file: GdcFile) => void;
  readonly handleCheckedFiles?: (e, file: GdcFile) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files = [],
  handleCheckedFiles = () => void 0,
}: FilesViewProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);
  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };
  return (
    <div className="flex flex-col w-full gap-y-4">
      <Table verticalSpacing="xs" striped highlightOnHover>
        <thead>
          <tr className="bg-base-light text-primary-content-min text-headind border border-base-light">
            <FilesTableHeader>
              <input type="checkbox" />
            </FilesTableHeader>
            <FilesTableHeader>Access</FilesTableHeader>
            <FilesTableHeader>File</FilesTableHeader>
            <FilesTableHeader>Experimental Strategy</FilesTableHeader>
            <FilesTableHeader>Data Category</FilesTableHeader>
            <FilesTableHeader>Data Format</FilesTableHeader>
            <FilesTableHeader>File Size</FilesTableHeader>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckedFiles(e, file)}
                />
              </td>
              <td className="flex flex-row items-center flex-nowrap">
                {file.access === "open" ? (
                  <OpenIcon className="pr-1" />
                ) : (
                  <LockedIcon className="pr-1" />
                )}
                {file.access}
              </td>
              <td className="px-2">
                <Link
                  href={{
                    pathname: "/files/[slug]",
                    query: { slug: file.id },
                  }}
                  passHref
                >
                  <Text variant="link" component="a">
                    {file.fileName}
                  </Text>
                </Link>
              </td>
              <td className="px-2">{file.experimentalStrategy}</td>
              <td className="px-2">{file.dataCategory}</td>
              <td className="px-2">{file.dataFormat}</td>
              <td className="px-2">{fileSize(file.fileSize)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex flex-row items-center justify-start border-t border-base-light">
        <p className="px-2">Page Size:</p>
        <Select
          size="sm"
          radius="md"
          onChange={handlePageSizeChange}
          value={pageSize.toString()}
          data={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "40", label: "40" },
            { value: "100", label: "100" },
          ]}
        />
        <Pagination
          size="sm"
          radius="md"
          color="secondary"
          className="ml-auto"
          page={activePage}
          onChange={setPage}
          total={pages}
        />
      </div>
    </div>
  );
};
