import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { AppState } from "./appApi";

interface GeneCart {
  readonly geneId: string;
}

const pickedGenesAdapter = createEntityAdapter<GeneCart>({
  selectId: (p) => p.geneId,
  sortComparer: (a, b) => a.geneId.localeCompare(b.geneId),
});

const pickedGenesSlice = createSlice({
  name: "projectApp/pickedGenes",
  initialState: pickedGenesAdapter.getInitialState(),
  reducers: {
    addGene: pickedGenesAdapter.addOne,
    addGenes: pickedGenesAdapter.addMany,
    removeGene: pickedGenesAdapter.removeOne,
    removeGenes: pickedGenesAdapter.removeMany,
  },
});

export const pickedGenesReducer = pickedGenesSlice.reducer;
export const { addGene, addGenes, removeGene, removeGenes } =
  pickedGenesSlice.actions;

const pickedGenesSelectors = pickedGenesAdapter.getSelectors<AppState>(
  (state) => state.selectedGenes,
);

export const selectPickedGenes = (state: AppState): ReadonlyArray<string> =>
  pickedGenesSelectors.selectIds(state).map((x) => x as string);
