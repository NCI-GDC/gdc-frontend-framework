export type SetOperationEntityType = "cohort" | "genes" | "mutations";
export type SelectedEntity = {
  name: string;
  id: string;
};
export type SelectedEntities = SelectedEntity[];

export interface SetOperationsForGenesSSMSCasesProps {
  selectedEntities: SelectedEntities;
  setSelectedEntities: (SelectedEntities) => void;
  selectedEntityType: SetOperationEntityType;
  setSelectedEntityType: (SetOperationEntityType) => void;
}
