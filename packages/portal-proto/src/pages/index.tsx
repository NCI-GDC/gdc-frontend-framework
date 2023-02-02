import { NextPage } from "next";
import Head from "next/head";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { Image } from "@/components/Image";
import Link from "next/link";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { Button, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";
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
