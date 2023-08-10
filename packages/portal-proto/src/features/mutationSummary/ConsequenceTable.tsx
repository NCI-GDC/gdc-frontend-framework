import { useSsmsConsequenceTable } from "@gff/core";
import { useEffect, useMemo, useState } from "react";
import { ConsequenceTableData } from "@/features/mutationSummary/types";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import {
  ColumnDef,
  ColumnOrderState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import Link from "next/link";
import { HeaderTooltip } from "@/components/Table/HeaderTooltip";
import { AnchorLink } from "@/components/AnchorLink";
import { externalLinks } from "@/utils/index";
import {
  ButtonTooltip,
  ImpactHeaderWithTooltip,
} from "@/components/expandableTables/shared";
import {
  SMTableConsequences,
  SMTableImpacts,
} from "../GenomicTables/SomaticMutationsTable/TableComponents";

export const ConsequenceTable = ({
  ssmsId,
}: {
  ssmsId: string;
}): JSX.Element => {
  const {
    data: { status, ssmsConsequence: initialData },
  } = useSsmsConsequenceTable({
    pageSize: 99, // get max 100 entries
    offset: 0,
    mutationId: ssmsId,
  });

  const [tableData, setTableData] = useState<ConsequenceTableData[]>([]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(tableData);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  useEffect(() => {
    if (status === "fulfilled") {
      // need to sort the table data and then store all entries in tableData
      const sortedData: ConsequenceTableData[] = [
        ...initialData.consequence.filter(
          ({ transcript: { is_canonical } }) => is_canonical,
        ),
        ...initialData.consequence
          .filter(({ transcript: { is_canonical } }) => !is_canonical)
          .sort((a, b) => {
            if (
              a.transcript.aa_change !== null &&
              b.transcript.aa_change == null
            )
              return -1;
            if (
              a.transcript.aa_change == null &&
              b.transcript.aa_change !== null
            )
              return 1;
            if (
              a.transcript.aa_change == null &&
              b.transcript.aa_change == null
            )
              return 0;
            if (a.transcript.aa_change > b.transcript.aa_change) return 1;
            if (a.transcript.aa_change == b.transcript.aa_change) return 0;
            return -1;
          }),
      ].map(
        ({
          transcript: {
            gene: { gene_id, symbol, gene_strand },
            aa_change,
            consequence_type,
            is_canonical,
            transcript_id,
            annotation: {
              hgvsc,
              polyphen_impact,
              polyphen_score,
              sift_impact,
              sift_score,
              vep_impact,
            },
          },
        }) => {
          return {
            gene: symbol,
            gene_id: gene_id,
            aa_change: aa_change ?? "--",
            coding_dna_change: hgvsc,
            consequences: consequence_type,
            transcript: transcript_id,
            is_canonical: is_canonical,
            gene_strand: gene_strand > 0 ? "+" : "-",
            impact: {
              polyphen_impact: polyphen_impact,
              polyphen_score: polyphen_score,
              sift_impact: sift_impact,
              sift_score: sift_score,
              vep_impact: vep_impact,
            },
          };
        },
      );
      setTableData(sortedData);
    }
  }, [status, initialData.consequence]);

  const consequenceTableColumnHelper =
    createColumnHelper<ConsequenceTableData>();

  const consequenceTableDefaultColumns = useMemo<
    ColumnDef<ConsequenceTableData>[]
  >(
    () => [
      consequenceTableColumnHelper.accessor("gene", {
        id: "gene",
        header: "Gene",
        cell: ({ row }) => (
          <Link href={`/genes/${row.original.gene_id}`}>
            <a className="text-utility-link font-content underline">
              {row.original.gene}
            </a>
          </Link>
        ),
      }),
      consequenceTableColumnHelper.accessor("aa_change", {
        id: "aa_change",
        header: "AA Gene",
      }),
      consequenceTableColumnHelper.accessor("consequences", {
        id: "consequences",
        header: () => (
          <HeaderTooltip
            title="Consequences"
            tooltip="SO Term: consequence type"
          />
        ),
        cell: ({ row }) => (
          <SMTableConsequences consequences={row.original.consequences} />
        ),
      }),
      consequenceTableColumnHelper.accessor("coding_dna_change", {
        id: "coding_dna_change",
        header: "Coding DNA Change",
      }),
      consequenceTableColumnHelper.display({
        id: "impact",
        header: () => <ImpactHeaderWithTooltip />,
        cell: ({ row }) => (
          <SMTableImpacts
            impact={{
              polyphenImpact: row.original.impact.polyphen_impact,
              polyphenScore: row.original.impact.polyphen_score,
              siftImpact: row.original.impact.sift_impact,
              siftScore: row.original.impact.sift_score,
              vepImpact: row.original.impact.vep_impact,
            }}
          />
        ),
      }),

      consequenceTableColumnHelper.display({
        id: "gene_strand",
        header: "Gene Strand",
        cell: ({ row }) => (
          <span className="text-lg font-bold">{row.original.gene_strand}</span>
        ),
      }),
      consequenceTableColumnHelper.display({
        id: "transcript",
        header: "Transcript",
        cell: ({ row }) => (
          <>
            {row.original.transcript ? (
              <AnchorLink
                href={externalLinks.transcript(row.original.transcript)}
                title={row.original.transcript}
                toolTipLabel={
                  row.original.is_canonical ? "Canonical" : undefined
                }
                iconText={row.original.is_canonical ? "C" : undefined}
              />
            ) : null}
          </>
        ),
      }),
    ],
    [consequenceTableColumnHelper],
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    consequenceTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  return (
    <VerticalTable
      data={displayedData}
      columns={consequenceTableDefaultColumns}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      handleChange={handleChange}
      showControls={true}
      pagination={{
        page,
        pages,
        size,
        from,
        total,
      }}
      additionalControls={
        <div className="flex gap-2 mb-2">
          <ButtonTooltip label="Export All Except #Cases" comingSoon={true}>
            <FunctionButton>JSON</FunctionButton>
          </ButtonTooltip>
          <ButtonTooltip label="Export current view" comingSoon={true}>
            <FunctionButton>TSV</FunctionButton>
          </ButtonTooltip>
        </div>
      }
      status={
        status === "pending"
          ? "pending"
          : status === "fulfilled"
          ? "fulfilled"
          : status === "rejected"
          ? "rejected"
          : "uninitialized"
      }
    />
  );
};

export default ConsequenceTable;
