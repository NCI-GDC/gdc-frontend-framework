import { NextPage } from "next";
import OncoGrid from "../features/oncoGrid/OncoGridWrapper";

const OncoGridPage: NextPage = () => {
  return (
    <div className="p-4">
      <OncoGrid />
    </div>
  );
};

export default OncoGridPage;
