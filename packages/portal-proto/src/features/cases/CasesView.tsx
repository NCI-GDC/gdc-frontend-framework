import {
  fetchCases, fetchFacetByName, FilterSet, selectCasesFacetByField,
  selectCurrentCohortCaseGqlFilters, selectCurrentCohortFilters,
  useCases, useCoreDispatch, selectCasesData,
  useCoreSelector,
} from "@gff/core";
import { Table } from "@mantine/core";
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
}

export interface ContextualCasesViewProps {
  readonly handleCaseSelected?: (patient: Case) => void;
}

const useCohortFacetFilter = (): GqlOperation => {
  return useCoreSelector((state) =>
    selectCurrentCohortCaseGqlFilters(state),
  );
};

const useCohortCases = (pageSize = 10) => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCohortFacetFilter();
  const cases =  useCoreSelector((state) =>
    selectCasesData(state),
  );

  // cohortFilters is generated each time, use string representation
  // to control when useEffects are called
  const filters = JSON.stringify(cohortFilters)

  useEffect(() => {
    if (cases.status === "uninitialized") {
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
          filters: cohortFilters,
          size: pageSize,
        }
      ));
    }
  }, [coreDispatch]);

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
          filters: cohortFilters,
          size: pageSize,
        }
      ));

  }, [filters]);

  return {
    data: cases.data,
    error: cases?.error,
    isUninitialized: cases === undefined,
    isFetching: cases?.status === "pending",
    isSuccess: cases?.status === "fulfilled",
    isError: cases?.status === "rejected",
  };
};

const LoadingTable = (pageSize) => {

}

export const ContextualCasesView: React.FC<ContextualCasesViewProps> = (
  props: ContextualCasesViewProps,
) => {
  // TODO useContextualCases() that filters based on the context
  const [pageSize, setPageSize] = useState(10);
  const { data, isSuccess } = useCohortCases(pageSize);

  if (!isSuccess)
    return (<div>Loading...</div>)

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
    <CasesView cases={cases} handleCaseSelected={props.handleCaseSelected} />
  );
};

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases, handleCaseSelected = () => void 0 } = props;

  return (
    <Table verticalSpacing="xs" striped highlightOnHover>
      <thead>
        <tr className="bg-nci-gray-light text-white">
          <th className="px-2">Case</th>
          <th className="px-2">Project</th>
          <th className="px-2">Primary Site</th>
          <th className="px-2">Gender</th>
          <th className="px-2">Primary Diagnosis</th>
          <th className="px-2 whitespace-nowrap">Tissue/Organ of Origin</th>
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
