import { NextPage } from "next";
import { useRouter } from "next/router";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import AnnotationSummary from "@/features/annotations/AnnotationSummary";

const AnnotationsPage: NextPage = () => {
  const router = useRouter();
  const { annotationId } = router.query;

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      {annotationId && (
        <AnnotationSummary annotationId={annotationId as string} />
      )}
    </UserFlowVariedPages>
  );
};

export default AnnotationsPage;
