import { Tooltip } from "@mantine/core";
import AnalysisCenterIcon from "public/user-flow/icons/dna.svg";
import ProjectsIcon from "public/user-flow/icons/crowd-of-users.svg";
import CohortBuilderIcon from "public/user-flow/icons/apps/CohortBuilder.svg";
import DownloadIcon from "public/user-flow/icons/database.svg";
import Link from "next/link";

const commonLinkClasses =
  "flex items-center gap-1 font-heading text-sm font-medium text-base-darker p-1 mr-2 hover:rounded-md hover:bg-primary-lightest";

export const headerElements = [
  <Tooltip
    key="Analysis"
    label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
    position="bottom-start"
    multiline
    width={220}
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
          <AnalysisCenterIcon width={24} height={24} viewBox="0 0 500 500" />
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
    width={220}
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
          <ProjectsIcon width={24} height={24} viewBox="0 -15 100 100" />
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
    width={220}
    withArrow
  >
    <span>
      <Link
        href={{
          pathname: "/analysis_page",
          query: { app: "CohortBuilder" },
        }}
        className={commonLinkClasses}
        data-testid="button-header-cohort"
      >
        <>
          <CohortBuilderIcon width={24} height={24} viewBox="0 0 50 50" />
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
    width={220}
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
          <DownloadIcon width={24} height={24} viewBox="0 0 50 50" />
          Repository
        </>
      </Link>
    </span>
  </Tooltip>,
];
