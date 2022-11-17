import { Grid } from "@mantine/core";
import tw from "tailwind-styled-components";
import { MdShoppingCart as CartIcon } from "react-icons/md";

import {
  useCartSummary,
  useCoreSelector,
  selectCart,
  useUserDetails,
} from "@gff/core";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";
import AuthorizationTable from "./AuthorizationTable";
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
  const { data: summaryData } = useCartSummary(cart.map((f) => f.file_id));
  const { data: userDetails } = useUserDetails();
  const filesByCanAccess = groupByAccess(cart, userDetails);
  const dbGapList = Array.from(
    new Set(
      (filesByCanAccess?.true || [])
        .reduce((acc, f) => acc.concat(f.acl), [])
        .filter((f) => f !== "open"),
    ),
  );

  return cart.length === 0 ? (
    <Grid justify="center" className="bg-base-lightest flex-grow">
      <Grid.Col span={4} className="mt-20 flex flex-col items-center">
        <div className="h-[150px] w-[150px] rounded-[50%] bg-[#e0e9f0] flex justify-center items-center">
          <CartIcon size={80} className="text-primary-darkest" />
        </div>
        <p className="uppercase text-primary-darkest text-2xl font-montserrat mt-4">
          Your cart is empty.
        </p>
      </Grid.Col>
    </Grid>
  ) : (
    <>
      <CartHeader
        summaryData={summaryData}
        cart={cart}
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
          <FilesTable filesByCanAccess={filesByCanAccess} />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Cart;
