import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { datadogRum } from "@datadog/browser-rum";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import AnnotationSummary from "@/features/annotations/AnnotationSummary";

const AnnotationsPage: NextPage = () => {
  const router = useRouter();
  const { annotationId } = router.query;
  const [ready, setReady] = useState(false);

  datadogRum.startView({
    name: "Annotation Summary",
  });

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      <Head>
        <title>Annotation summary</title>
      </Head>
      {ready && <AnnotationSummary annotationId={annotationId as string} />}
    </UserFlowVariedPages>
  );
};

export default AnnotationsPage;
