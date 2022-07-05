import { Grid } from "@mantine/core";
import { useCartSummary, useCoreSelector, selectCart } from "@gff/core";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";

const Cart: React.FC = () => {
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: summaryData } = useCartSummary(cart);

  return (
    <>
      <CartHeader summaryData={summaryData} />
      <Grid className="mt-8 mx-2">
        <Grid.Col span={6}>
          <div className="text-nci-blue-darkest bg-white p-4">
            <h2 className="uppercase font-bold pb-2">
              How to download files in my Cart?
            </h2>
            <h3>Download Manifest:</h3>
            <p className="py-2">
              Download a manifest for use with the{" "}
              <a
                href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                target="_blank"
                rel="noopener noreferrer"
              >
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
              <a
                href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                target="_blank"
                rel="noopener noreferrer"
              >
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
        <Grid.Col span={6} className="px-4">
          <h2 className="uppercase text-nci-blue-darkest font-bold">
            File counts by project
          </h2>
          <ProjectTable projectData={summaryData.byProject} />
        </Grid.Col>
        <Grid.Col span={12} className="p-4">
          <FilesTable />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Cart;
