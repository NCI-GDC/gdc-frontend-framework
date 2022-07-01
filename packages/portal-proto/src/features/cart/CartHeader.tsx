import { Button, Menu } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { formatFileSize } from "src/utils";

const buttonStyle = "bg-white text-nci-blue-darkest border-nci-blue-darkest";

const CartHeader = ({ summaryData }) => (
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
    <h1 className="uppercase ml-auto mr-4 flex items-center truncate">
      Total of <FileIcon /> {summaryData.total_doc_count.toLocaleString()} Files{" "}
      <PersonIcon /> {summaryData.total_case_count.toLocaleString()} Cases{" "}
      <SaveIcon /> {formatFileSize(summaryData.total_file_size)}
    </h1>
  </div>
);

export default CartHeader;
