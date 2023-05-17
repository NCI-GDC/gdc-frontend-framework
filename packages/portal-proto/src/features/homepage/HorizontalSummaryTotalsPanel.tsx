import { SummaryStatsItem } from "@/features/homepage/SummaryStatsItem";
import { useTotalCounts, useVersionInfoDetails } from "@gff/core";
import { AnchorLink } from "@/components/AnchorLink";
import ProjectsIcon from "public/user-flow/icons/summary/projects.svg";
import PrimarySitesIcon from "public/user-flow/icons/summary/primary-sites.svg";
import UsersIcon from "public/user-flow/icons/summary/users.svg";
import FilesIcon from "public/user-flow/icons/summary/files.svg";
import GenesIcon from "public/user-flow/icons/summary/genes.svg";
import MutationsIcon from "public/user-flow/icons/summary/gene-mutation.svg";

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
          icon={
            <ProjectsIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Projects counts"
              role="img"
            />
          }
        />
        <SummaryStatsItem
          title="Primary Sites"
          count={countsInfo.primarySiteCounts}
          icon={
            <PrimarySitesIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Primary Sites counts"
              role="img"
            />
          }
        />
        <SummaryStatsItem
          title="Cases"
          count={countsInfo.repositoryCaseCounts}
          icon={
            <UsersIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Cases counts"
              role="img"
            />
          }
        />
        <SummaryStatsItem
          title="Files"
          count={countsInfo.fileCounts}
          icon={
            <FilesIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Files counts"
              role="img"
            />
          }
        />
        <SummaryStatsItem
          title="Genes"
          count={countsInfo.genesCounts}
          icon={
            <GenesIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Genes counts"
              role="img"
            />
          }
        />
        <SummaryStatsItem
          title="Mutations"
          count={countsInfo.mutationCounts}
          icon={
            <MutationsIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-label="Mutations counts"
              role="img"
            />
          }
        />
      </div>
    </div>
  );
};

export default HorizontalSummaryTotalsPanel;
