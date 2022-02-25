import { NextPage } from "next";
import {
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import { ContextualFileView } from "../../../features/files/FileSummary";
import { headerElements } from "./navigation-utils";

const FileSummary: NextPage = () => {

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <ContextualFileView
        setCurrentFile={"37175dfe-e34e-4f97-88b1-c0ba4bd5d093"}
      />
    </UserFlowVariedPages>
  );
};

export default FileSummary;
