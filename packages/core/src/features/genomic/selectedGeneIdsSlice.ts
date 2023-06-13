import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { CoreState } from "src/reducers";

export interface GeneId {
  readonly geneId: string;
}

const selectedGeneIdsAdapter = createEntityAdapter<GeneId>({
  selectId: (p) => p.geneId,
  sortComparer: (a, b) => a.geneId.localeCompare(b.geneId),
});

const selectedGeneIdsSlice = createSlice({
  name: "genes/selectedGeneIds",
  initialState: selectedGeneIdsAdapter.getInitialState(),
  reducers: {
    resetSelectedGeneIds: () => selectedGeneIdsAdapter.getInitialState(),
    addGeneId: selectedGeneIdsAdapter.addOne,
    addGeneIds: selectedGeneIdsAdapter.addMany,
    removeGeneId: selectedGeneIdsAdapter.removeOne,
    removeGeneIds: selectedGeneIdsAdapter.removeMany,
  },
});

export const selectedGeneIdsReducer = selectedGeneIdsSlice.reducer;
export const {
  addGeneId,
  addGeneIds,
  removeGeneId,
  removeGeneIds,
  resetSelectedGeneIds,
} = selectedGeneIdsSlice.actions;

const selectedGeneIdsSelectors = selectedGeneIdsAdapter.getSelectors<CoreState>(
  (state) => state.selectedGeneIds,
);

export const selectSelectedGeneIds = (
  state: CoreState,
): ReadonlyArray<string> =>
  selectedGeneIdsSelectors.selectIds(state).map((x) => x as string);
