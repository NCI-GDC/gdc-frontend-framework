import React from "react";
import { Store } from "@reduxjs/toolkit";
import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue,
  TypedUseSelectorHook,
} from "react-redux";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";

// From here down is react-related code. If we wanted to create a UI-agnotic core,
// we could need to move the following code and the provider into a new workspace,
// such as core-react.

/**
 * The initial context is never used in practice. A little casting voodoo to satisfy TS.
 *
 * Note: Should the action type be AnyAction (from redux) or PayloadAction (from redux-toolkit)?
 * If we are creating all of our actions through RTK, then PayloadAction might be the
 * correct opinionated type.
 */
export const CoreContext = React.createContext(
  undefined as unknown as ReactReduxContextValue<CoreState>,
);

/**
 * Custom react-redux hooks that use the core store
 * @category Hooks
 * @example
 * ```typescript
 * import {useCoreSelector,  selectCurrentFilters } from '@gff/core';
 *
 * const currentFilters = useSelector(selectCurrentCohortFilters);
 * ```
 */
export const useCoreSelector: TypedUseSelectorHook<CoreState> =
  createSelectorHook(CoreContext);

/**
 * Custom react-redux hooks for dispatching Core actions
 * @category Hooks
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useCoreDispatch: () => CoreDispatch =
  createDispatchHook(CoreContext);

/**
 * Custom hooks for accessing the Core store
 * @category Hooks
 */
export const useCoreStore: () => Store = createStoreHook(CoreContext);

// This is untested. Need to verify that it work in single- and multi-store/provider contexts.
// export const coreConnect = <
//   TStateProps = {},
//   TOwnProps = {},
//   TDispatchProps = {},
//   TMergedProps = {},
//   State = CoreState
// >(
//   mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
//   mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
//   mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
//   options?: Options<State, TStateProps, TOwnProps, TMergedProps>
// ) => {
//   return connect(mapStateToProps, mapDispatchToProps, mergeProps, {
//     ...options,
//     context: CoreContext,
//   });
// };
