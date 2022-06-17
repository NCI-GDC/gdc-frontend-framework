import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";
import { ContextualCasesView } from "@/features/cases/CasesView";
import { useRouter } from "next/router";

const CaseSummary: NextPage = () => {
  const { query } = useRouter();
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <ContextualCasesView
        caseId="1f601832-eee3-48fb-acf5-80c4a454f26e"
        bioId={query.bioId as string}
      />
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
