import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

export interface CasesCart {
  readonly caseId: string;
}

const selectedCasesAdapter = createEntityAdapter<CasesCart>({
  selectId: (p) => p.caseId,
  sortComparer: (a, b) => a.caseId.localeCompare(b.caseId),
});

const selectedCasesSlice = createSlice({
  name: "cases/selectedCases",
  initialState: selectedCasesAdapter.getInitialState(),
  reducers: {
    resetSelectedCases: () => selectedCasesAdapter.getInitialState(),
    addCase: selectedCasesAdapter.addOne,
    addCases: selectedCasesAdapter.addMany,
    removeCase: selectedCasesAdapter.removeOne,
    removeCases: selectedCasesAdapter.removeMany,
  },
});

export const selectedCasesReducer = selectedCasesSlice.reducer;
export const {
  addCase,
  addCases,
  removeCase,
  removeCases,
  resetSelectedCases,
} = selectedCasesSlice.actions;

const selectedCasesSelectors = selectedCasesAdapter.getSelectors<CoreState>(
  (state) => state.selectedCases,
);

export const selectSelectedCases = (state: CoreState): ReadonlyArray<string> =>
  selectedCasesSelectors.selectIds(state).map((x) => x as string);
