import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { datadogRum } from "@datadog/browser-rum";
import { UserFlowVariedPages } from "../../features/layout/UserFlowVariedPages";
import { FileSummary } from "../../features/files/FileSummary";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";

const FilePage: NextPage = () => {
  const router = useRouter();
  const uuid = router.asPath.split("/")[2];

  const [ready, setReady] = useState(false);

  datadogRum.startView({
    name: "File Summary",
  });

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <UserFlowVariedPages headerElements={headerElements}>
      {ready && <FileSummary file_id={uuid} />}
    </UserFlowVariedPages>
  );
};

export default FilePage;
