import { Grid } from "@mantine/core";
import tw from "tailwind-styled-components";
import { useCartSummary, useCoreSelector, selectCart } from "@gff/core";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";
import AuthorizationTable from "./AuthorizationTable";

const H2 = tw.h2`
  uppercase
  text-nci-blue-darkest
  font-montserrat
  text-lg
  font-medium
  pb-2
`;

const H3 = tw.h3`
  text-nci-blue-darkest
  font-montserrat
  text-lg
`;

const Cart: React.FC = () => {
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: summaryData } = useCartSummary(cart.map((f) => f.fileId));

  return (
    <>
      <CartHeader summaryData={summaryData} />
      <Grid className="mt-8 mx-2">
        <Grid.Col span={6}>
          <div className="bg-white p-4">
            <H2>How to download files in my Cart?</H2>
            <H3>Download Manifest:</H3>
            <p className="pt-1 pb-2">
              Download a manifest for use with the{" "}
              <a
                href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-nci-blue"
              >
                GDC Data Transfer Tool
              </a>
              . The GDC Data Transfer Tool is recommended for transferring large
              volumes of data.
            </p>
            <H3>Download Cart:</H3>
            <p className="pt-1 pb-2">
              Download Files in your Cart directly from the Web Browser.
            </p>
            <H3>Download Reference Files:</H3>
            <p className="pt-1 pb-2">
              Download{" "}
              <a
                href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                target="_blank"
                rel="noopener noreferrer"
                className="text-nci-blue"
              >
                GDC Reference Files
              </a>{" "}
              for use in your genomic data analysis.
            </p>
          </div>
          <div className="pt-2">
            <H2>File counts by authorization level</H2>
            <AuthorizationTable cart={cart} />
          </div>
        </Grid.Col>
        <Grid.Col span={6} className="px-4">
          <H2>File counts by project</H2>
          <ProjectTable projectData={summaryData} />
        </Grid.Col>
        <Grid.Col span={12} className="p-4">
          <FilesTable />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Cart;
