import GenericLink from "@/components/GenericLink";
import { HandleChangeInput } from "@/components/Table/types";
import useStandardPagination from "@/hooks/useStandardPagination";
import { GdcFile } from "@gff/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { HeaderTitle } from "@/components/tailwindComponents";
import VerticalTable from "@/components/Table/VerticalTable";
import Link from "next/link";

const getAnnotationsLinkParams = (
  annotations: readonly string[],
  case_id: string,
) => {
  if (!annotations) return null;

  if (annotations.length === 1) {
    return `https://portal.gdc.cancer.gov/v1/annotations/${annotations[0]}`;
  }
  return `https://portal.gdc.cancer.gov/v1/annotations?filters={"content":[{"content":{"field":"annotations.entity_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
};

const AssociatedCB = ({
  cases,
  associated_entities,
}: {
  cases: GdcFile["cases"];
  associated_entities: GdcFile["associated_entities"];
}): JSX.Element => {
  const [associatedCBSearchTerm, setAssociatedCBSearchTerm] = useState("");

  type AssociatedCBType = {
    entity_id: JSX.Element;
    entity_type: string;
    sample_type: string;
    case_id: string;
    annotations: JSX.Element | 0;
  };
  const data: AssociatedCBType[] = useMemo(() => {
    const tableRows = [];

    associated_entities?.forEach((entity) => {
      // find matching id from cases
      const caseData = cases?.find(
        (caseObj) => caseObj.case_id === entity.case_id,
      );

      // get sample_type from casedata through matching its submitter_id
      const sample_type =
        caseData?.samples?.find((sample) => {
          // match entity_submitter_id

          // get submitter_id from diferent paths
          const portion = sample.portions?.[0];
          let entity_id = sample.submitter_id;
          if (portion?.analytes?.[0]?.aliquots?.[0]?.submitter_id) {
            entity_id = portion.analytes?.[0]?.aliquots?.[0]?.submitter_id;
          } else if (portion?.slides?.[0]?.submitter_id) {
            entity_id = portion.slides?.[0]?.submitter_id;
          } else if (portion?.submitter_id) {
            entity_id = portion.submitter_id;
          }
          return entity_id === entity.entity_submitter_id;
        })?.sample_type || "--";

      let entityQuery;
      if (entity.entity_type !== "case") {
        entityQuery = { bioId: entity.entity_id };
      }

      const url =
        caseData !== undefined
          ? getAnnotationsLinkParams(caseData?.annotations, caseData.case_id)
          : undefined;

      const annotationsLink = url ? (
        <Link href={url} passHref>
          <a className="text-utility-link underline" target="_blank">
            {caseData.annotations.length}
          </a>
        </Link>
      ) : (
        0
      );

      if (
        caseData?.submitter_id &&
        (associatedCBSearchTerm === "" ||
          entity.entity_submitter_id
            .toLowerCase()
            .includes(associatedCBSearchTerm.toLowerCase()) ||
          caseData?.submitter_id
            .toLowerCase()
            .includes(associatedCBSearchTerm.toLowerCase()))
      ) {
        tableRows.push({
          entity_id: (
            <GenericLink
              path={`/cases/${entity.case_id}`}
              query={entityQuery}
              text={entity.entity_submitter_id}
            />
          ),
          entity_type: entity.entity_type,
          sample_type: sample_type,
          case_id: (
            <GenericLink
              path={`/cases/${entity.case_id}`}
              text={caseData?.submitter_id}
            />
          ),
          annotations: annotationsLink,
        });
      }
    });

    return tableRows;
  }, [associatedCBSearchTerm, associated_entities, cases]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(data);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "newSearch":
        setAssociatedCBSearchTerm(obj.newSearch);
        break;
    }
  };
  const columnHelper = createColumnHelper<AssociatedCBType>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("entity_id", {
        header: "Entity ID",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("entity_type", {
        header: "Entity Type",
      }),
      columnHelper.accessor("sample_type", {
        header: "Sample Type",
      }),
      columnHelper.accessor("case_id", {
        header: "Case ID",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("annotations", {
        header: "Annotations",
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [columnHelper],
  );

  return (
    <VerticalTable
      data={displayedData}
      columns={columns}
      pagination={{
        page,
        pages,
        size,
        from,
        total,
        label: "associated cases/biospecimen",
      }}
      status="fulfilled"
      search={{
        enabled: true,
        tooltip: "e.g. TCGA-AR-A24Z, TCGA-AR-A24Z-10A-01D-A167-09",
      }}
      additionalControls={
        <div className="mt-3.5">
          <HeaderTitle>Associated Cases/Biospecimens</HeaderTitle>
        </div>
      }
      handleChange={handleChange}
      baseZIndex={300}
    />
  );
};

export default AssociatedCB;
