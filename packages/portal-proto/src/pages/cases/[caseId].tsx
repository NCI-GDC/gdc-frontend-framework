import { NextPage } from "next";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { useEffect, useState } from "react";
import { CaseSummary } from "@/features/cases/CaseSummary";

const CaseSummaryPage: NextPage = () => {
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
    <UserFlowVariedPages headerElements={headerElements}>
      {ready && (
        <CaseSummary case_Id={caseId as string} bio_id={bioId as string} />
      )}
    </UserFlowVariedPages>
  );
};

export default CaseSummaryPage;
