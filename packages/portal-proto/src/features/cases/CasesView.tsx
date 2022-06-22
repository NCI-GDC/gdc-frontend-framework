import { selectCohortCountsByName, useCoreSelector } from "@gff/core";
import { Table, Pagination, Select } from "@mantine/core";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { useEffect, useState } from "react";
import { useScrollIntoView } from "@mantine/hooks";
import { Case } from "./types";
import { useCohortCases } from "@/features/cases/hooks";

export interface CasesViewProps {
  readonly cases?: ReadonlyArray<Case>;
  readonly handleCaseSelected?: (patient: Case) => void;
  readonly caption?: string;
}

export interface ContextualCasesViewProps {
  readonly handleCaseSelected?: (patient: Case) => void;
  caseId?: string;
  bioId?: string;
}

export const ContextualCasesView: React.FC<ContextualCasesViewProps> = (
  props: ContextualCasesViewProps,
) => {
  // TODO useContextualCases() that filters based on the context
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const { data, isSuccess } = useCohortCases(pageSize, activePage);
  const [pages, setPages] = useState(10);
  const caseCounts = useCoreSelector((state) =>
    selectCohortCountsByName(state, "caseCounts"),
  );

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (localStorage.getItem("prevPath")?.includes("MultipleImageViewerPage")) {
      scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPages(Math.ceil(caseCounts / pageSize));
  }, [caseCounts, pageSize]);

  if (!isSuccess) return <div>Loading...</div>;

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };

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
    <div className="flex flex-col m-auto w-10/12">
      {/* TODO: need to take remove this class later */}
      <div className="hidden">
        <CasesView
          cases={cases}
          caption={`Showing ${pageSize} of ${caseCounts} Cases`}
          handleCaseSelected={props.handleCaseSelected}
        />
        <div className="flex flex-row items-center justify-start border-t border-nci-gray-light">
          <p className="px-2">Page Size:</p>
          <Select
            size="sm"
            radius="md"
            onChange={handlePageSizeChange}
            value={pageSize.toString()}
            data={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "40", label: "40" },
              { value: "100", label: "100" },
            ]}
          />
          <Pagination
            classNames={{
              active: "bg-nci-gray",
            }}
            size="sm"
            radius="md"
            color="gray"
            className="ml-auto"
            page={activePage}
            onChange={(x) => setPage(x - 1)}
            total={pages}
          />
        </div>
      </div>
      <div ref={targetRef} id="biospecimen">
        <Biospecimen caseId={props.caseId} bioId={props.bioId} />
      </div>
    </div>
  );
};

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases, handleCaseSelected = () => void 0 } = props;

  return (
    <Table verticalSpacing="xs" striped highlightOnHover>
      <thead>
        <tr className="bg-nci-gray-lighter ">
          <th className="px-2 text-nci-gray-darkest">Case</th>
          <th className="px-2 text-nci-gray-darkest">Project</th>
          <th className="px-2 text-nci-gray-darkest">Primary Site</th>
          <th className="px-2 text-nci-gray-darkest">Gender</th>
          <th className="px-2 text-nci-gray-darkest">Primary Diagnosis</th>
          <th className="px-2 text-nci-gray-darkest whitespace-nowrap">
            Tissue/Organ of Origin
          </th>
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
