import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";
import { ContextualCasesView } from "@/features/cases/CasesView";

const CaseSummary: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <ContextualCasesView caseId="1f601832-eee3-48fb-acf5-80c4a454f26e" />
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
