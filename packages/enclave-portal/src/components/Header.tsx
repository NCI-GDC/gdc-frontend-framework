import { FiPlayCircle as PlayIcon } from "react-icons/fi";
import {
  Header as CommonHeader,
  HeaderItem,
  HeaderLinkItem,
} from "@gff/portal-components";
import { Tooltip } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import CohortBuilderIcon from "public/apps/icons/CohortBuilder.svg";
import ProjectsIcon from "public/layout/icons/crowd-of-users.svg";
import DownloadIcon from "public/layout/icons/database.svg";
import AnalysisCenterIcon from "public/layout/icons/dna.svg";
import NIHLogo from "public/NIH_GDC_DataPortal-logo.svg";

const commonLinkClasses =
  "flex items-center gap-1 font-heading text-sm font-medium text-base-darker p-1 mr-2 hover:rounded-md hover:bg-primary-lightest";

export const headerApps = [
  <Tooltip
    key="Analysis"
    label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
    position="bottom-start"
    multiline
    w={220}
    withArrow
  >
    <span>
      <Link
        href={{
          pathname: "/analysis_page",
          query: { app: undefined },
        }}
        className={commonLinkClasses}
        data-testid="button-header-analysis"
      >
        <>
          <AnalysisCenterIcon
            width={24}
            height={24}
            viewBox="0 0 500 500"
            aria-hidden
          />
          Analysis Center
        </>
      </Link>
    </span>
  </Tooltip>,
  <Tooltip
    key="Studies"
    label="View the projects available within the GDC and select them for further exploration and analysis."
    position="bottom-start"
    multiline
    w={220}
    withArrow
  >
    <span>
      <Link
        href={{
          pathname: "/analysis_page",
          query: { app: "Projects" },
        }}
        className={commonLinkClasses}
        data-testid="button-header-projects"
      >
        <>
          <ProjectsIcon
            width={24}
            height={24}
            viewBox="0 -15 100 100"
            aria-hidden
          />
          Projects
        </>
      </Link>
    </span>
  </Tooltip>,
  <Tooltip
    key="Cohort"
    label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
    position="bottom-start"
    multiline
    w={220}
    withArrow
  >
    <span>
      <Link
        href={{
          pathname: "/analysis_page",
          query: { app: "CohortBuilder", tab: "general" },
        }}
        className={commonLinkClasses}
        data-testid="button-header-cohort"
      >
        <>
          <CohortBuilderIcon
            width={24}
            height={24}
            viewBox="0 0 50 50"
            aria-hidden
          />
          Cohort Builder
        </>
      </Link>
    </span>
  </Tooltip>,
  <Tooltip
    key="Download"
    label="Browse and download the files associated with your cohort for more sophisticated analysis."
    position="bottom-start"
    multiline
    w={220}
    withArrow
  >
    <span>
      <Link
        href={{
          pathname: "/analysis_page",
          query: { app: "Downloads" },
        }}
        className={commonLinkClasses}
        data-testid="button-header-downloads"
      >
        <>
          <DownloadIcon
            width={24}
            height={24}
            viewBox="0 0 50 50"
            aria-hidden
          />
          Repository
        </>
      </Link>
    </span>
  </Tooltip>,
];

const headerLinks: HeaderItem[] = [
  {
    customDataTestID: "button-header-video-guides",
    href: "https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Video_Tutorials/",
    image: <PlayIcon size={24} />,
    text: "Video Guides",
    isExternal: true,
  },
];

const externalAppLinks: HeaderLinkItem[] = [
  {
    customDataTestID: "button-header-data-portal",
    href: "/",
    image: (
      <Image
        src="/layout/icons/gdc-app-data-portal-blue.svg"
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Portal",
  },
  {
    customDataTestID: "button-header-website",
    href: "https://gdc.cancer.gov",
    text: "Website",
    image: (
      <Image
        src={"layout/icons/gdc-app-website-blue.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
  },
  {
    customDataTestID: "button-header-api",
    href: "https://gdc.cancer.gov/developers/gdc-application-programming-interface-api",
    image: (
      <Image
        src={"layout/icons/gdc-app-portal-api.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "API",
  },
  {
    customDataTestID: "button-header-data-transfer-tool",
    href: "https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/",
    image: (
      <Image
        src={"layout/icons/gdc-app-data-transfer-tool.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Transfer Tool",
  },
  {
    customDataTestID: "button-header-documentation",
    href: "https://docs.gdc.cancer.gov",
    image: (
      <Image
        src={"layout/icons/gdc-app-docs.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Documentation",
  },
  {
    customDataTestID: "button-header-data-submission-portal",
    href: "https://portal.gdc.cancer.gov/submission",
    image: (
      <Image
        src={"layout/icons/gdc-app-submission-portal.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Data Submission Portal",
  },
  {
    customDataTestID: "button-header-publications",
    href: "https://gdc.cancer.gov/about-data/publications",
    image: (
      <Image
        src={"layout/icons/gdc-app-publications.svg"}
        width={30}
        height={30}
        alt=""
      />
    ),
    text: "Publications",
  },
];

const AppLogo = (
  <NIHLogo
    layout="fill"
    style={{ objectFit: "contain" }}
    data-testid="button-header-home"
    aria-label="NIH GDC Data Portal Home"
    role="img"
  />
);

const Header = () => {
  return (
    <CommonHeader
      headerApps={headerApps}
      headerLinks={headerLinks}
      externalAppLinks={externalAppLinks}
      indexPath="/"
      AppLogo={AppLogo}
    />
  );
};

export default Header;
