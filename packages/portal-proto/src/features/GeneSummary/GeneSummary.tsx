import React, { JSX, useMemo } from "react";
import { AnchorLink } from "@/components/AnchorLink";
import { CollapsibleTextArea } from "@/components/CollapsibleTextArea";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import {
  useGeneSummaryQuery,
  GeneSummaryData,
  FilterSet,
  useCoreSelector,
  selectCurrentCohortFilters,
} from "@gff/core";
import { humanify } from "src/utils";
import CNVPlot from "../charts/CNVPlot";
import SSMPlot from "../charts/SSMPlot";
import { formatDataForHorizontalTable } from "../files/utils";
import { LoadingOverlay } from "@mantine/core";
import { WarningBanner } from "@gff/portal-components";
import { HeaderTitle } from "@/components/tailwindComponents";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { overwritingDemoFilterMutationFrequency } from "../genomic/GenesAndMutationFrequencyAnalysisTool";
import { CollapsibleList } from "@/components/CollapsibleList";
import SMTableContainer from "../GenomicTables/SomaticMutationsTable/SMTableContainer";
import GeneCancerDistributionTable from "../CancerDistributionTable/GeneCancerDistributionTable";
import GenesIcon from "public/user-flow/icons/summary/genes.svg";
import { StrandMinusIcon, StrandPlusIcon } from "@/utils/icons";
import {
  buildGeneExternalReferences,
  buildGeneSummary,
  GeneSummaryTableData,
} from "./utils";
import { ExternalReferenceEntry } from "@/utils/externalLinks";

const formatDataForSummary = (summaryData: GeneSummaryTableData) => {
  const {
    symbol,
    name,
    synonyms,
    type,
    location,
    strand,
    description,
    isCancerGeneCensus,
  } = summaryData;

  const summaryObj = {
    symbol,
    name,
    synonyms: synonyms?.length ? (
      <ul>
        {synonyms.map((s) => (
          <li className="list-none" key={s}>
            {s}
          </li>
        ))}
      </ul>
    ) : (
      "--"
    ),
    type,
    location,
    strand: strand ? (
      strand === 1 ? (
        <StrandPlusIcon />
      ) : (
        <StrandMinusIcon />
      )
    ) : (
      "--"
    ),
    description: description ? (
      <CollapsibleTextArea text={description} />
    ) : (
      "--"
    ),
    annotation: isCancerGeneCensus ? (
      <AnchorLink
        href="https://cancer.sanger.ac.uk/census"
        title="Cancer Gene Census"
      />
    ) : (
      "--"
    ),
  };

  const headersConfig = Object.keys(summaryObj).map((key) => ({
    field: key,
    name: humanify({ term: key }),
  }));

  return formatDataForHorizontalTable(summaryObj, headersConfig);
};

const formatDataForExternalReferences = (entries: ExternalReferenceEntry[]) => {
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

interface GeneViewProps {
  data: GeneSummaryData;
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
  const { data, isFetching } = useGeneSummaryQuery({
    gene_id,
  });
  return (
    <>
      {isFetching ? (
        <LoadingOverlay data-testid="loading-spinner" visible />
      ) : data ? (
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
  const isDemo = useIsDemoApp();
  const currentCohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  // Since genomic filter lies in different store, it cannot be accessed using selectors.
  // Hence, passing it via a callback as contextFilters
  const genomicFilters = useMemo(
    () => (contextSensitive ? contextFilters : undefined),
    [contextFilters, contextSensitive],
  );

  const cohortFilters = useMemo(() => {
    if (!contextSensitive) return undefined;
    // if it's for mutation frequency demo use different filter (TCGA-LGG) than the current cohort filter
    return isDemo
      ? overwritingDemoFilterMutationFrequency
      : currentCohortFilters;
  }, [contextSensitive, isDemo, currentCohortFilters]);

  const summaryData = useMemo(() => buildGeneSummary(data), [data]);
  const entries = useMemo(() => buildGeneExternalReferences(data), [data]);

  return (
    <div>
      {data && (
        <>
          <SummaryHeader
            Icon={GenesIcon}
            headerTitleLeft="Gene"
            headerTitle={data.symbol}
            isModal={isModal}
          />

          <div className={`${!isModal ? "mt-6" : "mt-4"} mx-4`}>
            {contextSensitive && (
              <div className="my-6">
                <WarningBanner
                  text={
                    "Viewing subset of the GDC based on your current cohort and Mutation Frequency filters."
                  }
                />
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-summary-gene-summary"
                  tableData={formatDataForSummary(summaryData)}
                />
              </div>
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-external-references-gene-summary"
                  tableData={formatDataForExternalReferences(entries)}
                  title="External References"
                />
              </div>
            </div>
            <div
              data-testid="table-cancer-distribution-gene-summary"
              className="mt-8"
            >
              <HeaderTitle>Cancer Distribution</HeaderTitle>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SSMPlot
                  page="gene"
                  gene={gene_id}
                  height={200}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
                <CNVPlot
                  gene={gene_id}
                  height={200}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
              </div>
              <div className="mt-8">
                <GeneCancerDistributionTable
                  gene={gene_id}
                  symbol={data.symbol}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
              </div>

              <div className="mt-8 mb-16">
                <SMTableContainer
                  geneSymbol={data.symbol}
                  gene_id={gene_id}
                  cohortFilters={cohortFilters}
                  genomicFilters={genomicFilters}
                  isModal={isModal}
                  inModal={isModal}
                  tableTitle="Most Frequent Somatic Mutations"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
