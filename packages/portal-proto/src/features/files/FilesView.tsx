import { GdcFile, useFilteredFiles } from "@gff/core";
import { Table, Button, Select, Pagination } from "@mantine/core";
import fileSize from "filesize";
import {
  MdLock as LockedIcon,
  MdLockOpen as OpenIcon,
  MdDownload as DownloadIcon,
  MdShoppingCart as CartIcon,
} from "react-icons/md";
import { useState } from "react";
import { EnumFacet } from "../facets/EnumFacet";
import Link from "next/link";

export interface ContextualFilesViewProps {
  readonly handleFileSelected?: (file: GdcFile) => void;
}

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
  "mx-1 bg-nci-gray-light hover:bg-nci-gray transition-colors";

export const ContextualFilesView: React.FC<ContextualFilesViewProps> = ({
  handleFileSelected,
}: ContextualFilesViewProps) => {
  const { data } = useFilteredFiles();
  return (
    <div className="flex flex-col mt-4 ">
      <div className="flex flex-row justify-end m-2">
        <Button className={buttonStyle}>
          <CartIcon size={"1.5rem"} />
          Add All Files to Cart
        </Button>
        <Button className={buttonStyle}>
          <DownloadIcon size={"1.5rem"} />
          Manifest
        </Button>
        <Link href="/user-flow/workbench/imageViewer">
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
                type="files"
                showPercent={false}
                valueLabel="Files"
                description={x.description}
              />
            );
          })}
        </div>
        <FilesView files={data} handleFileSelected={handleFileSelected} />
      </div>
    </div>
  );
};

export interface FilesViewProps {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly handleFileSelected?: (file: GdcFile) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files = [],
  handleFileSelected = () => void 0,
}: FilesViewProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const [pages] = useState(10);
  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };
  return (
    <div className="flex flex-col gap-y-4">
      <Table verticalSpacing="xs" striped highlightOnHover>
        <thead>
          <tr className="bg-nci-gray-light text-white text-md text-montserrat border border-nci-gray-light">
            <th className="px-2">
              <input type="checkbox" />
            </th>
            <th
              className="px-2 th-nci-gray-lightest"
              style={{ color: "#FFFFFF" }}
            >
              File
            </th>
            <th className="px-2 " style={{ color: "#FFFFFF" }}>
              Access
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Experimental Strategy
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Data Category
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              Data Format
            </th>
            <th className="px-2" style={{ color: "#FFFFFF" }}>
              File Size
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-2">
                <input type="checkbox" />
              </td>
              <td className="flex flex-row items-center flex-nowrap">
                {file.access === "open" ? (
                  <OpenIcon className="pr-1" />
                ) : (
                  <LockedIcon className="pr-1" />
                )}
                {file.access}
              </td>
              <td className="px-2 break-all">
                <button onClick={() => handleFileSelected(file)}>
                  {file.fileName}
                </button>
              </td>
              <td className="px-2">{file.experimentalStrategy}</td>
              <td className="px-2">{file.dataCategory}</td>
              <td className="px-2">{file.dataFormat}</td>
              <td className="px-2">{fileSize(file.fileSize)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex flex-row items-center justify-start border-t border-nci-gray-light">
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
          classNames={{
            active: "bg-nci-gray",
          }}
          size="sm"
          radius="md"
          color="gray"
          className="ml-auto"
          page={activePage}
          onChange={setPage}
          total={pages}
        />
      </div>
    </div>
  );
};
