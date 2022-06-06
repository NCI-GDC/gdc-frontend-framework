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
      {/* <ContextualCasesView caseId="ae5c7389-f0f9-4fd3-97c0-cdd5800f4801" /> */}
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
