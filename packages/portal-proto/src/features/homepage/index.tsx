import { Image } from "@/components/Image";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";
import HorizontalSummaryTotalsPanel from "@/features/homepage/HorizontalSummaryTotalsPanel";

export const HomepageButton = tw(NextLink)`
bg-primary text-base-max border-base-light grow-0 border-1
hover:bg-primary-darker hover:text-primary-darker-contrast
font-medium font-heading rounded flex flex-col justify-center items-center text-sm w-60 h-12 mt-4
`;

const Homepage = (): JSX.Element => {
  return (
    <div className="flex flex-col w-100 h-100 bg-base-max">
      <div className="flex flex-row bg-hero-pattern bg-no-repeat bg-cover">
        <div className="flex flex-col pl-7">
          <div className="flex flex-col mt-12">
            <div className="font-heading tracking-[.03em] font-bold text-primary-darkest text-[2.4rem] pt-5">
              Genomic Data Commons
            </div>
            <div className="font-heading tracking-[.03em] font-medium text-primary-darkest text-[2.4rem] pb-5 -mt-4">
              Data Portal
            </div>

            <div className="mt-2 items-center font-heading font-bold text-md text-summarybar-text">
              Harmonized Cancer Datasets
            </div>
            <div className="items-center tracking-wide text-content-noto text-primary-content-darkest w-[75%]">
              A repository and computational platform for cancer researchers who
              need to understand cancer, its clinical progression, and response
              to therapy.
            </div>
          </div>

          <HomepageButton
            href={{
              pathname: "/analysis_page",
              query: { app: undefined },
            }}
            data-testid="button-homepage-explore-datasets"
          >
            Explore Our Cancer Datasets
          </HomepageButton>
          <HorizontalSummaryTotalsPanel />
          <div className="py-10" />
        </div>
        <div className="m-auto">
          <Image src="/user-flow/sapien.svg" height={600} width={700} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
