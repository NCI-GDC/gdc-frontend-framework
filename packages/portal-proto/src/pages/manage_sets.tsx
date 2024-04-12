import { NextPage } from "next";
import Head from "next/head";
import { datadogRum } from "@datadog/browser-rum";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import ManageSets from "@/features/manageSets/ManageSets";

const ManageSetsPage: NextPage = () => {
  datadogRum.startView({
    name: "Manage Sets",
  });

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>Manage Sets</title>
      </Head>
      <ManageSets />
    </UserFlowVariedPages>
  );
};

export default ManageSetsPage;
