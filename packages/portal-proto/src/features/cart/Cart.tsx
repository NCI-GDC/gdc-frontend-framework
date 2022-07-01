import { Button, Menu, MenuItem, Grid } from "@mantine/core";
import {
  MdOutlineFileDownload as DownloadIcon,
  MdArrowDropDown as DropdownIcon,
  MdPerson as PersonIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import {
  useCartSummary,
  useCoreSelector,
  selectCart,
  useCartFilesTable,
  useCoreDispatch,
} from "@gff/core";
import { formatFileSize } from "src/utils";
import { removeFromCart } from "./updateCart";
import FilesTable from "./FilesTable";

const buttonStyle = "bg-white text-nci-blue-darkest border-nci-blue-darkest";

const Cart: React.FC = () => {
  const dispatch = useCoreDispatch();
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: summaryData } = useCartSummary(cart);
  const { data: tableData } = useCartFilesTable({
    cart,
    size: 20,
    offset: 0,
    sort: [],
  });

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
          Total of <FileIcon /> {summaryData.total_doc_count.toLocaleString()}{" "}
          Files <PersonIcon /> {summaryData.total_case_count.toLocaleString()}{" "}
          Cases <SaveIcon /> {formatFileSize(summaryData.total_file_size)}
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
              <a href="https://gdc.cancer.gov/access-summaryData/gdc-data-transfer-tool">
                GDC summaryData Transfer Tool
              </a>
              . The GDC summaryData Transfer Tool is recommended for
              transferring large volumes of summaryData.
            </p>
            <h3>Download Cart:</h3>
            <p className="py-2">
              Download Files in your Cart directly from the Web Browser.
            </p>
            <h3>Download Reference Files:</h3>
            <p className="py-2">
              Download{" "}
              <a href="https://gdc.cancer.gov/about-summaryData/gdc-data-processing/gdc-reference-files">
                GDC Reference Files
              </a>{" "}
              for use in your genomic summaryData analysis.
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

          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Cases</th>
                <th>Files</th>
                <th>File Size</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.byProject.map((project) => (
                <tr>
                  <td>{project.key}</td>
                  <td>{project.case_count}</td>
                  <td>{project.doc_count}</td>
                  <td>{formatFileSize(project.file_size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <MenuItem
                onClick={() => removeFromCart(tableData, cart, dispatch)}
              >
                All Files
              </MenuItem>
              <MenuItem>Unauthorized Files</MenuItem>
            </Menu>
          </div>
          <FilesTable />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Cart;
