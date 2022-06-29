import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SimpleLayout } from "../../features/layout/Simple";
import SSMPlot from "../../features/charts/SSMPlot";
import { SSMSSummary } from "@/features/SSMSSummary";

const MutationsPage: NextPage = () => {
  const router = useRouter();
  const ssms = router.asPath.split("/")[2];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <SimpleLayout>
      <div>
        {ready && (
          <>
            <SSMSSummary ssm_id={ssms} />
            <SSMPlot page={"ssms"} ssms={ssms} />
          </>
        )}
      </div>
    </SimpleLayout>
  );
};

export default MutationsPage;
