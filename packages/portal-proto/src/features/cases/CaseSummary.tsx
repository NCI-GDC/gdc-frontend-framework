import { useCaseSummary, useAnnotations } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { caseSummaryFields } from "./utils";
import { CaseView } from "./CaseView";

export const CaseSummary = ({
  case_id,
  bio_id,
  isModal = false,
}: {
  case_id: string;
  bio_id: string;
  isModal?: boolean;
}): JSX.Element => {
  const { data, isFetching } = useCaseSummary({
    filters: {
      content: {
        field: "case_id",
        value: case_id,
      },
      op: "=",
    },
    fields: caseSummaryFields,
  });

  const { data: annotationCountData, isFetching: isAnnotationCallFetching } =
    useAnnotations({
      filters: {
        op: "=",
        content: {
          field: "annotations.case_id",
          value: case_id,
        },
      },
    });

  return (
    <>
      {isFetching ||
      isAnnotationCallFetching ||
      (data && data.case_id !== case_id) ? (
        <LoadingOverlay visible data-testid="loading" />
      ) : data && Object.keys(data).length > 0 && annotationCountData ? (
        <>
          <CaseView
            case_id={case_id}
            bio_id={bio_id}
            data={data}
            annotationCountData={annotationCountData}
            isModal={isModal}
          />
        </>
      ) : (
        <SummaryErrorHeader label="Case Not Found" />
      )}
    </>
  );
};
