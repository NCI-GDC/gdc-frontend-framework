/**
 * Manual mock for `../coreAdapter`, applied wherever a test calls
 * `jest.mock("./coreAdapter")`. Because it stands in for the core seam, the
 * real `@gff/core` barrel never loads during these tests.
 *
 * The defaults let every wrapper render without crashing. A test overrides just
 * the pieces it asserts on, e.g.:
 *
 *   import * as coreAdapter from "./coreAdapter";
 *   jest.mock("./coreAdapter");
 *   const mockedCore = jest.mocked(coreAdapter);
 *   mockedCore.buildCohortGqlOperator.mockReturnValue(myFilter);
 *
 * This is the ONE place the proteinpaint team maintains when `@gff/core`'s hook
 * signatures change.
 */

export const PROTEINPAINT_API = "host:port/basepath";
export const GDC_API = "host:port/gdcapi";

// useCoreSelector(selector) — the selector arg is ignored here, so the
// selectors below only need to exist as identities.
export const useCoreSelector = jest.fn().mockReturnValue({});
export const selectCurrentCohortFilters = jest.fn();
export const selectCurrentModal = jest.fn().mockReturnValue(null);

export const buildCohortGqlOperator = jest.fn().mockReturnValue({});
export const useFetchUserDetailsQuery = jest.fn().mockReturnValue({});

export const useCoreDispatch = jest.fn().mockReturnValue(jest.fn());

// RTK Query mutation hooks return a [trigger, result] tuple.
export const useCreateCaseSetFromValuesMutation = jest
  .fn()
  .mockReturnValue([jest.fn(), { isSuccess: true }]);

export const useGetGenesQuery = jest.fn().mockReturnValue({});

export const showModal = jest.fn();
export const hideModal = jest.fn();

// `Modals` is an enum in @gff/core; a stub object is enough for the wrappers.
// Extend with specific keys if a test needs to assert on them.
export const Modals: Record<string, string> = {};
