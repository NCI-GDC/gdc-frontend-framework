import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import Image from "next/image";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const headerElements = [
    <Link key="cohorts" href="/user-flow/all-apps-v2/cohorts">
      Cohorts
    </Link>,
    <Link key="exploration" href="/user-flow/all-apps-v2/exploration">
      Exploration
    </Link>,
  ];

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/all-apps-v2", headerElements }}
    >
      <div className="flex flex-row p-4 gap-x-4 h-full">
        <div className="flex-grow p-4 border border-gdc-grey-lighter bg-white w-1/2 self-center">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut <span className="text-gdc-blue">
            <Link href="/user-flow/many-pages/studies">Cohorts</Link>
          </span> labore et dolore magna aliqua. </p> <br />
          <p>
          Lorem ipsum  <span className="text-gdc-blue">
            <Link href="/user-flow/all-apps/exploration">Exploration</Link>
          </span> dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="border border-gdc-grey-lighter bg-white w-1/2">
          <Image
            src="/user-flow/body-plot.png"
            layout="responsive"
            height="968"
            width="1180"
          />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default IndexPage;
