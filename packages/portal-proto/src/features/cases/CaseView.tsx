import { CaseDefaults } from "@gff/core";
import { PropsWithChildren } from "react";

export interface CaseViewProps {
  readonly c: CaseDefaults;
}

export const CaseView: React.FC<CaseViewProps> = ({
  c,
}: PropsWithChildren<CaseViewProps>) => {
  return (
    <div className="flex flex-col">
      <div>Case Id: {c.case_id}</div>
      <div>Submitter Id: {c.submitter_id}</div>
      <div>Primary Site: {c.primary_site}</div>
    </div>
  );
};
