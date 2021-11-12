import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import Image from "next/image";
import Link from "next/link";

interface SummaryStatsItemProp {
  readonly title: string;
  readonly icon: string;
  readonly count: number;
  readonly size?: number;
}

const SummaryStatsItem: React.FC<SummaryStatsItemProp> = ({ title, icon, count, size = 24 }: SummaryStatsItemProp) => {
  return (
    <div className="flex flex-col flex-nowrap font-medium justify-center content-center font-heading ">
      <div className="flex flex-row flex-nowrap justify-center content-center text-md">{title} </div>
      <div className="flex flex-row flex-nowrap justify-center content-center text-2xl "><Image src={icon} width={size}
                                                                                                height={size} /> <span
        className="pl-2">{count.toLocaleString()}</span></div>
    </div>
  );
};

const SummaryStatsPanel = () => {
  return (
    <div className="flex flex-col bg-white border-nci-teal-lighter border-t-8 border-0 p-4 opacity-90 shadow-md hover:shadow-lg  ">
      <div className="flex flex-row items-end justify-items-end">
        <p className="font-heading text-lg text-gdc-grey-darker">Data Portal Summary</p>
        <a className="text-xs px-4 pb-1 text-gdc-blue"
           href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/">Data Release 31.0 - October
          29, 2021 </a>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 p-4 bg-opacity-0">
        <SummaryStatsItem title="PROJECTS" count={70} size={24} icon="/user-flow/icons/projects.svg" />
        <SummaryStatsItem title="PRIMARY SITES" count={67} size={24}
                          icon="/user-flow/icons/primary_sites.svg" />
        <SummaryStatsItem title="CASES" count={85415} size={24} icon="/user-flow/icons/user.svg" />
        <SummaryStatsItem title="FILES" count={649152} size={24} icon="/user-flow/icons/files.svg" />
        <SummaryStatsItem title="GENES" count={23621} size={24} icon="/user-flow/icons/genes.svg" />
        <SummaryStatsItem title="MUTATIONS" count={3599319} size={32}
                          icon="/user-flow/icons/gene-mutation.svg" />
      </div>
    </div>
  )
}

const ActionButtonBar = () => {
  return (
    <div className="flex flex-grow flex-row align-center pb-4 text-sm ">
      <Link key="CohortBuilder" href="/cohort-builder">
      <button
        className="text-sm bg-nci-yellow-lighter hover:bg-nci-yellow-lightest text-nci-gray-darkest font-bold mx-4 p-2 rounded inline-flex flex-nowrap items-center shadow-md bg-opacity-80">
        <Image src={"/user-flow/icons/build.svg"} width={32} height={32}/>
        <span className="px-2 whitespace-nowrap">Build Cohort</span>
      </button>
      </Link>
      <Link key="Studies" href="/user-flow/many-pages/studies">
      <button
        className="bg-nci-orange-lighter hover:bg-nci-orange-lightest hover:bg-nci-yellow-lightest text-nci-gray-darkest  font-bold  mx-4 p-2 rounded inline-flex items-center shadow-md bg-opacity-80">
        <Image src={"/user-flow/icons/crowd-of-users.svg"} width={32} height={32}/> <span className="px-2"> View Cohort </span>
      </button>
      </Link>
      <Link key="Analysis" href="/user-flow/many-pages/analysis">
      <button
        className="bg-nci-purple-lighter hover:bg-nci-purple-lightest text-nci-gray-darkest font-bold mx-4 p-2 rounded inline-flex items-center shadow-md bg-opacity-80">
        <Image src={"/user-flow/icons/dna.svg"} width={32} height={32}/> <span className="px-2"> Analyze Data </span>
      </button>
      </Link>
      <Link key="Repository" href="/user-flow/many-pages/repository">
      <button
        className="bg-nci-red-lighter hover:bg-nci-red-lightest text-nci-gray-darkest font-bold mx-4 p-2 rounded inline-flex items-center shadow-md bg-opacity-80">
        <Image src={"/user-flow/icons/database.svg"} width={32} height={32}/> <span className="px-2"> Download Data </span>
      </button>
      </Link>
    </div>
  )
}

const IndexPage: NextPage = () => {
  const headerElements = [
    <Link key="BuildCohort" href="/cohort-builder">
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image src={"/user-flow/icons/build.svg"} width={24} height={24}/> <span className="px-2"> Build Cohort </span>
      </div>
    </Link>,
    <Link key="ViewCohort" href="/user-flow/many-pages/studies">
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image src={"/user-flow/icons/crowd-of-users.svg"} width={24} height={24}/> <span className="px-2"> View Cohorts </span>
      </div>
    </Link>,
    <Link key="Analysis" href="/user-flow/many-pages/analysis">
      <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
        <Image src={"/user-flow/icons/dna.svg"} width={24} height={24}/> <span className="px-2"> Analyze Data </span>
      </div>
    </Link>,
    <Link key="Repository" href="/user-flow/many-pages/repository">
      <div className="text-sm font-heading hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/database.svg"} width={24} height={24}/> <span className="px-2"> Download Data </span>
      </div>
    </Link>,
  ];

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <div className="flex flex-col w-100 h-100 bg-gradient-to-r from-nci-blue via-nci-blue-light to-nci-blumine-light pt-1">
        <div className="flex flex-row mb-auto">
          <div className="flex flex-col pl-10">
            <div className="flex flex-col w-100">
              <div className="font-heading text-nci-gray-lightest text-md pt-5 pb-2">Harmonized Cancer Datasets</div>
              <div className="font-heading text-nci-gray-lightest text-2xl pb-5">Genomic Data Commons Data Portal</div>
            </div>
            <div className="flex items-center w-100 pb-5">
              <div className="w-full"><input type="text"
                                             className="h-10 pr-8 w-full pl-5 bg-white border-nci-gray-light rounded-full focus:outline-none focus:ring focus:ring-nci-cyan-light focus:border-nci-teal-light hover:shadow-lg hover:border-nci-teal-lighter"
                                             placeholder={`e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2`} />
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
