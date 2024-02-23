import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import AnnotationSummary from "@/features/annotations/AnnotationSummary";

const AnnotationsPage: NextPage = () => {
  const router = useRouter();
  const { annotationId } = router.query;

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      <Head>
        <title>Annotation summary</title>
      </Head>
      {annotationId && (
        <AnnotationSummary annotationId={annotationId as string} />
      )}
    </UserFlowVariedPages>
  );
};

export default AnnotationsPage;
