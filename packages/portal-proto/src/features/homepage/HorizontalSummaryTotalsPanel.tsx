import { SummaryStatsItem } from "@/features/homepage/SummaryStatsItem";
import { useTotalCounts, useVersionInfoDetails } from "@gff/core";
import { AnchorLink } from "@/components/AnchorLink";

const HorizontalSummaryTotalsPanel = (): JSX.Element => {
  const { data: versionInfo, isSuccess: isVersionInfoSuccess } =
    useVersionInfoDetails();
  const { data: countsInfo } = useTotalCounts();
  const ICON_SIZE = 40;
  return (
    <div className="flex flex-col mt-11">
      <div className="flex flex-col">
        <h2 className="font-heading text-md font-bold text-summarybar-text">
          Data Portal Summary
        </h2>
        <AnchorLink
          title={isVersionInfoSuccess ? versionInfo.data_release : "..."}
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
        />
      </div>
      <div
        className="grid grid-cols-6 divide-x py-3 mt-2 bg-base-max rounded-md border-1 border-summarybar-border shadow-lg justify-between"
        data-testid="homepage-live-statistics"
      >
        <SummaryStatsItem
          title="Projects"
          count={countsInfo.projectsCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/projects.svg"
        />
        <SummaryStatsItem
          title="Primary Sites"
          count={countsInfo.primarySiteCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/primary-sites.svg"
        />
        <SummaryStatsItem
          title="Cases"
          count={countsInfo.repositoryCaseCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/users.svg"
        />
        <SummaryStatsItem
          title="Files"
          count={countsInfo.fileCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/files.svg"
        />
        <SummaryStatsItem
          title="Genes"
          count={countsInfo.genesCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/genes.svg"
        />
        <SummaryStatsItem
          title="Mutations"
          count={countsInfo.mutationCounts}
          size={ICON_SIZE}
          icon="/user-flow/icons/summary/gene-mutation.svg"
        />
      </div>
    </div>
  );
};

export default HorizontalSummaryTotalsPanel;
