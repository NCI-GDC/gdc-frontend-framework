import { NextPage } from "next";
import Head from "next/head";
import { datadogRum } from "@datadog/browser-rum";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Link from "next/link";

const V1RetiredPage: NextPage = () => {
  datadogRum.startView({
    name: "1.0 Retired",
  });

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>The GDC Data Portal 1.0 has been retired</title>
        <meta
          property="og:title"
          content="GDC Data Portal 1.0 has been retired"
          key="gdc-portal-1.0-retired"
        />
      </Head>
      <div className="flex justify-center h-full p-8 gap-2">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl">
            The GDC Data Portal 1.0 has been retired and is no longer available.
          </h1>
          <p className="font-content">
            Access GDC 2.0{" "}
            <Link href="/" className="text-primary underline">
              here
            </Link>
            .<br></br>
            For assistance, contact the GDC Help Desk at{" "}
            <a
              href="mailto:support@nci-gdc.datacommons.io"
              className="text-primary-darker underline"
              target="blank"
            >
              support@nci-gdc.datacommons.io
            </a>
            .<br></br>
            <br></br>
            Thank you,
            <br></br>
            The GDC Team
          </p>
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default V1RetiredPage;
