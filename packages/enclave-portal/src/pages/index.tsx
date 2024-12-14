import { NextPage } from "next";
import Head from "next/head";
import PageLayout from "../components/PageLayout";

const IndexPage: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>GDC Data Portal Homepage</title>
        <meta
          property="og:title"
          content="GDC Data Portal Homepage"
          key="gdc-homepage"
        />
      </Head>
      <div className="h-[400px]">
        <p className="p-2">Welcome to the Enclave Portal!</p>
      </div>
    </PageLayout>
  );
};

export default IndexPage;
