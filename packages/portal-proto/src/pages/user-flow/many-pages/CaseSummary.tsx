import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { headerElements } from "./navigation-utils";
import { ContextualCasesView } from "@/features/cases/CasesView";

const CaseSummary: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <ContextualCasesView caseId="3b01d064-8c00-4972-9f07-407eac8e7534" />
    </UserFlowVariedPages>
  );
};

export default CaseSummary;
