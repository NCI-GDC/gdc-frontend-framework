import { getInitialCoreState } from "../../store.spec";
import {
  clearCurrentCohort,
  cohortReducer,
  selectCurrentCohort,
  setCurrentCohort,
} from "./cohortSlice";

const state = getInitialCoreState();

describe("cohortSlice reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = cohortReducer(undefined, { type: "asdf" });
    expect(state).toEqual({});
  });

  test("setCurrentCohort action should set the current cohort", () => {
    const state = cohortReducer({}, setCurrentCohort("my-cohort-1"));
    expect(state.currentCohort).toEqual("my-cohort-1");
  });

  test("clearCurrentCohort action should unset the current cohort", () => {
    const state = cohortReducer(
      { currentCohort: "cohort-2" },
      clearCurrentCohort()
    );
    expect(state.currentCohort).toBeUndefined();
  });
});

describe("selectCurrentCohort", () => {
  test("should return the current cohort when it's defined", () => {
    const currentCohort = selectCurrentCohort({
      ...state,
      cohort: { currentCohort: "asdf" },
    });
    expect(currentCohort).toEqual("asdf");
  });

  test("should return undefined when the current cohort is not set", () => {
    const currentCohort = selectCurrentCohort({ ...state, cohort: {} });
    expect(currentCohort).toBeUndefined();
  });
});
