import React from "react";
import { AnchorLink } from "@/components/AnchorLink";
import { CollapsibleTextArea } from "@/components/CollapsibleTextArea";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import {
  useGenesSummaryData,
  GeneSummaryData,
  FilterSet,
  useCoreSelector,
  selectCurrentCohortFilters,
} from "@gff/core";
import { FaBook, FaTable, FaRegChartBar as BarChartIcon } from "react-icons/fa";
import { HiPlus, HiMinus } from "react-icons/hi";
import { externalLinkNames, externalLinks, humanify } from "src/utils";
import CNVPlot from "../charts/CNVPlot";
import SSMPlot from "../charts/SSMPlot";
import { formatDataForHorizontalTable } from "../files/utils";
import { Grid, LoadingOverlay } from "@mantine/core";
import { GeneCancerDistributionTable } from "../cancerDistributionTable/CancerDistributionTable";
import { SMTableContainer } from "@/components/expandableTables/somaticMutations/SMTableContainer";
import { DEFAULT_GENE_SUMMARY_TABLE_ORDER } from "./mutationTableConfig";
import { ContextSensitiveBanner } from "@/components/ContextSensitiveBanner";
import { HeaderTitle } from "../shared/tailwindComponents";

interface GeneViewProps {
  data: {
    genes: GeneSummaryData;
  };
  gene_id: string;
  isModal: boolean;
  contextSensitive: boolean;
  contextFilters: FilterSet;
}

export const GeneSummary = ({
  gene_id,
  isModal = false,
  contextSensitive = false,
  contextFilters = undefined,
}: {
  gene_id: string;
  isModal?: boolean;
  contextSensitive?: boolean;
  contextFilters?: FilterSet;
}): JSX.Element => {
  const { data, isFetching } = useGenesSummaryData({
    gene_id,
  });

  return (
    <>
      {isFetching ? (
        <LoadingOverlay visible />
      ) : data && data.genes ? (
        <GeneView
          data={data}
          gene_id={gene_id}
          isModal={isModal}
          contextSensitive={contextSensitive}
          contextFilters={contextFilters}
        />
      ) : (
        <SummaryErrorHeader label="Gene Not Found" />
      )}
    </>
  );
};

const GeneView = ({
  data,
  gene_id,
  isModal,
  contextFilters = undefined,
  contextSensitive = false,
}: GeneViewProps) => {
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const formatDataForSummary = () => {
    const {
      genes: {
        symbol,
        name,
        synonyms,
        biotype: type,
        gene_chromosome,
        gene_start,
        gene_end,
        gene_strand,
        description,
        is_cancer_gene_census,
      },
    } = data;

    const location = `chr${gene_chromosome}:${gene_start}-${gene_end} (GRCh38)`;
    const Strand = gene_strand && gene_strand === 1 ? <HiPlus /> : <HiMinus />;
    const annotation = is_cancer_gene_census
      ? // TODO: need to change this after figuring out what to do with clicking on it
        "Cancer Gene Census"
      : "--";
    const synonymsList = synonyms?.length && (
      <ul>
        {synonyms?.map((s) => (
          <li className="list-none" key={s}>
            {s}
          </li>
        ))}
      </ul>
    );

    const desc = <CollapsibleTextArea text={description} />;

    const summaryObj = {
      symbol,
      name,
      synonyms: synonymsList,
      type,
      location,
      Strand,
      description: desc,
      annotation,
    };

    const headersConfig = Object.keys(summaryObj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(summaryObj, headersConfig);
  };

  const formatDataForExternalReferences = () => {
    const {
      genes: {
        external_db_ids: { entrez_gene, uniprotkb_swissprot, hgnc, omim_gene },
        gene_id,
        civic,
      },
    } = data;

    const externalLinksObj = {
      entrez_gene,
      uniprotkb_swissprot,
      hgnc,
      omim_gene,
      ensembl: gene_id,
      civic,
    };

    let externalReferenceLinksobj = {};

    Object.keys(externalLinksObj).forEach((link) => {
      const modified = {
        [`${externalLinkNames[link] || link.replace(/_/, " ")}`]:
          externalLinksObj[link] && externalLinksObj[link]?.length ? (
            <AnchorLink
              href={externalLinks[link](externalLinksObj[link])}
              title={externalLinksObj[link]}
            />
          ) : (
            "--"
          ),
      };

      externalReferenceLinksobj = { ...externalReferenceLinksobj, ...modified };
    });

    const headersConfig = Object.keys(externalReferenceLinksobj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(
      externalReferenceLinksobj,
      headersConfig,
    );
  };

  return (
    <div>
      {data?.genes && (
        <>
          {!isModal && (
            <SummaryHeader iconText="gn" headerTitle={data.genes.symbol} />
          )}

          <div className={`mx-auto ${isModal ? "mt-2" : "mt-20"} w-9/12 pt-4`}>
            {contextSensitive && <ContextSensitiveBanner />}
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
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <BarChartIcon size={20} className="text-accent" />
                <HeaderTitle>Cancer Distribution</HeaderTitle>
              </div>
              <Grid>
                <SSMPlot
                  page="gene"
                  gene={gene_id}
                  height={200}
                  genomicFilters={contextSensitive ? contextFilters : undefined}
                  cohortFilters={contextSensitive ? cohortFilters : undefined}
                />
                <CNVPlot
                  gene={gene_id}
                  height={200}
                  genomicFilters={contextSensitive ? contextFilters : undefined}
                  cohortFilters={contextSensitive ? cohortFilters : undefined}
                />
              </Grid>
              <GeneCancerDistributionTable
                gene={gene_id}
                symbol={data.genes.symbol}
                genomicFilters={contextSensitive ? contextFilters : undefined}
                cohortFilters={contextSensitive ? cohortFilters : undefined}
              />
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <BarChartIcon size={20} className="text-accent" />
                  <HeaderTitle>Most Frequent Somatic Mutations</HeaderTitle>
                </div>
                <SMTableContainer
                  columnsList={DEFAULT_GENE_SUMMARY_TABLE_ORDER}
                  geneSymbol={data.genes.symbol}
                  contextSensitive={contextSensitive}
                  genomicFilters={contextSensitive ? contextFilters : undefined}
                  // don't have to send this most probably (clean uppp)
                  cohortFilters={contextSensitive ? cohortFilters : undefined}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
