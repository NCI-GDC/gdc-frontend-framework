import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";

export type SetOperationEntityType = "cohort" | "genes" | "mutations";
export type SelectedEntity = {
  name: string;
  id: string;
};
export type SelectedEntities = SelectedEntity[];

export interface SetOperationsChartInputProps {
  selectedEntities: SelectedEntities | undefined;
  selectedEntityType?: SetOperationEntityType;
  isLoading?: boolean;
  isCohortComparisonDemo?: boolean;
}

export interface SetOperationsProps {
  readonly sets: SelectedEntities;
  readonly entityType: "cohort" | "genes" | "mutations";
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
    readonly caseId: string;
  }[];
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, number, string>>;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
  readonly isAllSuccess: boolean;
}

export interface SetOperationsExternalProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly queryHook: UseQuery<QueryDefinition<any, any, any, any, string>>;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
}
