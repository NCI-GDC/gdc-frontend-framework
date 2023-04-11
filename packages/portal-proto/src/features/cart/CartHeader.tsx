import React, { useState } from "react";
import {
  CartFile,
  CartSummaryData,
  showModal,
  useCoreDispatch,
  CoreDispatch,
  useCoreSelector,
  selectCurrentModal,
  Modals,
  useUserDetails,
} from "@gff/core";
import fileSize from "filesize";
import { Button, Loader, Menu } from "@mantine/core";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import {
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import CartSizeLimitModal from "@/components/Modals/CartSizeLimitModal";
import CartDownloadModal from "@/components/Modals/CartDownloadModal";
import { DownloadButton } from "@/components/DownloadButtons";
import download from "src/utils/download";
import { removeFromCart } from "./updateCart";

const buttonStyle =
  "bg-base-max text-primary border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary text-sm font-normal";

// 5GB
const MAX_CART_SIZE = 5 * 10e8;

const downloadCart = (
  filesByCanAccess: Record<string, CartFile[]>,
  dbGapList: string[],
  setActive: (active: boolean) => void,
  dispatch: CoreDispatch,
) => {
  if (
    filesByCanAccess.true
      ?.map((file) => file.file_size)
      .reduce((a, b) => a + b) > MAX_CART_SIZE
  ) {
    dispatch(showModal({ modal: Modals.CartSizeLimitModal }));
  } else if (
    (filesByCanAccess?.false || []).length > 0 ||
    dbGapList.length > 0
  ) {
    dispatch(showModal({ modal: Modals.CartDownloadModal }));
  } else {
    download({
      endpoint: "data",
      method: "POST",
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      dispatch,
      params: {
        ids: filesByCanAccess.true.map((file) => file.file_id),
        annotations: true,
        related_files: true,
      },
      done: () => setActive(false),
    });
  }
};

const downloadManifest = (
  cart: CartFile[],
  setActive: (active: boolean) => void,
  dispatch: CoreDispatch,
) => {
  download({
    endpoint: "files",
    method: "POST",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    dispatch,
    params: {
      filters: {
        op: "in",
        content: {
          field: "files.file_id",
          value: cart.map((file) => file.file_id),
        },
      },
      return_type: "manifest",
      size: 10000,
    },
    done: () => setActive(false),
  });
};

interface CartHeaderProps {
  summaryData: CartSummaryData;
  cart: CartFile[];
  filesByCanAccess: Record<string, CartFile[]>;
  dbGapList: string[];
}

const CartHeader: React.FC<CartHeaderProps> = ({
  summaryData,
  cart,
  filesByCanAccess,
  dbGapList,
}: CartHeaderProps) => {
  const dispatch = useCoreDispatch();
  const { data: userDetails } = useUserDetails();
  const [downloadActive, setDownloadActive] = useState(false);
  const [metadataDownloadActive, setMetadataDownloadActive] = useState(false);
  const [sampleSheetDownloadActice, setSampleSheetDownloadActive] =
    useState(false);
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  return (
    <>
      {modal === Modals.CartSizeLimitModal && <CartSizeLimitModal openModal />}
      {modal === Modals.CartDownloadModal && (
        <CartDownloadModal
          openModal
          user={userDetails}
          filesByCanAccess={filesByCanAccess}
          dbGapList={dbGapList}
          setActive={setDownloadActive}
        />
      )}
      <div
        className="bg-primary-darkest text-primary-contrast-darkest flex items-center gap-x-4 w-full h-16"
        data-testid="cart-header"
      >
        <Menu width="target">
          <Menu.Target>
            <Button
              classNames={{
                root: `${buttonStyle} ml-2`,
                rightIcon: "border-l pl-1 -mr-2",
              }}
              leftIcon={
                downloadActive ? <Loader size={15} /> : <DownloadIcon />
              }
              rightIcon={<DropdownIcon size={20} />}
            >
              Download Cart
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                setDownloadActive(true);
                downloadManifest(cart, setDownloadActive, dispatch);
              }}
              icon={<DownloadIcon />}
            >
              Manifest
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setDownloadActive(true);
                downloadCart(
                  filesByCanAccess,
                  dbGapList,
                  setDownloadActive,
                  dispatch,
                );
              }}
              icon={<DownloadIcon />}
            >
              Cart
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu width="target">
          <Menu.Target>
            <Button
              classNames={{
                root: buttonStyle,
                rightIcon: "border-l pl-1 -mr-2",
              }}
              leftIcon={
                downloadActive ? <Loader size={15} /> : <DownloadIcon />
              }
              rightIcon={<DropdownIcon size={20} />}
            >
              Download Associated Data
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<DownloadIcon />}>
              Clinical: TSV (Coming soon)
            </Menu.Item>
            <Menu.Item icon={<DownloadIcon />}>
              Clinical: JSON (Coming soon)
            </Menu.Item>
            <Menu.Item icon={<DownloadIcon />}>
              Biospecimen: TSV (Coming soon)
            </Menu.Item>
            <Menu.Item icon={<DownloadIcon />}>
              Biospecimen: JSON (Coming soon)
            </Menu.Item>
            <Menu.Item
              component={DownloadButton}
              classNames={{ inner: "font-normal" }}
              variant="subtle"
              activeText="Processing"
              inactiveText="Sample Sheet"
              preventClickEvent
              showIcon={true}
              endpoint="files"
              setActive={setSampleSheetDownloadActive}
              active={sampleSheetDownloadActice}
              filename={`gdc_sample_sheet.${new Date()
                .toISOString()
                .slice(0, 10)}.tsv`}
              format="tsv"
              method="POST"
              options={{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }}
              fields={[
                "file_id",
                "file_name",
                "data_category",
                "data_type",
                "cases.project.project_id",
                "cases.submitter_id",
                "cases.samples.submitter_id",
                "cases.samples.sample_type",
              ]}
              filters={{
                content: [
                  {
                    content: {
                      field: "files.file_id",
                      value: cart.map((file) => file.file_id),
                    },
                    op: "in",
                  },
                ],
                op: "and",
              }}
              extraParams={{
                tsv_format: "sample-sheet",
              }}
            />
            <Menu.Divider />
            <Menu.Item
              component={DownloadButton}
              classNames={{ inner: "font-normal" }}
              activeText="Processing"
              inactiveText="Metadata"
              showIcon={true}
              variant="subtle"
              preventClickEvent
              endpoint="files"
              setActive={setMetadataDownloadActive}
              active={metadataDownloadActive}
              filename={`metadata.cart.${new Date()
                .toISOString()
                .slice(0, 10)}.json`}
              options={{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }}
              method="POST"
              filters={{
                content: [
                  {
                    content: {
                      field: "files.file_id",
                      value: cart.map((file) => file.file_id),
                    },
                    op: "in",
                  },
                ],
                op: "and",
              }}
              fields={[
                "state",
                "access",
                "md5sum",
                "data_format",
                "data_type",
                "data_category",
                "file_name",
                "file_size",
                "file_id",
                "platform",
                "experimental_strategy",
                "center.short_name",
                "annotations.annotation_id",
                "annotations.entity_id",
                "tags",
                "submitter_id",
                "archive.archive_id",
                "archive.submitter_id",
                "archive.revision",
                "associated_entities.entity_id",
                "associated_entities.entity_type",
                "associated_entities.case_id",
                "analysis.analysis_id",
                "analysis.workflow_type",
                "analysis.updated_datetime",
                "analysis.input_files.file_id",
                "analysis.metadata.read_groups.read_group_id",
                "analysis.metadata.read_groups.is_paired_end",
                "analysis.metadata.read_groups.read_length",
                "analysis.metadata.read_groups.library_name",
                "analysis.metadata.read_groups.sequencing_center",
                "analysis.metadata.read_groups.sequencing_date",
                "downstream_analyses.output_files.access",
                "downstream_analyses.output_files.file_id",
                "downstream_analyses.output_files.file_name",
                "downstream_analyses.output_files.data_category",
                "downstream_analyses.output_files.data_type",
                "downstream_analyses.output_files.data_format",
                "downstream_analyses.workflow_type",
                "downstream_analyses.output_files.file_size",
                "index_files.file_id",
              ]}
              extraParams={{
                expand: [
                  "metadata_files",
                  "annotations",
                  "archive",
                  "associated_entities",
                  "center",
                  "analysis",
                  "analysis.input_files",
                  "analysis.metadata",
                  "analysis.metadata_files",
                  "analysis.downstream_analyses",
                  "analysis.downstream_analyses.output_files",
                  "reference_genome",
                  "index_file",
                ].join(","),
              }}
            />
          </Menu.Dropdown>
        </Menu>
        <Menu>
          <Menu.Target>
            <Button
              leftIcon={<TrashIcon />}
              rightIcon={<DropdownIcon size={20} />}
              classNames={{
                root: "bg-nci-red-darker", //TODO: find good color theme for this
                rightIcon: "border-l pl-1 -mr-2",
              }}
            >
              Remove From Cart
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => removeFromCart(cart, cart, dispatch)}>
              All Files ({cart.length})
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                removeFromCart(filesByCanAccess?.false || [], cart, dispatch)
              }
            >
              Unauthorized Files ({(filesByCanAccess?.false || []).length})
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <h1 className="uppercase ml-auto mr-4 flex items-center truncate text-2xl">
          Total of <FileIcon size={25} className="ml-2 mr-1" />{" "}
          <b className="mr-1">{summaryData.total_doc_count.toLocaleString()}</b>{" "}
          {summaryData.total_doc_count === 1 ? "File" : "Files"}
          <PersonIcon size={25} className="ml-2 mr-1" />{" "}
          <b className="mr-1">
            {summaryData.total_case_count.toLocaleString()}
          </b>{" "}
          {summaryData.total_case_count === 1 ? "Case" : "Cases"}{" "}
          <SaveIcon size={25} className="ml-2 mr-1" />{" "}
          {fileSize(summaryData.total_file_size)}
        </h1>
      </div>
    </>
  );
};

export default CartHeader;
