import Link from "next/link";
import Image from "next/image";

export const headerElements = [
  <Link key="BuildCohort" href="/cohort-builder">
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/build.svg"} width={24} height={24} />{" "}
      <span className="px-2">Build Cohort</span>
    </div>
  </Link>,
  <Link key="ViewCohort" href="/user-flow/many-pages/studies">
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image
        src={"/user-flow/icons/crowd-of-users.svg"}
        width={24}
        height={24}
      />{" "}
      <span className="px-2">View Cohorts</span>
    </div>
  </Link>,
  <Link key="Analysis" href="/user-flow/many-pages/analysis">
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/dna.svg"} width={24} height={24} />{" "}
      <span className="px-2">Analyze Data</span>
    </div>
  </Link>,
  <Link key="Repository" href="/user-flow/many-pages/repository">
    <div className="text-sm font-heading hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/database.svg"} width={24} height={24} />{" "}
      <span className="px-2">Download Data</span>
    </div>
  </Link>,
];
