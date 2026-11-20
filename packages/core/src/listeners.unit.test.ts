import { REHYDRATE } from "redux-persist";
import { coreStore } from "./store";
import { COHORT_PERSIST_KEY } from "./reducers";
import {
  addNewDefaultUnsavedCohort,
  addNewSavedCohort,
} from "./features/cohort/availableCohortsSlice";
import { NullCountsData } from "./features/cohort/type";
import { userAuthChanged } from "./features/users/usersSlice";

const countsResponse = {
  data: {
    viewer: {
      explore: {
        cases: { hits: { total: 1 } },
        genes: { hits: { total: 1 } },
        ssms: { hits: { total: 1 } },
      },
      repository: { files: { hits: { total: 1 } } },
    },
  },
};

describe("cohort counts", () => {
  const fetchSpy: jest.SpyInstance = jest
    .spyOn(global, "fetch")
    .mockImplementation(
      jest.fn(() =>
        Promise.resolve({ ok: true, json: () => countsResponse }),
      ) as jest.Mock,
    );

  const countsRequests = () =>
    fetchSpy.mock.calls.filter(([, init]) =>
      String(init?.body).includes("countsQuery"),
    ).length;

  beforeAll(() => {
    coreStore.dispatch(addNewDefaultUnsavedCohort());
    coreStore.dispatch(
      addNewSavedCohort({
        id: "saved-cohort",
        name: "Saved cohort",
        filters: { mode: "and", root: {} },
        caseSet: { status: "uninitialized" },
        modified_datetime: new Date().toISOString(),
        counts: { ...NullCountsData },
      }),
    );
  });

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  test("are refetched for unsaved cohorts after the cohort state is restored from storage", () => {
    coreStore.dispatch({ type: REHYDRATE, key: COHORT_PERSIST_KEY });

    expect(countsRequests()).toBe(1);
  });

  test("are refetched for every cohort when the user changes", () => {
    coreStore.dispatch(userAuthChanged({ username: "alice" }));

    expect(countsRequests()).toBe(2);
  });

  test("are not refetched when another slice is restored", () => {
    coreStore.dispatch({ type: REHYDRATE, key: "root" });

    expect(countsRequests()).toBe(0);
  });
});
