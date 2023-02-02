import SummaryTotalsPanel from "@/features/homepage/SummaryTotalsPanel";
import { Image } from "@/components/Image";
import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";
import HorizontalSummaryTotalsPanel from "@/features/homepage/HorizontalSummaryTotalsPanel";

export const HomePageButton = tw(Button)`
bg-accent-lightest text-accent-contrast-lighter border-base-light border-1
hover:bg-primary-lighter hover:text-primary-lighter-contrast
font-semibold font-heading mx-4 p-2 rounded-md inline-flex items-center shadow-md transition-colors
`;

const Homepage = () => {
  return (
    <div className="flex flex-col w-100 h-100 bg-gradient-to-r from-accent-cool-darker  to-accent-cool">
      <div className="flex flex-row">
        <div className="flex flex-col w-1/2 pl-10">
          <div className="flex flex-col w-100 bg-base-lightest p-4 rounded-md shadow-lg mt-2  ">
            <div className="font-heading  text-primary-darker text-md pt-5 pb-2">
              Harmonized Cancer Datasets
            </div>
            <div className="font-heading font-semibold text-primary-darker text-2xl pb-5">
              Genomic Data Commons Data Portal
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-auto w-36 mt-4 mx-6 mb-8 p-4 items-center font-content bg-base-max text-primary-content-darker rounded-md shadow-inner">
              A repository and knowledge base for cancer researchers who need to
              understand cancer, its clinical progression, and response to
              therapy.
            </div>
          </div>
          <div className="flex items-center w-100 pb-5">
            <div className="w-full">
              <input
                type="text"
                className="h-10 pr-8 w-full pl-5 bg-base-lightest border-primary-light rounded-full focus:outline-none focus:ring focus:ring-accent-cool-light focus:border-accent-cool-light hover:shadow-lg hover:border-accent-cool-lighter"
                placeholder={`e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2`}
                data-testid="input-home-page-search"
              />
            </div>
          </div>
          <HorizontalSummaryTotalsPanel />
        </div>
        <div className="m-auto">
          <Image src="/user-flow/sapien.svg" height={400} width={500} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
