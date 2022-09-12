import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

export type ModalTypes =
  | "UserProfileModal"
  | "SessionExpireModal"
  | "NoAccessModal"
  | "BAMSlicingModal"
  | "BAMSlicingErrorModal"
  | "NoAccessToProjectModal";

export enum Modals {
  "UserProfileModal" = "UserProfileModal",
  "SessionExpireModal" = "SessionExpireModal",
  "NoAccessModal" = "NoAccessModal",
  "BAMSlicingModal" = "BAMSlicingModal",
  "BAMSlicingErrorModal" = "BAMSlicingErrorModal",
  "NoAccessToProjectModal" = "NoAccessToProjectModal",
}

export interface ModalState {
  currentModal: ModalTypes | null;
}

const initialState: ModalState = {
  currentModal: null,
};

const slice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    showModal: (state: ModalState, action: PayloadAction<ModalTypes>) => {
      state.currentModal = Modals[action.payload];
      return state;
    },
    hideModal: (state: ModalState) => {
      state.currentModal = null;
      return state;
    },
  },
});

export const modalReducer = slice.reducer;
export const { showModal, hideModal } = slice.actions;

export const selectCurrentModal = (state: CoreState): ModalTypes | null =>
  state.modals.currentModal;
