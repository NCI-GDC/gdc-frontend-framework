import { CaseDefaults, useCases } from "@gff/core";

export interface CasesViewProps {
  readonly cases: ReadonlyArray<CaseDefaults>;
}

export const ContextualCasesView: React.FC<unknown> = () => {
  // TODO useContextualCases() that filters based on the context
  const { data } = useCases();

  return <CasesView cases={data} />;
};

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases } = props;

  return (
    <div className="flex flex-col">
      {cases && cases.map((c) => <div key={c.case_id}>{c.submitter_id}</div>)}
    </div>
  );
};
