import { NextPage } from "next";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { ContextualCasesView } from "@/features/cases/CasesView";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { useEffect, useState } from "react";

const CaseSummary: NextPage = () => {
  const router = useRouter();
  let caseId = router.asPath.split("/")[2];

  if (caseId.includes("?")) {
    caseId = caseId.split("?")[0];
  }

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      {ready && (
        <ContextualCasesView
          caseId={caseId}
          bioId={router.query.bioId as string}
        />
      )}
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
