import {
  useCoreSelector,
  selectGdcAppMetadataById,
  selectGdcAppById,
} from "@gff/core";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/dist/client/router";
import { Layout } from "../../features/layout/Layout";

const AppsPage: NextPage = () => {
  const router = useRouter();
  const appId = getAppId(router);
  const metadata = useCoreSelector((state) =>
    selectGdcAppMetadataById(state, appId)
  );
  const GdcApp = useCoreSelector(() => selectGdcAppById(appId));

  return (
    <Layout>
      <div className="flex flex-col content-center gap-y-4">
        {metadata && (
          <div key={metadata.id} className="border-2 p-4">
            <div>id: {metadata.id}</div>
            <div>name: {metadata.name}</div>
            <div>version: {metadata.version}</div>
            <div>
              required entities: {metadata.requiredEntityTypes.join(",")}
            </div>
          </div>
        )}
        {GdcApp && (
          <div>
            <GdcApp />
          </div>
        )}
      </div>
    </Layout>
  );
};

const getAppId = (router: NextRouter): string => {
  const { appId } = router.query;
  if (typeof appId === "string") return appId;
  else if (typeof appId === "object") return appId[0];

  return "UNKNOWN_APP_ID";
};

const isString = (x: any): x is string => {
  return typeof x === "string";
};

export default AppsPage;
