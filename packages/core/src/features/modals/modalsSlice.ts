import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

export enum Modals {
  "FirstTimeModal" = "FirstTimeModal",
  "UserProfileModal" = "UserProfileModal",
  "SessionExpireModal" = "SessionExpireModal",
  "NoAccessModal" = "NoAccessModal",
  "BAMSlicingModal" = "BAMSlicingModal",
  "NoAccessToProjectModal" = "NoAccessToProjectModal",
  "CartSizeLimitModal" = "CartSizeLimitModal",
  "CartDownloadModal" = "CartDownloadModal",
  "AgreementModal" = "AgreementModal",
  "GeneralErrorModal" = " GeneralErrorModal",
  "GlobalCaseSetModal" = "GlobalCaseSetModal",
  "GlobalGeneSetModal" = "GlobalGeneSetModal",
  "GlobalMutationSetModal" = "GlobalMutationSetModal",
  "LocalCaseSetModal" = "LocalCaseSetModal",
  "LocalGeneSetModal" = "LocalGeneSetModal",
  "LocalMutationSetModal" = "LocalMutationSetModal",
  "ImportCohortModal" = "ImportCohortModal",
  "SaveCohortErrorModal" = "SaveCohortErrorModal",
  "SaveSetErrorModal" = "SaveSetErrorModal",
}

export interface ModalState {
  currentModal: Modals | null;
  message?: string;
}

const initialState: ModalState = {
  currentModal: null,
};

const slice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    showModal: (
      state: ModalState,
      action: PayloadAction<{ modal: Modals; message?: string }>,
    ) => {
      state.currentModal = action.payload.modal;
      state.message = action.payload.message;
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

export const selectCurrentModal = (state: CoreState): Modals | null =>
  state.modals.currentModal;

export const selectCurrentMessage = (state: CoreState): string | undefined =>
  state.modals.message;
