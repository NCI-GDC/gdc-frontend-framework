import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SimpleLayout } from "../../features/layout/Simple";
import SSMPlot from "../../features/charts/SSMPlot";
import CNVPlot from "../../features/charts/CNVPlot";
import { GeneSummary } from "@/features/GeneSummary/GeneSummary";

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
    <SimpleLayout>
      <div>
        {ready && (
          <>
            <GeneSummary gene_id={gene} />
            <SSMPlot page={"gene"} gene={gene} />
            <CNVPlot gene={gene} />
          </>
        )}
      </div>
    </SimpleLayout>
  );
};

export default GenesPage;
