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
import qs from "qs";
import { Button, Loader, Menu } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import CartSizeLimitModal from "@/components/Modals/CartSizeLimitModal";
import CartDownloadModal from "@/components/Modals/CartDownloadModal";
import download from "src/utils/download";

const buttonStyle =
  "bg-base-lightest text-base-contrast-lightest border-base-darkest";

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
      ?.map((file) => file.fileSize)
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
      options: {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
      dispatch,
      queryParams: JSON.stringify({
        ids: filesByCanAccess.true.map((file) => file.fileId),
        annotations: true,
        related_files: true,
      }),
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
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    dispatch,
    queryParams: JSON.stringify({
      filters: JSON.stringify({
        op: "in",
        content: {
          field: "files.file_id",
          value: cart.map((file) => file.fileId),
        },
      }),
      return_type: "manifest",
      size: 10000,
    }),
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
      <div className="bg-primary-darkest text-primary-contrast-darkest flex items-center gap-x-4 w-full h-16">
        <Menu>
          <Menu.Target>
            <Button
              classNames={{
                root: `${buttonStyle} ml-2`,
                rightIcon: "border-l pl-1 -mr-2",
              }}
              leftIcon={
                downloadActive ? (
                  <Loader size={15} />
                ) : (
                  <DownloadIcon size={20} />
                )
              }
              rightIcon={<DropdownIcon size={20} />}
            >
              Download
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                setDownloadActive(true);
                downloadManifest(cart, setDownloadActive, dispatch);
              }}
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
            >
              Cart
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu>
          <Menu.Target>
            <Button
              classNames={{
                root: `${buttonStyle} ml-2`,
                rightIcon: "border-l pl-1 -mr-2",
              }}
              leftIcon={<DownloadIcon size={20} />}
              rightIcon={<DropdownIcon size={20} />}
            >
              Biospecimen
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>TSV</Menu.Item>
            <Menu.Item>JSON</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu>
          <Menu.Target>
            <Button
              classNames={{
                root: `${buttonStyle} ml-2`,
                rightIcon: "border-l pl-1 -mr-2",
              }}
              leftIcon={<DownloadIcon size={20} />}
              rightIcon={<DropdownIcon size={20} />}
            >
              Clinical
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>TSV</Menu.Item>
            <Menu.Item>JSON</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Button className={buttonStyle} leftIcon={<DownloadIcon size={20} />}>
          Sample Sheet
        </Button>
        <Button className={buttonStyle} leftIcon={<DownloadIcon size={20} />}>
          Metadata
        </Button>
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
