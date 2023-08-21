import { NextPage } from "next";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import ManageSets from "@/features/manageSets/ManageSets";

const ManageSetsPage: NextPage = () => {
  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <ManageSets />
    </UserFlowVariedPages>
  );
};

export default ManageSetsPage;
