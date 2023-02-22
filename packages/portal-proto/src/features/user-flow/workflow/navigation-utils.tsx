import { Image } from "@/components/Image";
import { Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";

const NavLink = tw(NextLink)`
flex
items-center
gap-1
font-heading
text-sm
font-medium
text-base-darker
pr-4
`;

export const headerElements = [
  <Tooltip
    key="Analysis"
    label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
    position="bottom-start"
    multiline
    width={220}
  >
    <NavLink
      href={{
        pathname: "/analysis_page",
        query: { app: undefined },
      }}
      data-testid="button-header-analysis"
      aria-label="analysis center button"
    >
      <Image
        src={"/user-flow/icons/dna.svg"}
        alt="Analysis logo"
        width={24}
        height={24}
      />
      Analysis Center
    </NavLink>
  </Tooltip>,
  <Tooltip
    key="Studies"
    label="View the projects available within the GDC and select them for further exploration and analysis."
    position="bottom-start"
    multiline
    width={220}
  >
    <NavLink
      href={{
        pathname: "/analysis_page",
        query: { app: "Projects" },
      }}
      data-testid="button-header-projects"
      aria-label="project/studies center button"
    >
      <Image
        src={"/user-flow/icons/crowd-of-users.svg"}
        alt="Studies logo"
        width={24}
        height={24}
      />
      Projects
    </NavLink>
  </Tooltip>,
  <Tooltip
    key="Cohort"
    label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
    position="bottom-start"
    multiline
    width={220}
  >
    <NavLink
      href={{
        pathname: "/analysis_page",
        query: { app: "CohortBuilder" },
      }}
      data-testid="button-header-cohort"
      aria-label="cohort builder button"
    >
      <Image
        src={"/user-flow/icons/build.svg"}
        alt="Cohort logo"
        width={24}
        height={24}
      />
      Cohort Builder
    </NavLink>
  </Tooltip>,
  <Tooltip
    key="Download"
    label="Browse and download the files associated with your cohort for more sophisticated analysis."
    position="bottom-start"
    multiline
    width={220}
  >
    <NavLink
      href={{
        pathname: "/analysis_page",
        query: { app: "Downloads" },
      }}
      data-testid="button-header-downloads"
      aria-label="download center button"
    >
      <Image
        src={"/user-flow/icons/database.svg"}
        alt="Downloads logo"
        width={24}
        height={24}
      />
      Repository
    </NavLink>
  </Tooltip>,
];
