import { SummaryStatsItem } from "@/features/summary/SummaryStatsItem";
import { useTotalCounts, useVersionInfoDetails } from "@gff/core";
import { AnchorLink } from "@/components/AnchorLink";

const HorizontalSummaryTotalsPanel = (): JSX.Element => {
  const { data: versionInfo, isSuccess: isVersionInfoSuccess } =
    useVersionInfoDetails();
  const { data: countsInfo } = useTotalCounts();

  return (
    <div className="flex flex-col p-4 shadow-md hover:shadow-lg">
      <div className="flex flex-col">
        <p className="font-heading text-lg text-summarybar-text pr-2">
          Data Portal Summary
        </p>
        <AnchorLink
          title={isVersionInfoSuccess ? versionInfo.data_release : "..."}
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
        />
      </div>
      <div className="grid grid-cols-6 divide-x py-3  bg-base-max rounded-md border-2 border-summarybar-borber shadow-lg justify-between">
        <SummaryStatsItem
          title="Projects"
          count={countsInfo.projectsCounts}
          size={24}
          icon="/user-flow/icons/projects.svg"
        />
        <SummaryStatsItem
          title="Primary Sites"
          count={countsInfo.primarySiteCounts}
          size={24}
          icon="/user-flow/icons/primary_sites.svg"
        />
        <SummaryStatsItem
          title="Cases"
          count={countsInfo.repositoryCaseCounts}
          size={24}
          icon="/user-flow/icons/user.svg"
        />
        <SummaryStatsItem
          title="Files"
          count={countsInfo.fileCounts}
          size={24}
          icon="/user-flow/icons/files.svg"
        />
        <SummaryStatsItem
          title="Genes"
          count={countsInfo.genesCounts}
          size={24}
          icon="/user-flow/icons/genes.svg"
        />
        <SummaryStatsItem
          title="Mutations"
          count={countsInfo.mutationCounts}
          size={24}
          icon="/user-flow/icons/gene-mutation.svg"
        />
      </div>
    </div>
  );
};

export default HorizontalSummaryTotalsPanel;
