import { NextPage } from "next";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { Image } from "@/components/Image";
import Link from "next/link";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { Button, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";

export const HomePageButton = tw(Button)`
bg-base-lighter text-base-contrast-lighter
hover:bg-primary hover:text-primary-contrast
font-bold mx-4 p-2 rounded inline-flex items-center shadow-md transition-colors
`;

interface SummaryStatsItemProp {
  readonly title: string;
  readonly icon: string;
  readonly count: number;
  readonly size?: number;
}

const SummaryStatsItem: React.FC<SummaryStatsItemProp> = ({
  title,
  icon,
  count,
  size = 24,
}: SummaryStatsItemProp) => {
  return (
    <div className="flex flex-col flex-nowrap font-medium justify-center content-center font-heading ">
      <div className="flex flex-row flex-nowrap justify-center content-center text-md">
        {title}{" "}
      </div>
      <div className="flex flex-row flex-nowrap justify-center content-center text-2xl ">
        <Image src={icon} width={size} height={size} />{" "}
        <span className="pl-2">{count.toLocaleString()}</span>
      </div>
    </div>
  );
};

const SummaryStatsPanel = () => {
  return (
    <div className="flex flex-col bg-base-lightest border-primary border-t-8 border-0 p-4 opacity-90 shadow-md hover:shadow-lg  ">
      <div className="flex flex-row items-end justify-items-end">
        <p className="font-heading text-lg text-base-contrast-lightest">
          Data Portal Summary
        </p>
        <a
          className="text-xs px-4 pb-1 text-accent-cool-content-dark"
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
        >
          Data Release 31.0 - October 29, 2021{" "}
        </a>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 p-4 bg-opacity-0">
        <SummaryStatsItem
          title="PROJECTS"
          count={70}
          size={24}
          icon="/user-flow/icons/projects.svg"
        />
        <SummaryStatsItem
          title="PRIMARY SITES"
          count={67}
          size={24}
          icon="/user-flow/icons/primary_sites.svg"
        />
        <SummaryStatsItem
          title="CASES"
          count={85415}
          size={24}
          icon="/user-flow/icons/user.svg"
        />
        <SummaryStatsItem
          title="FILES"
          count={649152}
          size={24}
          icon="/user-flow/icons/files.svg"
        />
        <SummaryStatsItem
          title="GENES"
          count={23621}
          size={24}
          icon="/user-flow/icons/genes.svg"
        />
        <SummaryStatsItem
          title="MUTATIONS"
          count={3599319}
          size={32}
          icon="/user-flow/icons/gene-mutation.svg"
        />
      </div>
    </div>
  );
};

const ActionButtonBar = () => {
  return (
    <div className="flex flex-col p-4 rounded-md justify-center align-center pb-4 text-sm ">
      <div className="flex flex-grow flex-row justify-center pb-4 text-sm ">
        <Link
          key="Analysis"
          href={{
            pathname: "/user-flow/workbench/analysis_page",
            query: { app: undefined },
          }}
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
                pathname: "/user-flow/workbench/analysis_page",
                query: { app: undefined },
              }}
              className="mx-4 p-2 px-5"
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
          label="View the Studies available within the GDC and select them for further exploration and analysis."
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
              pathname: "/user-flow/workbench/analysis_page",
              query: { app: "Studies" },
            }}
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
              pathname: "/user-flow/workbench/analysis_page",
              query: { app: "CohortBuilder" },
            }}
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
              pathname: "/user-flow/workbench/analysis_page",
              query: { app: "Downloads" },
            }}
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
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/single-page", headerElements }}
    >
      <div className="flex flex-col w-100 h-100 bg-gradient-to-r from-accent-warm  to-accent-cool">
        <div className="flex flex-row ">
          <div className="flex flex-col w-1/2 pl-10">
            <div className="flex flex-col w-100 bg-base p-4 rounded-md shadow-lg mt-2  ">
              <div className="font-montserrat text-base-contrast text-md pt-5 pb-2">
                Harmonized Cancer Datasets
              </div>
              <div className="font-heading text-primary-content-lightest text-2xl pb-5">
                Genomic Data Commons Data Portal
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-auto w-36 m-4 p-4 items-center font-content text-primary-content-darkest rounded-md shadow-inner">
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
                />
              </div>
            </div>
            <SummaryStatsPanel />
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
