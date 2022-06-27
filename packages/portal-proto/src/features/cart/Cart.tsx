import { Button, Menu, MenuItem, Grid } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { useCartSummary, useCoreDispatch, fetchCartSummary } from "@gff/core";

const buttonStyle = "bg-white text-nci-blue-darkest border-nci-blue-darkest";

const Cart: React.FC = () => {
  const dispatch = useCoreDispatch();

  dispatch(fetchCartSummary);

  const { data } = useCartSummary();
  console.log(data);

  return (
    <>
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
          Total of <FileIcon /> 0 Files <PersonIcon /> 0 Cases <SaveIcon /> 0 GB
        </h1>
      </div>
      <Grid>
        <Grid.Col span={6} className="p-4">
          <div className="text-nci-blue-darkest bg-white p-2">
            <h2 className="uppercase font-bold pb-2">
              How to download files in my Cart?
            </h2>
            <h3>Download Manifest:</h3>
            <p className="py-2">
              Download a manifest for use with the{" "}
              <a href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool">
                GDC Data Transfer Tool
              </a>
              . The GDC Data Transfer Tool is recommended for transferring large
              volumes of data.
            </p>
            <h3>Download Cart:</h3>
            <p className="py-2">
              Download Files in your Cart directly from the Web Browser.
            </p>
            <h3>Download Reference Files:</h3>
            <p className="py-2">
              Download{" "}
              <a href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files">
                GDC Reference Files
              </a>{" "}
              for use in your genomic data analysis.
            </p>
          </div>
          <div className="pt-2">
            <h2 className="uppercase text-nci-blue-darkest font-bold">
              File counts by authoring level
            </h2>
            <div>TABLE PLACEHOLDER</div>
          </div>
        </Grid.Col>
        <Grid.Col span={6} className="p-4">
          <h2 className="uppercase text-nci-blue-darkest font-bold">
            File counts by project
          </h2>
          <div>TABLE PLACEHOLER</div>
        </Grid.Col>
        <Grid.Col span={12} className="p-4">
          <div className="flex gap-2">
            <Button className={buttonStyle}>JSON</Button>
            <Button className={buttonStyle}>TSV</Button>
            <Menu
              control={
                <Button
                  leftIcon={<TrashIcon />}
                  rightIcon={<DropdownIcon size={20} />}
                  classNames={{
                    root: "bg-nci-red-darker",
                    rightIcon: "border-l pl-1 -mr-2",
                  }}
                >
                  Remove From Cart
                </Button>
              }
            >
              <MenuItem>All Files</MenuItem>
              <MenuItem>Unauthorized Files</MenuItem>
            </Menu>
          </div>
          <div>TABLE PLACEHOLDER</div>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Cart;
