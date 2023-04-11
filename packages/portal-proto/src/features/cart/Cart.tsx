import { ActionIcon, Grid } from "@mantine/core";
import tw from "tailwind-styled-components";
import { MdShoppingCart as CartIcon } from "react-icons/md";
import {
  MdExpandLess as ExpandLessIcon,
  MdExpandMore as ExpandMoreIcon,
} from "react-icons/md";
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
import { FaExclamationCircle } from "react-icons/fa";
import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { HeaderTitle } from "../shared/tailwindComponents";

const H3 = tw.h3`
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
  const [isCollapsed, setIsCollapsed] = useState(true);
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
      <div className="mt-4 mx-4 mb-16">
        <div
          className={`${
            isCollapsed ? "h-10" : ""
          } flex border border-[#C7501A] text-secondary-contrast-lighter`}
        >
          <div
            className={`flex w-12 bg-[#C7501A] justify-center ${
              isCollapsed ? "items-center" : "pt-[7px]"
            } `}
          >
            <FaExclamationCircle color="white" className="h-6 w-6" />
          </div>
          <div
            className={`bg-[#C7501A33] w-full h-full pl-4 ${
              isCollapsed ? "flex items-center" : "pt-[7px]"
            }`}
          >
            <span className="text-sm font-bold uppercase font-heading">
              How to download files in my cart?
            </span>
            {!isCollapsed && (
              <div data-testid="download-info">
                <div className="mb-2">
                  <H3>Download Manifest:</H3>
                  <P>
                    Download a manifest for use with the{" "}
                    <a
                      href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D6796] font-bold underline"
                    >
                      <FiExternalLink className="inline" /> GDC Data Transfer
                      Tool
                    </a>
                    . The GDC Data Transfer Tool is recommended for transferring
                    large volumes of data.
                  </P>
                </div>

                <div className="mb-2">
                  <H3>Download Cart:</H3>
                  <P>
                    Download Files in your Cart directly from the Web Browser.
                  </P>
                </div>

                <div className="mb-2">
                  <H3>Download Reference Files:</H3>
                  <P>
                    Download{" "}
                    <a
                      href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[#1D6796] font-bold"
                    >
                      <FiExternalLink className="inline" /> GDC Reference Files
                    </a>{" "}
                    for use in your genomic data analysis.
                  </P>
                </div>
              </div>
            )}
          </div>
          <div
            className={`bg-[#C7501A33] ${
              isCollapsed ? "flex items-center" : ""
            }`}
          >
            <ActionIcon
              variant="transparent"
              className="text-[#C7501A] hover:cursor-pointer rounded-none mr-4"
              onClick={() => setIsCollapsed(!isCollapsed)}
              data-testid="expand-collapse-button"
              aria-label={
                isCollapsed ? "expand more button" : "collapse button"
              }
            >
              {isCollapsed ? (
                <ExpandMoreIcon size="1.75em" aria-label="expand more icon" />
              ) : (
                <ExpandLessIcon size="1.75em" aria-label="collapse icon" />
              )}
            </ActionIcon>
          </div>
        </div>

        <div className="flex gap-8 mt-4">
          <div className="flex-1">
            <HeaderTitle>File counts by authorization level</HeaderTitle>
            <AuthorizationTable filesByCanAccess={filesByCanAccess} />
          </div>
          <div className="flex-1">
            <HeaderTitle>File counts by project</HeaderTitle>
            <ProjectTable projectData={summaryData} />
          </div>
        </div>
        <div className="mt-6">
          <HeaderTitle>Cart Items</HeaderTitle>
          <FilesTable filesByCanAccess={filesByCanAccess} />
        </div>
      </div>
    </>
  );
};

export default Cart;
