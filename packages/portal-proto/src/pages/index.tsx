import type { NextPage } from "next";
import { Layout } from "../features/layout/Layout";
import Link from 'next/link'

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <div className="flex flex-col content-center">
        <div>Prototypes:</div>
        <Link href="/apps">Apps</Link>
        <Link href="/facets">Facets</Link>
      </div>
    </Layout>
  );
};

export default IndexPage;
