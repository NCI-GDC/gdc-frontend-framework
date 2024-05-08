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
  const IconFormatted = ({
    Icon,
    label,
  }: {
    Icon: any;
    label: string;
  }): JSX.Element => (
    <div className="rounded-full bg-summarybar-icon-background">
      <Icon className="p-1.5 w-[40px] h-[40px]" aria-label={label} role="img" />
    </div>
  );
  return (
    <div className="flex flex-col mt-11">
      <div className="flex flex-col">
        <h2 className="font-heading text-2xl md:text-xl xl:text-md font-bold text-summarybar-text">
          Data Portal Summary
        </h2>
        <AnchorLink
          customDataTestID="text-homepage-release-notes"
          title={isVersionInfoSuccess ? versionInfo.data_release : "..."}
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
          customStyle="text-lg md:text-[1rem] text-primary"
        />
      </div>
      <div
        className="grid grid-cols-3 gap-y-6 w-full md:grid-cols-6 divide-x py-3 mt-2 bg-base-max rounded-md border-1 border-summarybar-border shadow-lg justify-between text-center"
        data-testid="homepage-live-statistics"
      >
        <SummaryStatsItem
          title="Projects"
          customDataTestID="text-projects-gdc-count"
          count={countsInfo.projectsCounts}
          icon={<IconFormatted label="Projects counts" Icon={ProjectsIcon} />}
        />
        <SummaryStatsItem
          title="Primary Sites"
          customDataTestID="text-primary-sites-gdc-count"
          count={countsInfo.primarySiteCounts}
          icon={
            <IconFormatted
              label="Primary Sites counts"
              Icon={PrimarySitesIcon}
            />
          }
        />
        <SummaryStatsItem
          title="Cases"
          customDataTestID="text-cases-gdc-count"
          count={countsInfo.repositoryCaseCounts}
          icon={<IconFormatted label="Cases counts" Icon={UsersIcon} />}
        />
        <SummaryStatsItem
          title="Files"
          customDataTestID="text-files-gdc-count"
          count={countsInfo.fileCounts}
          icon={<IconFormatted label="Files counts" Icon={FilesIcon} />}
        />
        <SummaryStatsItem
          title="Genes"
          customDataTestID="text-genes-gdc-count"
          count={countsInfo.genesCounts}
          icon={<IconFormatted label="Genes counts" Icon={GenesIcon} />}
        />
        <SummaryStatsItem
          title="Mutations"
          customDataTestID="text-mutations-gdc-count"
          count={countsInfo.mutationCounts}
          icon={<IconFormatted label="Mutations counts" Icon={MutationsIcon} />}
        />
      </div>
    </div>
  );
};

export default HorizontalSummaryTotalsPanel;
