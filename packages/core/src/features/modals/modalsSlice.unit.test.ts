import {
  hideModal,
  modalReducer,
  Modals,
  showModal,
  selectCurrentModal,
} from "./modalsSlice";
import { getInitialCoreState } from "../../store.unit.test";

describe("modals slice reducer", () => {
  test("showModal", () => {
    const state = modalReducer(
      { currentModal: null },
      showModal({ modal: Modals.UserProfileModal }),
    );
    expect(state).toEqual({ currentModal: Modals.UserProfileModal });
  });

  test("hideModal", () => {
    const state = modalReducer(
      { currentModal: Modals.UserProfileModal },
      hideModal(),
    );
    expect(state).toEqual({ currentModal: null });
  });
});

describe("selectCurrentModal", () => {
  const state = getInitialCoreState();
  test("show return correct current modal", () => {
    const currentModal = selectCurrentModal({
      ...state,
      modals: { currentModal: null },
    });
    expect(currentModal).toBe(null);
  });
});
