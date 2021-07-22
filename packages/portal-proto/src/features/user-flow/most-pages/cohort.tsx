import React, { PropsWithChildren } from "react";
import { Button, Card } from "../../layout/UserFlowVariedPages";

export interface CohortManagerProps {
  ActionElement?: React.FC<unknown>;
  ExpandElement?: React.FC<unknown>;
}

export const CohortManager: React.FC<CohortManagerProps> = ({
  ActionElement = () => null,
  ExpandElement = () => null,
}: PropsWithChildren<CohortManagerProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4 items-center">
        <select name="currentCohort" id="current-cohort-select">
          <option value="ALL_GDC">All GDC Cases</option>
          <option value="TCGA-BRCA">TCGA BRCA</option>
        </select>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="flex-grow"></div>
        <div>
          <Button>2,345 Cases</Button>
        </div>
        <ActionElement />
      </div>
      <ExpandElement />
    </div>
  );
};
