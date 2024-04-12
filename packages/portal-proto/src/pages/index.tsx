import { NextPage } from "next";
import Head from "next/head";
import { datadogRum } from "@datadog/browser-rum";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Homepage from "@/features/homepage";

const IndexPage: NextPage = () => {
  datadogRum.startView({
    name: "Landing",
  });

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>GDC Data Portal Homepage</title>
        <meta
          property="og:title"
          content="GDC Data Portal Homepage"
          key="gdc-homepage"
        />
      </Head>
      <Homepage />
    </UserFlowVariedPages>
  );
};

export default IndexPage;
