import { useFiles } from "@gff/core";
import { NextPage } from "next";
import { MultipleImageViewer } from "../../../components/MultipleImageViewer";
import { parseSlideDetailsInfo } from "../../../features/files/utils";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";

import { headerElements } from "./navigation-utils";

const ImageViewer: NextPage = () => {
  //   const { data } = useFiles({
  //     filters: {
  //       op: "=",
  //       content: {
  //         field: "file_id",
  //         value: "6e63430a-4a44-4ba8-a1f9-f24871c8f08a",
  //       },
  //     },
  //     expand: [
  //       "cases",
  //       "cases.annotations",
  //       "cases.project",
  //       "cases.samples",
  //       "cases.samples.portions",
  //       "cases.samples.portions.analytes",
  //       "cases.samples.portions.slides",
  //       "cases.samples.portions.analytes.aliquots",
  //       "analysis",
  //       "analysis.input_files",
  //       "downstream_analyses",
  //       "downstream_analyses.output_files",
  //     ],
  //     size: 1,
  //   });

  //   console.log(data)
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <MultipleImageViewer
        imageId={"cf7aff1a-8ce0-4628-a0c0-6efe275a2417"}
        tableData={[]}
      />
    </UserFlowVariedPages>
  );
};

export default ImageViewer;
