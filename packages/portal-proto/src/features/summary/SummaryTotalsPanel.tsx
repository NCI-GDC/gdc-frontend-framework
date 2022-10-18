import { useVersionInfoDetails, useTotalCounts } from "@gff/core";
import { Image } from "@/components/Image";
import { AnchorLink } from "@/components/AnchorLink";

interface SummaryStatsItemProp {
  readonly title: string;
  readonly icon: string;
  readonly count: number;
  readonly size?: number;
}

const SummaryStatsItem: React.FC<SummaryStatsItemProp> = ({
  title,
  icon,
  count,
  size = 24,
}: SummaryStatsItemProp) => {
  return (
    <div className="flex flex-col flex-nowrap font-medium justify-center content-center font-heading ">
      <div className="flex flex-row flex-nowrap justify-center content-center text-md">
        {title}
      </div>
      <div className="flex flex-row flex-nowrap justify-center content-center text-2xl ">
        <Image src={icon} width={size} height={size} />{" "}
        <span className="pl-2">
          {count && count >= 0 ? count.toLocaleString() : ""}
        </span>
      </div>
    </div>
  );
};

const SummaryTotalsPanel = (): JSX.Element => {
  const { data: versionInfo, isSuccess: isVersionInfoSuccess } =
    useVersionInfoDetails();
  const { data: countsInfo } = useTotalCounts();

  return (
    <div className="flex flex-col bg-base-lightest border-primary border-t-8 border-0 p-4 opacity-90 shadow-md hover:shadow-lg  ">
      <div className="flex flex-row items-end justify-items-end">
        <p className="font-heading text-lg text-base-contrast-lightest pr-2">
          Data Portal Summary
        </p>
        <AnchorLink
          title={isVersionInfoSuccess ? versionInfo.data_release : "..."}
          href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 p-4 bg-opacity-0">
        <SummaryStatsItem
          title="PROJECTS"
          count={countsInfo.projectsCounts}
          size={24}
          icon="/user-flow/icons/projects.svg"
        />
        <SummaryStatsItem
          title="PRIMARY SITES"
          count={countsInfo.primarySiteCounts}
          size={24}
          icon="/user-flow/icons/primary_sites.svg"
        />
        <SummaryStatsItem
          title="CASES"
          count={countsInfo.repositoryCaseCounts}
          size={24}
          icon="/user-flow/icons/user.svg"
        />
        <SummaryStatsItem
          title="FILES"
          count={countsInfo.fileCounts}
          size={24}
          icon="/user-flow/icons/files.svg"
        />
        <SummaryStatsItem
          title="GENES"
          count={countsInfo.genesCounts}
          size={24}
          icon="/user-flow/icons/genes.svg"
        />
        <SummaryStatsItem
          title="MUTATIONS"
          count={countsInfo.mutationCounts}
          size={32}
          icon="/user-flow/icons/gene-mutation.svg"
        />
      </div>
    </div>
  );
};

export default SummaryTotalsPanel;
