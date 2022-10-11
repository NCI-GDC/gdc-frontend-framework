import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { useSSMS } from "@gff/core";
import { pick } from "lodash";
import { HorizontalTableProps } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "../files/utils";
import { externalLinks, humanify } from "src/utils";
import { FaBook, FaTable } from "react-icons/fa";
import { CollapsibleList } from "@/components/CollapsibleList";
import { AnchorLink } from "@/components/AnchorLink";
import SSMPlot from "../charts/SSMPlot";

export const SSMSSummary = ({ ssm_id }: { ssm_id: string }): JSX.Element => {
  const { data: summaryData, isFetching } = useSSMS({
    filters: {
      content: {
        field: "ssm_id",
        value: ssm_id,
      },
      op: "=",
    },
    expand: ["consequence.transcript", "consequence.transcript.annotation"],
    fields: [
      "reference_allele",
      "genomic_dna_change",
      "mutation_subtype",
      "ncbi_build",
      "reference_allele",
      "cosmic_id",
      "clinical_annotations.civic.variant_id",
    ],
    size: 1,
  });

  const formatDataForSummary = (): HorizontalTableProps["tableData"] => {
    const obj = pick(summaryData, [
      "uuid",
      "dna_change",
      "type",
      "reference_genome_assembly",
      "allele_in_the_reference_assembly",
    ]);

    const {
      transcript: {
        transcript_id,
        annotation: {
          vep_impact,
          sift_impact,
          sift_score,
          polyphen_impact,
          polyphen_score,
        },
      },
    } = summaryData;

    const functionalImpact = {
      functional_impact: (
        <>
          {transcript_id ? (
            <div className="flex-col">
              <AnchorLink
                href={externalLinks.transcript(transcript_id)}
                title={transcript_id}
                iconText="C"
                toolTipLabel="Canonical"
              />

              {vep_impact && (
                <span className="-mt-1 block">VEP: {vep_impact}</span>
              )}
              {sift_impact && sift_score && (
                <div>
                  <span>SIFT: {sift_impact}</span>
                  <span>, score: {sift_score}</span>
                </div>
              )}
              {polyphen_impact && polyphen_score && (
                <div>
                  <span>PolyPhen: {polyphen_impact}</span>
                  <span>, score: {polyphen_score}</span>
                </div>
              )}
            </div>
          ) : (
            "No canonical transcript"
          )}
        </>
      ),
    };
    const summaryObj = { ...obj, ...functionalImpact };

    const headersConfig = Object.keys(summaryObj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(summaryObj, headersConfig);
  };

  const formatDataForExternalReferences = () => {
    const {
      cosmic_id,
      civic,
      transcript: {
        annotation: { dbsnp },
      },
    } = summaryData;

    const arr = [];
    arr.push([
      "dbsnp",
      dbsnp && /rs(\d+)$/g.test(dbsnp) ? (
        <AnchorLink href={externalLinks.dbsnp(dbsnp)} title={dbsnp} />
      ) : (
        "--"
      ),
    ]);
    arr.push([
      "cosmic",
      cosmic_id ? (
        <CollapsibleList
          data={cosmic_id.map((id) => (
            <AnchorLink
              href={externalLinks[id.substring(0, 4).toLowerCase()](
                id.match(/(\d+)$/g),
              )}
              title={id}
              key={id}
            />
          ))}
        />
      ) : (
        "--"
      ),
    ]);
    arr.push([
      "civic",
      civic ? (
        <AnchorLink href={externalLinks.civicMutaton(civic)} title={civic} />
      ) : (
        "--"
      ),
    ]);
    const headersConfig = arr.map(([key]) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    const externalLinksObj = { ...Object.fromEntries(arr) };
    return formatDataForHorizontalTable(externalLinksObj, headersConfig);
  };

  return (
    <div>
      {!isFetching && summaryData ? (
        <>
          <SummaryHeader iconText="MU" headerTitle={summaryData.dna_change} />
          <div className="mx-auto mt-20 w-9/12 pt-4">
            <div className="text-primary-content">
              <div className="flex gap-6">
                <div className="flex-1">
                  <SummaryCard
                    tableData={formatDataForSummary()}
                    Icon={FaTable}
                  />
                </div>
                <div className="flex-1">
                  <SummaryCard
                    tableData={formatDataForExternalReferences()}
                    Icon={FaBook}
                    title="External References"
                  />
                </div>
              </div>
            </div>
            <div>
              <SSMPlot page={"ssms"} ssms={ssm_id} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
