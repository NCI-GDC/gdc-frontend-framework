import { Tooltip } from "@mantine/core";
import tw from "tailwind-styled-components";
import AnalysisCenterIcon from "public/user-flow/icons/dna.svg";
import ProjectsIcon from "public/user-flow/icons/crowd-of-users.svg";
import CohortBuilderIcon from "public/user-flow/icons/apps/CohortBuilder.svg";
import DownloadIcon from "public/user-flow/icons/database.svg";
import Link from "next/link";

const NavLink = tw.a`
flex
items-center
gap-1
font-heading
text-sm
font-medium
text-base-darker
p-1
mr-2
hover:rounded-md 
hover:bg-primary-lightest
`;

export const headerElements = [
  <Tooltip
    key="Analysis"
    label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
    position="bottom-start"
    multiline
    width={220}
    withArrow
  >
    <Link
      href={{
        pathname: "/analysis_page",
        query: { app: undefined },
      }}
      data-testid="button-header-analysis"
      aria-label="analysis center button"
      className="cursor-pointer"
      passHref
    >
      <NavLink
        data-testid="button-header-analysis"
        aria-label="analysis center button"
      >
        <AnalysisCenterIcon
          aria-label="Analysis logo"
          width={24}
          height={24}
          viewBox="0 0 500 500"
          role="img"
        />
        Analysis Center
      </NavLink>
    </Link>
  </Tooltip>,
  <Tooltip
    key="Studies"
    label="View the projects available within the GDC and select them for further exploration and analysis."
    position="bottom-start"
    multiline
    width={220}
    withArrow
  >
    <Link
      href={{
        pathname: "/analysis_page",
        query: { app: "Projects" },
      }}
      className="cursor-pointer"
      passHref
    >
      <NavLink
        data-testid="button-header-projects"
        aria-label="project/studies center button"
      >
        <ProjectsIcon
          aria-label="Studies logo"
          width={24}
          height={24}
          viewBox="0 -15 100 100"
          role="img"
        />
        Projects
      </NavLink>
    </Link>
  </Tooltip>,
  <Tooltip
    key="Cohort"
    label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
    position="bottom-start"
    multiline
    width={220}
    withArrow
  >
    <Link
      href={{
        pathname: "/analysis_page",
        query: { app: "CohortBuilder" },
      }}
      className="cursor-pointer"
      passHref
    >
      <NavLink
        data-testid="button-header-cohort"
        aria-label="Cohort Builder button"
      >
        <CohortBuilderIcon
          aria-label="Cohort Builder logo"
          width={24}
          height={24}
          viewBox="0 0 50 50"
          role="img"
        />
        Cohort Builder
      </NavLink>
    </Link>
  </Tooltip>,
  <Tooltip
    key="Download"
    label="Browse and download the files associated with your cohort for more sophisticated analysis."
    position="bottom-start"
    multiline
    width={220}
    withArrow
  >
    <Link
      href={{
        pathname: "/analysis_page",
        query: { app: "Downloads" },
      }}
      className="cursor-pointer"
      passHref
    >
      <NavLink
        data-testid="button-header-downloads"
        aria-label="Repository button"
      >
        <DownloadIcon
          aria-label="Repository logo"
          width={24}
          height={24}
          viewBox="0 0 50 50"
          role="img"
        />
        Repository
      </NavLink>
    </Link>
  </Tooltip>,
];
