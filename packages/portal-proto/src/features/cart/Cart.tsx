import { Grid, Accordion } from "@mantine/core";
import tw from "tailwind-styled-components";
import { MdShoppingCart as CartIcon } from "react-icons/md";
import { MdExpandMore as ExpandMoreIcon } from "react-icons/md";
import {
  useCartSummaryQuery,
  useCoreSelector,
  selectCart,
  useFetchUserDetailsQuery,
} from "@gff/core";
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";
import AuthorizationTable from "./AuthorizationTable";
import { groupByAccess } from "./utils";
import { FaExclamationCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { HeaderTitle } from "@/components/tailwindComponents";

const H2 = tw.h2`
  font-heading
  text-md
  font-bold
  text-sm
`;

const P = tw.p`
  font-content
  font-normal
  text-sm
`;

const Cart: React.FC = () => {
  const cart = useCoreSelector((state) => selectCart(state));
  const { data: summaryData } = useCartSummaryQuery(cart.map((f) => f.file_id));
  const { data: userDetails, isFetching: userDetailsFetching } =
    useFetchUserDetailsQuery();
  const filesByCanAccess = groupByAccess(cart, userDetails?.data);
  const dbGapList = Array.from(
    new Set(
      (filesByCanAccess?.true || [])
        .reduce((acc, f) => acc.concat(f.acl), [])
        .filter((f) => f !== "open"),
    ),
  );

  return cart.length === 0 ? (
    <Grid justify="center" className="bg-base-lightest flex-grow">
      <Grid.Col span={4} className="my-20 flex flex-col items-center">
        <div className="h-40 w-40 rounded-[50%] bg-emptyIconLighterColor flex justify-center items-center">
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
      <div className="mt-4 mx-4 mb-16">
        <Accordion
          variant="contained"
          chevron={<ExpandMoreIcon size="1.75em" />}
          classNames={{
            item: "border-cartDarkerOrange border-l-[3rem]",
            chevron: "text-cartDarkerOrange",
            label: "text-sm font-bold uppercase font-heading py-2 ml-4",
          }}
        >
          <Accordion.Item
            value="howTo"
            className="border border-cartDarkerOrange rounded-none text-secondary-contrast-lighter bg-cartLighterOrange"
          >
            <Accordion.Control
              className="hover:bg-[#FFFFFF50] pl-0 relative"
              data-testid="expand-collapse-button"
            >
              <FaExclamationCircle
                color="white"
                className="h-6 w-6 absolute left-[-2.2rem] top-[0.4rem]"
                aria-label="Warning"
              />
              How to download files in my cart?
            </Accordion.Control>
            <Accordion.Panel>
              <div data-testid="download-info">
                <div className="mb-2">
                  <H2>Download Manifest:</H2>
                  <P>
                    Download a manifest for use with the{" "}
                    <a
                      href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-linkDarkerColor font-bold underline"
                    >
                      <FiExternalLink className="inline" /> GDC Data Transfer
                      Tool
                    </a>
                    . The GDC Data Transfer Tool is recommended for transferring
                    large volumes of data.
                  </P>
                </div>

                <div className="mb-2">
                  <H2>Download Cart:</H2>
                  <P>
                    Download Files in your Cart directly from the Web Browser.
                  </P>
                </div>

                <div className="mb-2">
                  <H2>Download Reference Files:</H2>
                  <P>
                    Download{" "}
                    <a
                      href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-linkDarkerColor font-bold"
                    >
                      <FiExternalLink className="inline" /> GDC Reference Files
                    </a>{" "}
                    for use in your genomic data analysis.
                  </P>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <div className="flex gap-8 mt-4">
          <div className="flex-1">
            <HeaderTitle>File counts by authorization level</HeaderTitle>
            <AuthorizationTable
              customDataTestID="table-authorization"
              filesByCanAccess={filesByCanAccess}
              loading={userDetailsFetching}
            />
          </div>
          <div className="flex-1">
            <HeaderTitle>File counts by project</HeaderTitle>
            <ProjectTable
              customDataTestID="table-count-by-project"
              projectData={summaryData?.byProject}
            />
          </div>
        </div>
        <div className="mt-6">
          <HeaderTitle>Cart Items</HeaderTitle>
          <FilesTable
            customDataTestID="table-cart-items"
            filesByCanAccess={filesByCanAccess}
          />
        </div>
      </div>
    </>
  );
};

export default Cart;
