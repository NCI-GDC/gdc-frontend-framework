import { useCoreSelector, selectAllGdcAppMetadata } from "@gff/core";
import { NextPage } from "next";
import Link from "next/link";

import { Layout } from "../features/layout/Layout";

const AppsPage: NextPage = () => {
  const allMetadata = useCoreSelector(selectAllGdcAppMetadata);
  return (
    <Layout>
      <div className="flex flex-col content-center gap-y-4">
        {allMetadata.map((metadata) => {
          return (
            <div key={metadata.id} className="border-2 p-4">
              <div>id: <Link href={`/app/${metadata.id}`}>{metadata.id}</Link></div>
              <div>name: {metadata.name}</div>
              <div>version: {metadata.version}</div>
              <div>required entities: {metadata.requiredEntityTypes.join(",")}</div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default AppsPage;
