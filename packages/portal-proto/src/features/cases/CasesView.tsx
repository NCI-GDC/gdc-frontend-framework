import {
  fetchCases,
  selectCurrentCohortCaseGqlFilters,
  selectCohortCountsByName,
  useCoreDispatch,
  selectCasesData,
  useCoreSelector,
} from "@gff/core";
import { Table, Pagination, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { GqlOperation } from "@gff/core/dist/dts/features/gdcapi/filters";

export interface Case {
  readonly id: string;
  readonly submitterId: string;
  readonly primarySite: string;
  readonly projectId: string;
  readonly gender: string;
  readonly primaryDiagnosis: string;
  readonly tissueOrOrganOfOrigin: string;
}

export interface CasesViewProps {
  readonly cases?: ReadonlyArray<Case>;
  readonly handleCaseSelected?: (patient: Case) => void;
  readonly caption?:string;
}

export interface ContextualCasesViewProps {
  readonly handleCaseSelected?: (patient: Case) => void;
}

const useCohortFacetFilter = (): GqlOperation => {
  return useCoreSelector((state) =>
    selectCurrentCohortCaseGqlFilters(state),
  );
};

/**
 * TODO: This needs to move to core
 * @param pageSize
 * @param offset
 */
const useCohortCases = (pageSize = 10, offset = 0) => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCohortFacetFilter();
  const cases =  useCoreSelector((state) =>
    selectCasesData(state),
  );

  // cohortFilters is generated each time, use string representation
  // to control when useEffects are called
  const filters = JSON.stringify(cohortFilters)

  useEffect(() => {
      coreDispatch(fetchCases(
        {
          fields: [
            "case_id",
            "submitter_id",
            "primary_site",
            "project.project_id",
            "demographic.gender",
            "diagnoses.primary_diagnosis",
            "diagnoses.tissue_or_organ_of_origin",
          ],
          filters: cohortFilters, // TODO: move filter setting to core
          size: pageSize,
          from: offset * pageSize,
        }
      ));

  }, [filters, pageSize, offset]);

  return {
    data: cases.data,
    error: cases?.error,
    isUninitialized: cases === undefined,
    isFetching: cases?.status === "pending",
    isSuccess: cases?.status === "fulfilled",
    isError: cases?.status === "rejected",
  };
};

export const ContextualCasesView: React.FC<ContextualCasesViewProps> = (
  props: ContextualCasesViewProps,
) => {
  // TODO useContextualCases() that filters based on the context
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const {data, isSuccess } = useCohortCases(pageSize, activePage);
  const [pages, setPages] = useState(10);

  const caseCounts = useCoreSelector((state) =>
    selectCohortCountsByName(state, "caseCounts")
  );

  useEffect(() => {
    setPages(Math.ceil(caseCounts/pageSize));
  },[caseCounts, pageSize]);

  if (!isSuccess)
    return (<div>Loading...</div>)

  const handlePageSizeChange = (x:string) => {
    setPageSize(parseInt(x));
  }

  // this mapping logic should get moved to a selector.  and the
  // case model probably needs to be generalized or generated.
  const cases: ReadonlyArray<Case> = data?.map((datum) => ({
    id: datum.case_id,
    submitterId: datum.submitter_id,
    primarySite: datum.primary_site,
    projectId: datum.project?.project_id,
    gender: datum.demographic?.gender,
    primaryDiagnosis: datum.diagnoses?.[0]?.primary_diagnosis,
    tissueOrOrganOfOrigin: datum.diagnoses?.[0]?.tissue_or_organ_of_origin,
  }));

  return (
    <div className="flex flex-col">
       <CasesView cases={cases} caption={`Showing ${pageSize} of ${caseCounts} Cases`} handleCaseSelected={props.handleCaseSelected} />
      <div className="flex flex-row items-center justify-start border-t border-nci-gray-light">
        <p className="px-2">Page Size:</p>
        <Select size="sm" radius="md"
        onChange={handlePageSizeChange}
        value={pageSize.toString()}
        data={[
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '40', label: '40' },
        { value: '100', label: '100' },

      ]}
        />
        <Pagination
          classNames={{
            active: "bg-nci-gray"
          }}
          size="sm"
          radius="md"
          color="gray"
          className="ml-auto"
          page={activePage}
          onChange={(x) => setPage(x-1)}
          total={pages} />
      </div>
    </div>
  );
};

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases, handleCaseSelected = () => void 0 } = props;

  return (
    <Table verticalSpacing="xs" striped highlightOnHover >
      <thead>
        <tr className="bg-nci-gray-lighter ">
          <th className="px-2 text-nci-gray-darkest">Case</th>
          <th className="px-2 text-nci-gray-darkest">Project</th>
          <th className="px-2 text-nci-gray-darkest">Primary Site</th>
          <th className="px-2 text-nci-gray-darkest">Gender</th>
          <th className="px-2 text-nci-gray-darkest">Primary Diagnosis</th>
          <th className="px-2 text-nci-gray-darkest whitespace-nowrap">Tissue/Organ of Origin</th>
        </tr>
      </thead>
      <tbody>
        {cases?.map((c, i) => (
          <tr key={c.id} className={i % 2 == 0 ? "bg-nci-gray-lightest" : ""}>
            <td className="px-2 break-all">
              <button onClick={() => handleCaseSelected(c)}>
                {c.submitterId}
              </button>
            </td>
            <td className="px-2 whitespace-nowrap">{c.projectId}</td>
            <td className="px-2">{c.primarySite}</td>
            <td className="px-2">{c.gender}</td>
            <td className="px-2">{c.primaryDiagnosis}</td>
            <td className="px-2">{c.tissueOrOrganOfOrigin}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
