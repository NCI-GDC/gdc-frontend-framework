import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { useEffect, useState } from "react";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { ContextualProjectView } from "@/features/projects/ProjectView";

const ProjectSummary: NextPage = () => {
  const router = useRouter();
  const {
    query: { projectId },
  } = router;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      {ready && <ContextualProjectView projectId={projectId as string} />}
    </UserFlowVariedPages>
  );
};

export default ProjectSummary;
