import { CartSummaryData } from "@gff/core";
import fileSize from "filesize";
import { Button, Menu } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";

const buttonStyle = "bg-white text-nci-blue-darkest border-nci-blue-darkest";

interface CartHeaderProps {
  summaryData: CartSummaryData;
}

const CartHeader: React.FC<CartHeaderProps> = ({
  summaryData,
}: CartHeaderProps) => (
  <div className="bg-nci-blue-darkest text-white flex items-center gap-x-4 w-full h-16">
    <Menu
      control={
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
      }
    >
      <Menu.Item>Manifest</Menu.Item>
      <Menu.Item>Cart</Menu.Item>
    </Menu>
    <Menu
      control={
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
      }
    >
      <Menu.Item>TSV</Menu.Item>
      <Menu.Item>JSON</Menu.Item>
    </Menu>
    <Menu
      control={
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
      }
    >
      <Menu.Item>TSV</Menu.Item>
      <Menu.Item>JSON</Menu.Item>
    </Menu>
    <Button className={buttonStyle} leftIcon={<DownloadIcon size={20} />}>
      Sample Sheet
    </Button>
    <Button className={buttonStyle} leftIcon={<DownloadIcon size={20} />}>
      Manifest
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

export default CartHeader;
