import Link from "next/link";
import Image from "next/image";

export const headerElements = [
  <Link key="Cohort" href={{
    pathname: "/user-flow/single-page/single_page",
    query: { app: 'CohortBuilder' },
  }}>
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/build.svg"} width={24} height={24}/> <span className="px-2">Cohort Builder</span>
    </div>
  </Link>,
  <Link key="Analysis" href={{
    pathname: "/user-flow/single-page/single_page",
    query: { app: undefined },
  }}>
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/dna.svg"} width={24} height={24}/> <span className="px-2">Analysis</span>
    </div>
  </Link>,
  <Link key="Download" href={{
    pathname: "/user-flow/single-page/single_page",
    query: { app: "Downloads" },
  }}>
    <div className="text-sm font-heading hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/database.svg"} width={24} height={24}/> <span className="px-2">Downloads</span>
    </div>
  </Link>
  ];
