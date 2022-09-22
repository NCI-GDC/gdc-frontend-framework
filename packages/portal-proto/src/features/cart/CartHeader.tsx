import {
  CartFile,
  CartSummaryData,
  useUserDetails,
  showModal,
  Modals,
  useCoreDispatch,
  UserInfo,
  CoreDispatch,
} from "@gff/core";
import fileSize from "filesize";
import { Button, Menu } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { groupByAccess } from "./utils";

const buttonStyle =
  "bg-base-lightest text-base-contrast-lightest border-base-darkest";

// 5GB
const MAX_CART_SIZE = 5 * 10e8;

const downloadCart = (
  filesByCanAccess: Record<string, CartFile[]>,
  dbGapList: string[],
  dispatch: CoreDispatch,
) => {
  if (
    filesByCanAccess.true
      ?.map((file) => file.fileSize)
      .reduce((a, b) => a + b) > MAX_CART_SIZE
  ) {
    dispatch(showModal({ modal: Modals.CartSizeLimitModal }));
  } else if (filesByCanAccess.false.length > 0 || dbGapList.length > 0) {
    dispatch(showModal({ modal: Modals.UnauthorizedFilesModal }));
  } else {
    // TODO: download
  }
};

interface CartHeaderProps {
  summaryData: CartSummaryData;
  filesByCanAccess: Record<string, CartFile[]>;
  dbGapList: string[];
}

const CartHeader: React.FC<CartHeaderProps> = ({
  summaryData,
  filesByCanAccess,
  dbGapList,
}: CartHeaderProps) => {
  const dispatch = useCoreDispatch();

  return (
    <div className="bg-primary-darkest text-primary-contrast-darkest flex items-center gap-x-4 w-full h-16">
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
            Download
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Manifest</Menu.Item>
          <Menu.Item
            onClick={() => downloadCart(filesByCanAccess, dbGapList, dispatch)}
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
        Total of <FileIcon size={25} className="mx-2" />{" "}
        <b className="mr-2">{summaryData.total_doc_count.toLocaleString()}</b>{" "}
        {summaryData.total_doc_count === 1 ? "File" : "Files"}
        <PersonIcon size={25} className="mx-2" />{" "}
        <b className="mr-2">{summaryData.total_case_count.toLocaleString()}</b>{" "}
        {summaryData.total_case_count === 1 ? "Case" : "Cases"}{" "}
        <SaveIcon size={25} className="mx-2" />{" "}
        {fileSize(summaryData.total_file_size)}
      </h1>
    </div>
  );
};

export default CartHeader;
