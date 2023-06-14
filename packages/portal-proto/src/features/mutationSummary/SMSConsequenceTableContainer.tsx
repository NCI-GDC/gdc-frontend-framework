import { useSsmsConsequenceTable } from "@gff/core";
import { useMemo, useState } from "react";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
import { ButtonTooltip } from "@/components/expandableTables/shared";
import { HandleChangeInput, VerticalTable } from "../shared/VerticalTable";
import { ConsequenceColumnListOrder } from "./ConsequenceTableColumns";
import Link from "next/link";
import { AnchorLink } from "@/components/AnchorLink";
import { externalLinks } from "src/utils";
import { SMTableImpacts } from "../SomaticMutations/TableRowComponents";

export interface SMSConsequenceTableContainerProps {
  ssmsId: string;
}

export const SMSConsequenceTableContainer: React.FC<
  SMSConsequenceTableContainerProps
> = ({ ssmsId }: SMSConsequenceTableContainerProps) => {
  const {
    data: { status, ssmsConsequence: initialData },
  } = useSsmsConsequenceTable({
    pageSize: 99, // get max 100 entries
    offset: 0,
    mutationId: ssmsId,
  });

  const [columns, setColumns] = useState(ConsequenceColumnListOrder);
  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "newHeadings":
        setColumns(obj.newHeadings);
        break;
    }
  };

  const formattedTableData = useMemo(() => {
    if (status === "fulfilled") {
      const filtered = [
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
      ];

      return filtered?.map(
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
        }) => ({
          gene: (
            <Link href={`/genes/${gene_id}`}>
              <a className="text-utility-link font-content underline">
                {symbol}
              </a>
            </Link>
          ),
          aa_change: aa_change ?? "--",
          DNAChange: hgvsc,
          consequences: consequence_type,
          impact: (
            <SMTableImpacts
              impact={{
                polyphenImpact: polyphen_impact,
                polyphenScore: polyphen_score,
                siftImpact: sift_impact,
                siftScore: sift_score,
                vepImpact: vep_impact,
              }}
            />
          ),
          gene_strand: gene_strand > 0 ? "+" : "-",
          transcript_id: (
            <div>
              {transcript_id ? (
                <AnchorLink
                  href={externalLinks.transcript(transcript_id)}
                  title={transcript_id}
                  toolTipLabel={is_canonical ? "Canonical" : undefined}
                  iconText={is_canonical ? "C" : undefined}
                />
              ) : null}
            </div>
          ),
        }),
      );
    } else return [];
  }, [initialData.consequence, status]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(formattedTableData);

  return (
    <VerticalTable
      tableData={displayedData}
      columns={columns}
      selectableRow={false}
      showControls={true}
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
      pagination={{
        page,
        pages,
        size,
        from,
        total,
      }}
      status={
        status === "pending"
          ? "pending"
          : status === "fulfilled"
          ? "fulfilled"
          : status === "rejected"
          ? "rejected"
          : "uninitialized"
      }
      handleChange={handleChange}
      columnSorting="none"
    />
  );
};

export default SMSConsequenceTableContainer;
