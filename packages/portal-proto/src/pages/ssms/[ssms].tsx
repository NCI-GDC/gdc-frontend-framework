import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { datadogRum } from "@datadog/browser-rum";
import { SSMSSummary } from "@/features/mutationSummary/SSMSSummary";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";

const MutationsPage: NextPage = () => {
  const router = useRouter();
  const ssms = router.asPath.split("/")[2];

  const [ready, setReady] = useState(false);

  datadogRum.startView({
    name: "Mutation Summary",
  });

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      {ready && <SSMSSummary ssm_id={ssms} />}
    </UserFlowVariedPages>
  );
};

export default MutationsPage;
