import Link from "next/link";
import { ProjectViewProps } from "./ProjectView";
import { CollapsibleList } from "@/components/CollapsibleList";
import {
  calculatePercentageAsNumber,
  humanify,
  sortByPropertyAsc,
} from "@/utils/index";
import { formatDataForHorizontalTable } from "../files/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PercentageLabel } from "@/components/PercentageLabel";

interface TableSummaryReturnType {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | JSX.Element
    | readonly string[]
  )[];
}

export const formatDataForSummary = (
  projectData: ProjectViewProps,
): TableSummaryReturnType[] => {
  const {
    project_id,
    program: {
      name: program,
      dbgap_accession_number: program_dbgap_accession_number,
    },
    primary_site,
    dbgap_accession_number,
    disease_type,
    name: project_name,
  } = projectData || {};

  const dbGaP_study_accession =
    program_dbgap_accession_number || dbgap_accession_number;

  const projectSummaryObj: Record<string, any> = {
    project_id,
    dbGaP_study_accession: (
      <Link
        href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${dbGaP_study_accession}`}
        className="underline text-utility-link"
        target="_blank"
      >
        {dbGaP_study_accession}
      </Link>
    ),
    project_name,
    ...(primary_site.length <= 1 &&
      disease_type.length > 0 && {
        disease_type:
          disease_type.length > 1 ? (
            <CollapsibleList
              data={disease_type.slice(0).sort()}
              limit={0}
              expandText={`${disease_type.length} Disease Types`}
              collapseText="collapse"
              customUlStyle="pl-3"
              customLiStyle="list-disc"
              customToggleTextStyle="not-italic"
            />
          ) : (
            disease_type
          ),
      }),
    ...(primary_site.length === 1 && { primary_site }),
    program,
  };

  const headersConfig = Object.keys(projectSummaryObj).map((key) => ({
    field: key,
    name: humanify({ term: key }),
  }));

  return formatDataForHorizontalTable(projectSummaryObj, headersConfig);
};

export const formatDataForDataCategoryTable = (
  projectData: ProjectViewProps,
): {
  data: {
    readonly case_count: number;
    readonly data_category: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly case_count: number;
      readonly data_category: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedDataCategories = sortByPropertyAsc(
    projectData.summary.data_categories,
    "data_category",
  );

  const dataCategoryTableColumnHelper =
    createColumnHelper<typeof sortedDataCategories[0]>();

  const dataCategoryTableColumns = [
    dataCategoryTableColumnHelper.display({
      id: "data_category",
      header: () => <div className="text-sm leading-[18px]">Data Category</div>,
      cell: ({ row }) => row.original.data_category,
    }),
    dataCategoryTableColumnHelper.display({
      id: "case_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Cases
          </div>
          <div className="basis-2/3 pl-1 font-normal">
            (n={projectData.summary.case_count.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const caseCountPercentage = calculatePercentageAsNumber(
          row.original.case_count,
          projectData.summary.case_count,
        );

        return (
          <PercentageLabel
            count={row.original.case_count}
            countPercentage={caseCountPercentage}
          />
        );
      },
    }),
    dataCategoryTableColumnHelper.display({
      id: "file_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal">
            (n={projectData.summary.file_count.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          projectData.summary.file_count,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedDataCategories, columns: dataCategoryTableColumns };
};

export const getAnnotationsLinkParams = (
  projectData: ProjectViewProps,
): string => {
  if (projectData.annotation.count === 0) return null;

  if (projectData.annotation.count === 1) {
    return `https://portal.gdc.cancer.gov/v1/annotations/${projectData.annotation.list[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/v1/annotations?filters={"content":[{"content":{"field":"annotations.project.project_id","value":["${projectData.project_id}"]},"op":"in"}],"op":"and"}`;
};

export const formatDataForExpCategoryTable = (
  projectData: ProjectViewProps,
): {
  data: {
    readonly case_count: number;
    readonly experimental_strategy: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly case_count: number;
      readonly experimental_strategy: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedExpStrategies = sortByPropertyAsc(
    projectData.summary.experimental_strategies,
    "experimental_strategy",
  );

  const expStrategiesTableColumnHelper =
    createColumnHelper<typeof sortedExpStrategies[0]>();

  const expCategoryTableColumns = [
    expStrategiesTableColumnHelper.display({
      id: "data_category",
      header: () => (
        <div className="text-sm leading-[18px]">Experimental Strategy</div>
      ),
      cell: ({ row }) => row.original.experimental_strategy,
    }),
    expStrategiesTableColumnHelper.display({
      id: "case_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Cases
          </div>
          <div className="basis-2/3 pl-1 font-normal">
            (n={projectData.summary.case_count.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const caseCountPercentage = calculatePercentageAsNumber(
          row.original.case_count,
          projectData.summary.case_count,
        );

        return (
          <PercentageLabel
            count={row.original.case_count}
            countPercentage={caseCountPercentage}
          />
        );
      },
    }),
    expStrategiesTableColumnHelper.display({
      id: "file_count",
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal">
            (n={projectData.summary.file_count.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          projectData.summary.file_count,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedExpStrategies, columns: expCategoryTableColumns };
};
