import { NextPage } from "next";
import Head from "next/head";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { Image } from "@/components/Image";
import Link from "next/link";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { Button, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";
import SummaryTotalsPanel from "@/features/summary/SummaryTotalsPanel";

export const HomePageButton = tw(Button)`
bg-accent-lightest text-accent-contrast-lighter border-base-light border-1
hover:bg-primary-lighter hover:text-primary-lighter-contrast
font-semibold font-heading mx-4 p-2 rounded-md inline-flex items-center shadow-md transition-colors
`;

const ActionButtonBar = () => {
  return (
    <div className="flex flex-col p-4 rounded-md justify-center align-center pb-4 text-sm ">
      <div className="flex flex-grow flex-row justify-center pb-4 text-sm ">
        <Link
          key="Analysis"
          href={{
            pathname: "/analysis_page",
            query: { app: undefined },
          }}
          passHref
        >
          <Tooltip
            label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
            classNames={{
              tooltip: "shadow-lg bg-base-lightest text-base-contrast-lightest",
            }}
            position="right-start"
            multiline
            width={220}
          >
            <HomePageButton
              unstyled
              component={NextLink}
              href={{
                pathname: "/",
                query: { app: undefined },
              }}
              className="mx-4 p-2 px-5"
              data-testid="button-home-page-analysis-center"
            >
              <div className="flex flex-row items-center">
                <Image
                  src={"/user-flow/icons/dna.svg"}
                  width={42}
                  height={42}
                  alt="Analysis Center Card"
                />{" "}
                <span className="px-4">Analysis Center</span>
              </div>
            </HomePageButton>
          </Tooltip>
        </Link>
      </div>
      <div className="flex flex-grow flex-row justify-center  align-center pb-4 text-sm ">
        <Tooltip
          label="View the Projects available within the GDC and select them for further exploration and analysis."
          classNames={{
            tooltip: "shadow-lg bg-base-lightest text-base-contrast-lightest",
          }}
          position="bottom-start"
          multiline
          width={220}
        >
          <HomePageButton
            unstyled
            component={NextLink}
            href={{
              pathname: "/analysis_page",
              query: { app: "Projects" },
            }}
            data-testid="button-home-page-studies"
          >
            <Image
              src={"/user-flow/icons/crowd-of-users.svg"}
              width={36}
              height={36}
              alt="Studies Card"
            />{" "}
            <span> </span>
          </HomePageButton>
        </Tooltip>
        <Tooltip
          label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
          classNames={{
            tooltip: "shadow-lg bg-base-lightest text-base-contrast-lightest",
          }}
          position="bottom-start"
          multiline
          width={220}
        >
          <HomePageButton
            unstyled
            component={NextLink}
            href={{
              pathname: "/analysis_page",
              query: { app: "CohortBuilder" },
            }}
            data-testid="button-home-page-cohort"
          >
            <Image
              src={"/user-flow/icons/build.svg"}
              width={36}
              height={36}
              alt="Cohort Card"
            />
            <span />
          </HomePageButton>
        </Tooltip>

        <Tooltip
          label="Browse and download the files associated with your cohort for more sophisticated analysis."
          classNames={{
            tooltip: "shadow-lg bg-base-lightest text-base-contrast-lightest",
          }}
          position="bottom-start"
          multiline
          width={220}
        >
          <HomePageButton
            unstyled
            component={NextLink}
            href={{
              pathname: "/analysis_page",
              query: { app: "Downloads" },
            }}
            data-testid="button-home-page-downloads"
          >
            <Image
              src={"/user-flow/icons/database.svg"}
              width={36}
              height={36}
              alt="Downloads Card"
            />{" "}
            <span> </span>
          </HomePageButton>
        </Tooltip>
      </div>
    </div>
  );
};

const IndexPage: NextPage = () => {
  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>GDC Data Portal Homepage</title>
        <meta
          property="og:title"
          content="GDC Data Portal Homepage"
          key="gdc-homepage"
        />
      </Head>
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
                A repository and knowledge base for cancer researchers who need
                to understand cancer, its clinical progression, and response to
                therapy.
              </div>
              <ActionButtonBar />
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
            <SummaryTotalsPanel />
          </div>
          <div className="m-auto">
            <Image src="/user-flow/sapien.svg" height={400} width={500} />
          </div>
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default IndexPage;
