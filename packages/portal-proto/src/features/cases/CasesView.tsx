import { useCases } from "@gff/core";

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
}

export const ContextualCasesView: React.FC<unknown> = () => {
  // TODO useContextualCases() that filters based on the context
  const { data } = useCases({
    fields: [
      "case_id",
      "submitter_id",
      "primary_site",
      "project.project_id",
      "demographic.gender",
      "diagnoses.primary_diagnosis",
      "diagnoses.tissue_or_organ_of_origin",
    ],
    size: 100,
  });

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

  return <CasesView cases={cases} />;
};

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases } = props;

  return (
    <table
      className="table-auto border-collapse w-full"
      style={{ borderSpacing: "4em" }}
    >
      <thead>
        <tr className="bg-nci-blue text-white">
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
            <td className="px-2 break-all">{c.submitterId}</td>
            <td className="px-2 whitespace-nowrap">{c.projectId}</td>
            <td className="px-2">{c.primarySite}</td>
            <td className="px-2">{c.gender}</td>
            <td className="px-2">{c.primaryDiagnosis}</td>
            <td className="px-2">{c.tissueOrOrganOfOrigin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
