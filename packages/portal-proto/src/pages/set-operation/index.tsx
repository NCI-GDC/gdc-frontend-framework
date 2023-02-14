import { NextPage } from "next";
import { SimpleLayout } from "../../features/layout/Simple";
import SetOperationsDemo from "../../features/set-operations/SetOperationsDemo";

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout>
      <SetOperationsDemo />
    </SimpleLayout>
  );
};

export default IndexPage;
