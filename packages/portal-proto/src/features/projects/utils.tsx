import Link from "next/link";
import { ProjectViewProps } from "./ProjectView";
import { CollapsibleList } from "@/components/CollapsibleList";
import {
  calculatePercentageAsNumber,
  humanify,
  sortByPropertyAsc,
} from "@/utils/index";
import { formatDataForHorizontalTable } from "../files/utils";
import {
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
} from "../shared/tailwindComponents";

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
        passHref
      >
        <a className="underline text-utility-link" target="_blank">
          {dbGaP_study_accession}
        </a>
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
  headers: JSX.Element[];
  tableRows: {
    data_category: string;
    case_count: JSX.Element;
    file_count: JSX.Element;
  }[];
} => {
  const sortedDataCategories = sortByPropertyAsc(
    projectData.summary.data_categories,
    "data_category",
  );

  const rows = sortedDataCategories.map((data_c) => {
    const caseCountPercentage = calculatePercentageAsNumber(
      data_c.case_count,
      projectData.summary.case_count,
    );

    const fileCountPercentage = calculatePercentageAsNumber(
      data_c.file_count,
      projectData.summary.file_count,
    );

    return {
      data_category: data_c.data_category,
      // TODO: Need to change it to Link after the href has been finalized
      case_count: (
        <div className="flex">
          <div className="basis-1/3 text-right">
            {data_c.case_count.toLocaleString()}
          </div>
          <div className="basis-2/3 pl-1">
            <PercentBar>
              <PercentBarLabel>{`${caseCountPercentage.toFixed(
                2,
              )}%`}</PercentBarLabel>
              <PercentBarComplete
                style={{ width: `${caseCountPercentage}%` }}
              />
            </PercentBar>
          </div>
        </div>
      ),
      // TODO: Need to change it to Link after the href has been finalized
      file_count: (
        <div className="flex">
          <div className="basis-1/3 text-right">
            {data_c.file_count.toLocaleString()}
          </div>
          <div className="basis-2/3 pl-1">
            <PercentBar>
              <PercentBarLabel>{`${fileCountPercentage.toFixed(
                2,
              )}%`}</PercentBarLabel>
              <PercentBarComplete
                style={{ width: `${fileCountPercentage}%` }}
              />
            </PercentBar>
          </div>
        </div>
      ),
    };
  });

  return {
    headers: [
      <div key="project_summary_data_table_data_category">Data Category</div>,
      <div key="project_summary_data_table_cases_header" className="flex">
        <div className="basis-1/3 text-right">Cases</div>
        <div className="basis-2/3 pl-1">
          (n={projectData.summary.case_count.toLocaleString()})
        </div>
      </div>,
      <div key="project_summary_data_table_files_header" className="flex">
        <div className="basis-1/3 text-right">Files</div>
        <div className="basis-2/3 pl-1">
          (n={projectData.summary.file_count.toLocaleString()})
        </div>
      </div>,
    ],
    tableRows: rows,
  };
};

export const getAnnotationsLinkParams = (
  projectData: ProjectViewProps,
): string => {
  if (projectData.annotation.count === 0) return null;

  if (projectData.annotation.count === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${projectData.annotation.list[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.project.project_id","value":["${projectData.project_id}"]},"op":"in"}],"op":"and"}`;
};

export const formatDataForExpCategoryTable = (
  projectData: ProjectViewProps,
): {
  headers: JSX.Element[];
  tableRows: {
    experimental_strategy: string;
    case_count: JSX.Element;
    file_count: JSX.Element;
  }[];
} => {
  const sortedExpCategories = sortByPropertyAsc(
    projectData.summary.experimental_strategies,
    "experimental_strategy",
  );

  const rows = sortedExpCategories.map((exp_c) => {
    const caseCountPercentage = calculatePercentageAsNumber(
      exp_c.case_count,
      projectData.summary.case_count,
    );

    const fileCountPercentage = calculatePercentageAsNumber(
      exp_c.file_count,
      projectData.summary.file_count,
    );

    return {
      experimental_strategy: exp_c.experimental_strategy,
      // TODO: Need to change it to Link after the href has been finalized
      case_count: (
        <div className="flex">
          <div className="basis-1/3 text-right">
            {exp_c.case_count.toLocaleString()}
          </div>
          <div className="basis-2/3 pl-1">
            <PercentBar>
              <PercentBarLabel>{`${caseCountPercentage.toFixed(
                2,
              )}%`}</PercentBarLabel>
              <PercentBarComplete
                style={{ width: `${caseCountPercentage}%` }}
              />
            </PercentBar>
          </div>
        </div>
      ),
      // TODO: Need to change it to Link after the href has been finalized
      file_count: (
        <div className="flex">
          <div className="basis-1/3 text-right">
            {exp_c.file_count.toLocaleString()}
          </div>
          <div className="basis-2/3 pl-1">
            <PercentBar>
              <PercentBarLabel>{`${fileCountPercentage.toFixed(
                2,
              )}%`}</PercentBarLabel>
              <PercentBarComplete
                style={{ width: `${fileCountPercentage}%` }}
              />
            </PercentBar>
          </div>
        </div>
      ),
    };
  });

  return {
    headers: [
      <div key="project_summary_exp_table_data_category">
        Experimental Strategy
      </div>,
      <div key="project_summary_exp_table_cases_header" className="flex">
        <div className="basis-1/3 text-right">Cases</div>
        <div className="basis-2/3 pl-1">
          (n={projectData.summary.case_count.toLocaleString()})
        </div>
      </div>,
      <div key="project_summary_exp_table_files_header" className="flex">
        <div className="basis-1/3 text-right">Files</div>
        <div className="basis-2/3 pl-1">
          (n={projectData.summary.file_count.toLocaleString()})
        </div>
      </div>,
    ],
    tableRows: rows,
  };
};
