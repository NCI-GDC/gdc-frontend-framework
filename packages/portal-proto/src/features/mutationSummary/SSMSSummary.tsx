import React, { JSX, useMemo } from "react";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { useSsmsSummaryQuery } from "@gff/core";
import { Loader } from "@mantine/core";
import { HorizontalTableProps } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "../files/utils";
import { humanify } from "src/utils";
import { CollapsibleList } from "@/components/CollapsibleList";
import { AnchorLink } from "@/components/AnchorLink";
import SSMPlot from "../charts/SSMPlot";
import { ConsequenceTable } from "@/features/mutationSummary/ConsequenceTable";
import { HeaderTitle } from "@/components/tailwindComponents";
import SSMSCancerDistributionTable from "../CancerDistributionTable/SSMSCancerDistributionTable";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import MutationsIcon from "public/user-flow/icons/summary/gene-mutation.svg";
import { externalLinks, ExternalReferenceEntry } from "@/utils/externalLinks";
import {
  buildSsmExternalReferences,
  buildSsmSummary,
  SsmSummaryTableData,
} from "./utils";

const formatDataForSummary = (
  ssmSummary: SsmSummaryTableData,
): HorizontalTableProps["tableData"] => {
  const {
    uuid,
    dna_change,
    type,
    reference_genome_assembly,
    allele_in_the_reference_assembly,
    transcript_id,
    vep_impact,
    sift_impact,
    sift_score,
    polyphen_impact,
    polyphen_score,
  } = ssmSummary;

  const summaryObj = {
    uuid,
    dna_change,
    type,
    reference_genome_assembly,
    allele_in_the_reference_assembly,
    functional_impact: transcript_id ? (
      <div className="flex flex-col py-2 gap-0.5">
        <AnchorLink
          href={externalLinks.transcript(transcript_id)}
          title={transcript_id}
          iconText="C"
          toolTipLabel="Canonical"
        />
        {vep_impact && <span>VEP: {vep_impact}</span>}
        {(sift_impact || sift_score !== null) && (
          <div>
            {sift_impact && <span>SIFT: {sift_impact}</span>}
            {sift_score !== null && <span>&#44; score: {sift_score}</span>}
          </div>
        )}
        {(polyphen_impact || polyphen_score !== null) && (
          <div>
            {polyphen_impact && <span>PolyPhen: {polyphen_impact}</span>}
            {polyphen_score !== null && (
              <span>&#44; score: {polyphen_score}</span>
            )}
          </div>
        )}
      </div>
    ) : (
      "No canonical transcript"
    ),
  };

  const headersConfig = Object.keys(summaryObj).map((key) => ({
    field: key,
    name: humanify({ term: key }),
  }));

  return formatDataForHorizontalTable(summaryObj, headersConfig);
};

const formatDataForExternalReferences = (
  entries: ExternalReferenceEntry[],
): HorizontalTableProps["tableData"] => {
  const externalReferencesObj = Object.fromEntries(
    entries.map(({ label, ids, buildHref, linkTitle }) => [
      label,
      ids && (Array.isArray(ids) ? ids.length > 0 : ids) ? (
        Array.isArray(ids) ? (
          <CollapsibleList
            data={ids.map((id) => (
              <AnchorLink
                href={buildHref(id)}
                title={linkTitle ?? id}
                key={id}
              />
            ))}
          />
        ) : (
          <AnchorLink href={buildHref(ids)} title={linkTitle ?? ids} />
        )
      ) : (
        "--"
      ),
    ]),
  );

  const headersConfig = Object.keys(externalReferencesObj).map((key) => ({
    field: key,
    name: key,
  }));

  return formatDataForHorizontalTable(externalReferencesObj, headersConfig);
};

export const SSMSSummary = ({
  ssm_id,
  isModal = false,
}: {
  ssm_id: string;
  isModal?: boolean;
}): JSX.Element => {
  const { data: summaryData, isFetching } = useSsmsSummaryQuery({
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

  const ssmSummary = useMemo(
    () => (summaryData ? buildSsmSummary(summaryData) : null),
    [summaryData],
  );

  const entries = useMemo(
    () => (summaryData ? buildSsmExternalReferences(summaryData) : []),
    [summaryData],
  );

  return (
    <div>
      {isFetching ? (
        <Loader />
      ) : summaryData ? (
        <>
          <SummaryHeader
            Icon={MutationsIcon}
            headerTitleLeft="Mutation"
            headerTitle={summaryData.dna_change}
            isModal={isModal}
          />

          <div className={`${!isModal ? "mt-6" : "mt-4"} mx-4`}>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-summary-mutation-summary"
                  tableData={formatDataForSummary(ssmSummary)}
                />
              </div>
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-external-references-mutation-summary"
                  tableData={formatDataForExternalReferences(entries)}
                  title="External References"
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="mb-2">
                <HeaderTitle>Consequences</HeaderTitle>
              </div>
              <ConsequenceTable ssmsId={ssm_id} />
            </div>

            <div
              data-testid="table-cancer-distribution-mutation-summary"
              className="mt-8 mb-16"
            >
              <HeaderTitle>Cancer Distribution</HeaderTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
                <SSMPlot page="ssms" ssms={ssm_id} />
              </div>

              <SSMSCancerDistributionTable
                ssms={ssm_id}
                symbol={summaryData.dna_change}
              />
            </div>
          </div>
        </>
      ) : (
        <SummaryErrorHeader label="Mutation Not Found" />
      )}
    </div>
  );
};
