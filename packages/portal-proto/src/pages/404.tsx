import { NextPage } from "next";
import Head from "next/head";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Link from "next/link";

const Custom404Page: NextPage = () => {
  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>Page Not Found</title>
        <meta
          property="og:title"
          content="GDC Data Portal Page Not Found"
          key="gdc-page-not-found"
        />
      </Head>
      <div className="flex flex-col justify-center items-center h-full p-8 gap-2">
        <h1 className="text-2xl">Page Not Found</h1>
        <h2>Sorry, we couldn&apos;t find the page you were looking for.</h2>
        <Link href="/" passHref>
          <a className="text-primary underline">
            Click here to go to the GDC Data Portal home page.
          </a>
        </Link>
      </div>
    </UserFlowVariedPages>
  );
};

export default Custom404Page;
