import { Image } from "@/components/Image";
import { Button, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";

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
    <Button
      id="nav_button_analysis"
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: undefined },
      }}
      className="text-sm font-heading  hover:bg-primary-lighter transition-colors text-primary-content-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md "
    >
      <Image
        src={"/user-flow/icons/dna.svg"}
        alt="Analysis logo"
        width={24}
        height={24}
      />
    </Button>
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
    <Button
      id="nav_button_projects"
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "Projects" },
      }}
      className="text-sm font-heading  hover:bg-primary-lighter transition-colors text-primary-content-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md "
    >
      <Image
        src={"/user-flow/icons/crowd-of-users.svg"}
        alt="Studies logo"
        width={24}
        height={24}
      />
    </Button>
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
    <Button
      id="nav_button_cohort"
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "CohortBuilder" },
      }}
      className="text-sm font-heading  hover:bg-primary-lighter transition-colors text-primary-content-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md "
    >
      <Image
        src={"/user-flow/icons/build.svg"}
        alt="Cohort logo"
        width={24}
        height={24}
      />
    </Button>
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
    <Button
      id="nav_button_downloads"
      unstyled
      component={NextLink}
      href={{
        pathname: "/user-flow/workbench/analysis_page",
        query: { app: "Downloads" },
      }}
      className="text-sm font-heading hover:bg-primary-lighter transition-colors text-primary-content-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md "
    >
      <Image
        src={"/user-flow/icons/database.svg"}
        alt="Downloads logo"
        width={24}
        height={24}
      />
    </Button>
  </Tooltip>,
];
