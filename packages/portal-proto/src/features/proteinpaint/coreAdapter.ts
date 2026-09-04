/**
 * The single seam between the ProteinPaint wrappers in this directory and
 * `@gff/core`.
 *
 * Every wrapper here imports the core hooks, selectors, action creators,
 * constants and types it needs from THIS module, never from `@gff/core`
 * directly. In tests the module is replaced by its manual mock
 * (`__mocks__/coreAdapter.ts`) via `jest.mock("./coreAdapter")`, which means:
 *
 *   1. the real `@gff/core` barrel — and its eager Redux `configureStore` — is
 *      never loaded, and
 *   2. the entire test-time coupling to `@gff/core` lives in these two
 *      proteinpaint-owned files.
 *
 * When the GFF team makes a breaking change to `@gff/core`, only this file and
 * its manual mock need updating — not the individual wrapper unit tests.
 *
 * NOTE: this only shields the wrappers' DIRECT core imports. Out-of-dir
 * components/hooks a wrapper renders (e.g. cohortActionHooks, GeneSetModal,
 * @gff/portal-components) reach `@gff/core` on their own and must be
 * boundary-mocked in the tests that render them.
 */

// Runtime values: hooks, selectors, action creators, enums, constants.
export {
  graphqlAPISlice,
  useCoreSelector,
  useCoreDispatch,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  useFetchUserDetailsQuery,
  useCreateCaseSetFromValuesMutation,
  useGetGenesQuery,
  showModal,
  hideModal,
  selectCurrentModal,
  Modals,
  PROTEINPAINT_API,
  GDC_API,
} from "@gff/core";

// Types only — kept in a separate `export type` because `isolatedModules` is
// enabled and forbids re-exporting a type through a value export.
export type { FilterSet, Operation, Includes } from "@gff/core";
