import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { UserFlowVariedPages } from "../../features/layout/UserFlowVariedPages";
import { ContextualFileView } from "../../features/files/FileSummary";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";

const FileSummary: NextPage = () => {
  const router = useRouter();
  const uuid = router.asPath.split("/")[2];

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
      {ready && <ContextualFileView setCurrentFile={uuid} />}
    </UserFlowVariedPages>
  );
};

export default FileSummary;
