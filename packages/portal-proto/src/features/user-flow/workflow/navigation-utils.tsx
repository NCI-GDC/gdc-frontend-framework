import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "@mantine/core";

export const headerElements = [
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
        body: "shadow-lg bg-white text-nci-gray-darkest",
      }}
      position="bottom"
      placement="start"
      wrapLines
      width={220}
    >
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter transition-colors text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image
          src={"/user-flow/icons/dna.svg"}
          alt="Analysis logo"
          width={24}
          height={24}
        />
      </div>
    </Tooltip>
  </Link>,
  <Link
    key="Studies"
    href={{
      pathname: "/user-flow/workbench/analysis_page",
      query: { app: "Studies" },
    }}
  >
    <Tooltip
      label="View the Studies available within the GDC and select them for further exploration and analysis."
      classNames={{
        body: "shadow-lg bg-white text-nci-gray-darkest",
      }}
      position="bottom"
      placement="start"
      wrapLines
      width={220}
    >
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter transition-colors text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image
          src={"/user-flow/icons/crowd-of-users.svg"}
          alt="Studies logo"
          width={24}
          height={24}
        />
      </div>
    </Tooltip>
  </Link>,
  <Link
    key="Cohort"
    href={{
      pathname: "/user-flow/workbench/analysis_page",
      query: { app: "CohortBuilder" },
    }}
  >
    <Tooltip
      label="Build and define your custom cohorts using a variety of clinical and biospecimen features."
      classNames={{
        body: "shadow-lg bg-white text-nci-gray-darkest",
      }}
      position="bottom"
      placement="start"
      wrapLines
      width={220}
    >
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter transition-colors text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image
          src={"/user-flow/icons/build.svg"}
          alt="Cohort logo"
          width={24}
          height={24}
        />
      </div>
    </Tooltip>
  </Link>,
  <Link
    key="Download"
    href={{
      pathname: "/user-flow/workbench/analysis_page",
      query: { app: "Downloads" },
    }}
  >
    <Tooltip
      label="Browse and download the files associated with your cohort for more sophisticated analysis."
      classNames={{
        body: "shadow-lg bg-white text-nci-gray-darkest",
      }}
      position="bottom"
      placement="start"
      wrapLines
      width={220}
    >
      <div className="text-sm font-heading hover:bg-nci-blue-lighter transition-colors text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image
          src={"/user-flow/icons/database.svg"}
          alt="Downloads logo"
          width={24}
          height={24}
        />
      </div>
    </Tooltip>
  </Link>,
];
