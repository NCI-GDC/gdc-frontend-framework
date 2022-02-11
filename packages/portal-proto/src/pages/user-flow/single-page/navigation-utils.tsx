import Link from "next/link";
import Image from "next/image";

export const headerElements = [
  <Link key="Analysis" href="/user-flow/many-pages/analysis">
    <div className="text-sm font-heading  hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/dna.svg"} width={24} height={24}/> <span className="px-2">Analysis</span>
    </div>
  </Link>,
  <Link key="Download" href="/user-flow/many-pages/repository">
    <div className="text-sm font-heading hover:bg-nci-blue-lighter text-nci-gray-darkest p-2 rounded inline-flex flex-nowrap items-center shadow-md ">
      <Image src={"/user-flow/icons/database.svg"} width={24} height={24}/> <span className="px-2">Downloads</span>
    </div>
  </Link>,
  ];
