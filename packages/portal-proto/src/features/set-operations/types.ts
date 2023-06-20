export type SetOperationEntityType = "cohort" | "genes" | "mutations";
export type SelectedEntity = {
  name: string;
  id: string;
};
export type SelectedEntities = SelectedEntity[];

export interface SetOperationsInputProps {
  selectedEntities: SelectedEntities;
  selectedEntityType: SetOperationEntityType;
}

export interface SetOperationsForGenesSSMSCasesProps
  extends SetOperationsInputProps {
  setSelectedEntities: (SelectedEntities) => void;
  setSelectedEntityType: (SetOperationEntityType) => void;
}
