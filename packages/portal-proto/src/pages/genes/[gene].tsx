import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { GeneSummary } from "@/features/GeneSummary/GeneSummary";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";

const GenesPage: NextPage = () => {
  const router = useRouter();
  const gene = router.asPath.split("/")[2];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div>{ready && <GeneSummary gene_id={gene} />}</div>
    </UserFlowVariedPages>
  );
};

export default GenesPage;
