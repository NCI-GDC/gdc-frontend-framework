import {
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
} from "@gff/core";

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
  }[];
  readonly queryHook: typeof useSetOperationsCasesTotalQuery;
  readonly countHook: typeof useCaseSetCountsQuery;
}

export interface SetOperationsExternalProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly queryHook: typeof useSetOperationsCasesTotalQuery;
  readonly countHook: typeof useCaseSetCountsQuery;
}
