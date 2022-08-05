import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { useEffect, useState } from "react";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { ProjectSummary } from "@/features/projects/ProjectSummary";

const ProjectSummaryPage: NextPage = () => {
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
      {ready && <ProjectSummary projectId={projectId as string} />}
    </UserFlowVariedPages>
  );
};

export default ProjectSummaryPage;
