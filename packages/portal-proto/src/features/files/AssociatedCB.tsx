import GenericLink from "@/components/GenericLink";
import { HandleChangeInput } from "@/components/Table/types";
import useStandardPagination from "@/hooks/useStandardPagination";
import { GdcFile } from "@gff/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { HeaderTitle } from "@/components/tailwindComponents";
import VerticalTable from "@/components/Table/VerticalTable";
import TotalItems from "@/components/Table/TotalItem";

type AssociatedCBType = {
  entity_id: JSX.Element;
  entity_type: string;
  tissue_type: string;
  tumor_descriptor: string;
  case_id: string;
  annotations: JSX.Element | 0;
};

const columnHelper = createColumnHelper<AssociatedCBType>();

const AssociatedCB = ({
  cases,
  associated_entities,
}: {
  cases: GdcFile["cases"];
  associated_entities: GdcFile["associated_entities"];
}): JSX.Element => {
  const [associatedCBSearchTerm, setAssociatedCBSearchTerm] = useState("");

  const data: AssociatedCBType[] = useMemo(() => {
    const tableRows = [];

    associated_entities?.forEach((entity) => {
      // find matching id from cases
      const caseData = cases?.find(
        (caseObj) => caseObj.case_id === entity.case_id,
      );

      // get tissue_type and tumor_descriptor from casedata through matching its submitter_id
      const matched_entity = caseData?.samples?.find((sample) => {
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
      });

      let entityQuery;
      if (entity.entity_type !== "case") {
        entityQuery = { bioId: entity.entity_id };
      }

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
          tissue_type: matched_entity?.tissue_type ?? "--",
          tumor_descriptor: matched_entity?.tumor_descriptor ?? "--",
          case_id: (
            <GenericLink
              path={`/cases/${entity.case_id}`}
              text={caseData?.submitter_id}
            />
          ),
          annotations: caseData?.annotations?.length || 0,
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("entity_id", {
        header: "Entity ID",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("entity_type", {
        header: "Entity Type",
      }),
      columnHelper.accessor("tissue_type", {
        header: "Tissue Type",
      }),
      columnHelper.accessor("tumor_descriptor", {
        header: "Tumor Descriptor",
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
    [],
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
      search={{
        enabled: true,
        tooltip: "e.g. TCGA-AR-A24Z, TCGA-AR-A24Z-10A-01D-A167-09",
      }}
      tableTotalDetail={
        <TotalItems
          total={data?.length}
          itemName="case/biospecimen"
          pluralName="cases/biospecimens"
        />
      }
      tableTitle={<HeaderTitle>Associated Cases/Biospecimens</HeaderTitle>}
      handleChange={handleChange}
      baseZIndex={300}
    />
  );
};

export default AssociatedCB;
