import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import Image from "next/image";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const headerElements = [
    <Link key="Studies" href="/user-flow/many-pages/studies">
      Cohorts
    </Link>,
    <Link key="Analysis" href="/user-flow/many-pages/analysis">
      Analysis
    </Link>,
    <Link key="Repository" href="/user-flow/many-pages/repository">
      Repository
    </Link>,
  ];

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <div className="flex flex-row p-4 gap-x-4 h-full">
        <div className="flex-grow p-4 border border-gdc-grey-lighter bg-white w-1/2 self-center">
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut <span className="text-gdc-blue">
            <Link href="/user-flow/many-pages/studies">Cohorts</Link>
          </span> labore et dolore magna aliqua. </p> <br />
          <p>
          Nulla bibendum erat <span className="text-gdc-blue">
            <Link href="/user-flow/many-pages/analysis">Analysis</Link>
          </span> in sollicitudin hendrerit. 
          Quisque in commodo dui, at venenatis tellus. <span className="text-gdc-blue">
            <Link href="/user-flow/many-pages/repository">Repository</Link>
          </span> velit massa, pretium quis leo sed, iaculis tincidunt enim.
          </p>
        </div>
        <div className="border border-gdc-grey-lighter bg-white w-1/2">
          <Image src="/user-flow/body-plot.png" layout="responsive" height={500} width={600} />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default IndexPage;
