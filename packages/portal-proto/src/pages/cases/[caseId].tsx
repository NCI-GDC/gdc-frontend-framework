import { NextPage } from "next";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { ContextualCasesView } from "@/features/cases/CasesView";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { useEffect, useState } from "react";
import { CaseSummaryNew } from "@/features/cases/CaseSummaryNew";

const CaseSummary: NextPage = () => {
  const router = useRouter();
  const {
    query: { caseId, bioId },
  } = router;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      {ready && (
        // <ContextualCasesView
        //   caseId={caseId as string}
        //   bioId={bioId as string}
        // />
        <CaseSummaryNew case_id={caseId as string} bio_id={bioId as string} />
      )}
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
