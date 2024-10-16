import { NextPage } from "next";
import Head from "next/head";
import { datadogRum } from "@datadog/browser-rum";
import { selectGdcAppById, useCoreSelector } from "@gff/core";
import { AnnotationBrowserAppId } from "@/features/annotations/registerApp";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";

const AnnotationsPage: NextPage = () => {
  const GdcApp = useCoreSelector(() =>
    selectGdcAppById(AnnotationBrowserAppId),
  ) as React.ElementType;

  datadogRum.startView({
    name: "Annotation Browser",
  });

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      <Head>
        <title>Annotation browser</title>
      </Head>
      <GdcApp></GdcApp>
    </UserFlowVariedPages>
  );
};

export default AnnotationsPage;
