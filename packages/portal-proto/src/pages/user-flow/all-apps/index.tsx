import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import Image from "next/image";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const headerElements = [
    <Link key="exploration" href="/user-flow/all-apps/exploration">
      Exploration
    </Link>,
  ];

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/all-apps", headerElements }}
    >
      <div className="flex flex-row p-4 gap-x-4 h-full">
        <div className="flex-grow p-4 border border-gdc-grey-lighter bg-white w-1/2 self-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <p />
          <span className="text-gdc-blue">
            <Link href="/user-flow/all-apps/exploration">Exploration</Link>
          </span>
        </div>
        <div className="border border-gdc-grey-lighter bg-white">
          <Image src="/user-flow/body-plot.png" height={500} width={600} />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default IndexPage;
