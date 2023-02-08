import { NextPage } from "next";
import Head from "next/head";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Homepage from "@/features/homepage";

const IndexPage: NextPage = () => {
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
