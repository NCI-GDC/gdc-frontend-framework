import { Button, Menu, MenuItem, Grid } from "@mantine/core";
import { MdArrowDropDown as DropdownIcon } from "react-icons/md";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import {
  useCartSummary,
  useCoreSelector,
  selectCart,
  useCartFilesTable,
  useCoreDispatch,
} from "@gff/core";
import { removeFromCart } from "./updateCart";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";

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
      <CartHeader summaryData={summaryData} />
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
          <ProjectTable projectData={summaryData.byProject} />
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
