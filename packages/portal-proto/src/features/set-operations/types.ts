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
