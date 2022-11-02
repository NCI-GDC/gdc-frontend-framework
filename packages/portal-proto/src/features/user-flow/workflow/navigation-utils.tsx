import { Image } from "@/components/Image";
import { Button, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";

const NavButton = tw(Button)`
text-sm
font-heading
hover:bg-primary-lighter
transition-colors
text-primary-content-darkest
p-2
rounded
inline-flex
flex-nowrap
items-center
shadow-lg
`;

export const headerElements = [
  <Tooltip
    key="Analysis"
    label="Explore and analyze harmonized high-quality clinical and genomics data from cancer genomic studies with the tools in the Analysis Center."
    classNames={{
      tooltip: "shadow-lg bg-base-lightest text-primary-content-darkest",
    }}
    position="bottom-start"
    multiline
    width={220}
  >
    <NavButton
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: undefined },
      }}
      className=" "
      data-testid="analysisButton"
      aria-label="analysis center button"
    >
      <Image
        src={"/user-flow/icons/dna.svg"}
        alt="Analysis logo"
        width={24}
        height={24}
      />
    </NavButton>
  </Tooltip>,
  <Tooltip
    key="Studies"
    label="View the Projects/Studies available within the GDC and select them for further exploration and analysis."
    classNames={{
      tooltip: "shadow-lg bg-base-lightest text-primary-content-darkest",
    }}
    position="bottom-start"
    multiline
    width={220}
  >
    <NavButton
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "Projects" },
      }}
      data-testid="projectsButton"
      aria-label="project/studies center button"
    >
      <Image
        src={"/user-flow/icons/crowd-of-users.svg"}
        alt="Studies logo"
        width={24}
        height={24}
      />
    </NavButton>
  </Tooltip>,
  <Tooltip
    key="Cohort"
    label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
    classNames={{
      tooltip: "shadow-lg bg-base-lightest text-primary-content-darkest",
    }}
    position="bottom-start"
    multiline
    width={220}
  >
    <NavButton
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "CohortBuilder" },
      }}
      data-testid="cohortButton"
      aria-label="cohort builder button"
    >
      <Image
        src={"/user-flow/icons/build.svg"}
        alt="Cohort logo"
        width={24}
        height={24}
      />
    </NavButton>
  </Tooltip>,
  <Tooltip
    key="Download"
    label="Browse and download the files associated with your cohort for more sophisticated analysis."
    classNames={{
      tooltip: "shadow-lg bg-base-lightest text-primary-content-darkest",
    }}
    position="bottom-start"
    multiline
    width={220}
  >
    <NavButton
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "Downloads" },
      }}
      data-testid="downloadsButton"
      aria-label="download center button"
    >
      <Image
        src={"/user-flow/icons/database.svg"}
        alt="Downloads logo"
        width={24}
        height={24}
      />
    </NavButton>
  </Tooltip>,
];
