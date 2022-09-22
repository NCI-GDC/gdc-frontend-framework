import { Grid } from "@mantine/core";
import tw from "tailwind-styled-components";
import {
  useCartSummary,
  useCoreSelector,
  selectCart,
  selectCurrentModal,
  Modals,
  useUserDetails,
} from "@gff/core";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";
import AuthorizationTable from "./AuthorizationTable";
import CartSizeLimitModal from "@/components/Modals/CartSizeLimitModal";
import CartDownloadModal from "@/components/Modals/CartDownloadModal";
import { groupByAccess } from "./utils";

const H2 = tw.h2`
  uppercase
  text-primary-content-darkest
  font-montserrat
  text-xl
  font-medium
  pb-2
`;

const H3 = tw.h3`
  text-primary-content-darkest
  font-montserrat
  text-xl
  font-normal
`;

const P = tw.p`
  pt-2
  pb-4
  font-montserrat
  text-primary-content-darkest
`;

const Cart: React.FC = () => {
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: summaryData } = useCartSummary(cart.map((f) => f.fileId));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const { data: userDetails } = useUserDetails();
  const filesByCanAccess = groupByAccess(cart, userDetails);

  const dbGapList = Array.from(
    new Set(
      filesByCanAccess?.true
        .reduce((acc, f) => acc.concat(f.acl), [])
        .filter((f) => f !== "open"),
    ),
  );

  return (
    <>
      {modal === Modals.CartSizeLimitModal && <CartSizeLimitModal openModal />}
      {modal === Modals.UnauthorizedFilesModal && (
        <CartDownloadModal
          openModal
          user={userDetails}
          filesByCanAccess={filesByCanAccess}
          dbGapList={dbGapList}
        />
      )}

      <CartHeader
        summaryData={summaryData}
        filesByCanAccess={filesByCanAccess}
        dbGapList={dbGapList}
      />
      <Grid className="mt-8 mx-2">
        <Grid.Col span={6}>
          <div className="bg-base-lightest p-4 border border-solid border-base-lighter">
            <H2>How to download files in my Cart?</H2>
            <H3>Download Manifest:</H3>
            <P>
              Download a manifest for use with the{" "}
              <a
                href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-content"
              >
                GDC Data Transfer Tool
              </a>
              . The GDC Data Transfer Tool is recommended for transferring large
              volumes of data.
            </P>
            <H3>Download Cart:</H3>
            <P>Download Files in your Cart directly from the Web Browser.</P>
            <H3>Download Reference Files:</H3>
            <P>
              Download{" "}
              <a
                href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-content"
              >
                GDC Reference Files
              </a>{" "}
              for use in your genomic data analysis.
            </P>
          </div>
          <div className="pt-5">
            <H2>File counts by authorization level</H2>
            <AuthorizationTable filesByCanAccess={filesByCanAccess} />
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
