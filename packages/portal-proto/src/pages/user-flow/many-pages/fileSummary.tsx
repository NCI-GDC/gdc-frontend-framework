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
        setCurrentFile={"6e63430a-4a44-4ba8-a1f9-f24871c8f08a"}
      />
      {/*
      List of test file uuids:
      4421d17a-adee-469c-be4c-0e360d43776b - has 	Annotations and aliquot and slides
      
      619ada6f-7f67-4c0e-ad0a-93a44bfb14cd - hundreads of cases, some with anotations
      
      6e63430a-4a44-4ba8-a1f9-f24871c8f08a - slide image

      b0a80c40-eb93-490a-932a-dc4cbc1a92b3 - portions

      2b8e79ba-705d-4f0e-a2f2-1a8ed747c85d - 2 sorce files

      2b8e79ba-705d-4f0e-a2f2-1a8ed747c85d - downstream file

      */}
    </UserFlowVariedPages>
  );
};

export default FileSummary;
