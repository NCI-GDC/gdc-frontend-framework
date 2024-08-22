import { useSsmsConsequenceTableQuery } from "@gff/core";
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
import {
  externalLinks,
  humanify,
  statusBooleansToDataStatus,
} from "@/utils/index";
import {
  SMTableConsequences,
  SMTableImpacts,
} from "../GenomicTables/SomaticMutationsTable/TableComponents";
import saveAs from "file-saver";
import { Loader } from "@mantine/core";
import { convertDateToString } from "@/utils/date";
import { downloadTSV } from "@/components/Table/utils";
import ImpactHeaderWithTooltip from "../GenomicTables/SharedComponent/ImpactHeaderWithTooltip";
import TotalItems from "@/components/Table/TotalItem";

const consequenceTableColumnHelper = createColumnHelper<ConsequenceTableData>();

export const ConsequenceTable = ({
  ssmsId,
}: {
  ssmsId: string;
}): JSX.Element => {
  const [
    consequenceTableJSONDownloadActive,
    setConsequenceTableJSONDownloadActive,
  ] = useState(false);

  const {
    data: initialData,
    isFetching,
    isSuccess,
    isError,
  } = useSsmsConsequenceTableQuery({
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
    if (isSuccess) {
      // need to sort the table data and then store all entries in tableData
      const sortedData: ConsequenceTableData[] = [
        ...(initialData.consequence || []).filter(
          ({ transcript: { is_canonical } }) => is_canonical,
        ),
        ...(initialData.consequence || [])
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
  }, [isSuccess, initialData?.consequence]);

  const consequenceTableDefaultColumns = useMemo<
    ColumnDef<ConsequenceTableData>[]
  >(
    () => [
      consequenceTableColumnHelper.accessor("gene", {
        id: "gene",
        header: "Gene",
        cell: ({ row }) => (
          <Link
            href={`/genes/${row.original.gene_id}`}
            className="text-utility-link font-content underline"
          >
            {row.original.gene}
          </Link>
        ),
      }),
      consequenceTableColumnHelper.accessor("aa_change", {
        id: "aa_change",
        header: "AA Change",
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
    [],
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    consequenceTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleTSVDownload = () => {
    const fileName = `consequences-table.${convertDateToString(
      new Date(),
    )}.tsv`;
    downloadTSV({
      tableData,
      columns: consequenceTableDefaultColumns,
      columnOrder,
      columnVisibility,
      fileName,
      option: {
        overwrite: {
          consequences: {
            composer: (consequenceData) =>
              consequenceData.consequences
                ? humanify({
                    term: consequenceData.consequences
                      .replace("_variant", "")
                      .replace("_", " "),
                  })
                : "",
          },
          impact: {
            composer: (consequenceData) => {
              const {
                impact: {
                  polyphen_impact,
                  polyphen_score,
                  sift_impact,
                  sift_score,
                  vep_impact,
                },
              } = consequenceData;

              const impactString = `${[
                `${vep_impact ? `VEP: ${vep_impact}` : ``}`,
                `${
                  sift_impact
                    ? `SIFT: ${sift_impact} - score ${sift_score}`
                    : ``
                }`,
                `${
                  polyphen_impact
                    ? `PolyPhen: ${polyphen_impact} - score ${polyphen_score}`
                    : ``
                }`,
              ]
                .filter(({ length }) => length)
                .join(", ")}`;
              return impactString;
            },
          },
          transcript: {
            composer: (consequenceData) => {
              const transcriptString = `${consequenceData.transcript}${
                consequenceData.is_canonical ? ` (Canonical)` : ""
              }`;
              return transcriptString;
            },
          },
        },
      },
    });
  };

  const handleJSONDownload = () => {
    setConsequenceTableJSONDownloadActive(true);
    const json = initialData.consequence.map(
      ({
        transcript: {
          aa_change,
          annotation: {
            hgvsc,
            polyphen_impact,
            polyphen_score,
            sift_score,
            sift_impact,
            vep_impact,
          },
          consequence_type,
          gene: { gene_id, gene_strand, symbol },
          transcript_id,
          is_canonical,
        },
      }) => {
        return {
          transcript_id,
          aa_change,
          is_canonical,
          consequence_type,
          annotation: {
            hgvsc,
            polyphen_impact,
            polyphen_score,
            sift_score,
            sift_impact,
            vep_impact,
          },
          gene: {
            gene_id,
            symbol,
            gene_strand,
          },
        };
      },
    );
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `consequences-data.${convertDateToString(new Date())}.json`);
    setConsequenceTableJSONDownloadActive(false);
  };

  return (
    <VerticalTable
      customDataTestID="table-consequences-mutation-summary"
      data={displayedData}
      tableTitle={
        <TotalItems total={tableData?.length} itemName="consequence" />
      }
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
        label: "consequence",
      }}
      additionalControls={
        <div className="flex gap-2 mb-2">
          <FunctionButton onClick={handleJSONDownload} disabled={isFetching}>
            {consequenceTableJSONDownloadActive ? <Loader /> : "JSON"}
          </FunctionButton>
          <FunctionButton onClick={handleTSVDownload} disabled={isFetching}>
            TSV
          </FunctionButton>
        </div>
      }
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
    />
  );
};

export default ConsequenceTable;
