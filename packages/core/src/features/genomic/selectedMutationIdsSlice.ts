import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { CoreState } from "src/reducers";

export interface MutationId {
  readonly mutationId: string;
}

const selectedMutationIdsAdapter = createEntityAdapter<MutationId>({
  selectId: (p) => p.mutationId,
  sortComparer: (a, b) => a.mutationId.localeCompare(b.mutationId),
});

const selectedMutationIdsSlice = createSlice({
  name: "mutations/selectedMutationIds",
  initialState: selectedMutationIdsAdapter.getInitialState(),
  reducers: {
    resetSelectedMutationIds: () =>
      selectedMutationIdsAdapter.getInitialState(),
    addMutationId: selectedMutationIdsAdapter.addOne,
    addMutationIds: selectedMutationIdsAdapter.addMany,
    removeMutationId: selectedMutationIdsAdapter.removeOne,
    removeMutationIds: selectedMutationIdsAdapter.removeMany,
  },
});

export const selectedMutationIdsReducer = selectedMutationIdsSlice.reducer;
export const {
  addMutationId,
  addMutationIds,
  removeMutationId,
  removeMutationIds,
  resetSelectedMutationIds,
} = selectedMutationIdsSlice.actions;

const selectedMutationIdsSelectors =
  selectedMutationIdsAdapter.getSelectors<CoreState>(
    (state) => state.selectedMutationIds,
  );

export const selectSelectedMutationIds = (
  state: CoreState,
): ReadonlyArray<string> =>
  selectedMutationIdsSelectors.selectIds(state)?.map((x) => x as string);
