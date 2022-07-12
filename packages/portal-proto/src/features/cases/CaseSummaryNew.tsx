import { useCaseSummary } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import { URLContext } from "src/pages/_app";
import { Biospecimen } from "../biospecimen/Biospecimen";

export const CaseSummaryNew = ({
  case_id,
  bio_id,
}: {
  case_id: string;
  bio_id: string;
}): JSX.Element => {
  const { data, isFetching } = useCaseSummary({
    filters: {
      content: {
        field: "case_id",
        value: case_id,
      },
      op: "=",
    },
    fields: [
      "files.file_id",
      "files.data_type",
      "files.acl",
      "files.state",
      "files.access",
      "files.file_size",
      "case_id",
      "submitter_id",
      "project.name",
      "disease_type",
      "project.project_id",
      "primary_site",
      "project.program.name",
      "summary.file_count",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "annotations.annotation_id",
    ],
  });

  console.log("data: ", data);
  const { prevPath } = useContext(URLContext);

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (prevPath?.includes("MultipleImageViewerPage")) {
      scrollIntoView();
    }
  }, [prevPath, scrollIntoView]);

  return (
    <>
      {!data && isFetching ? (
        <LoadingOverlay visible />
      ) : (
        <>
          <div className="flex flex-col m-auto w-10/12">
            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
