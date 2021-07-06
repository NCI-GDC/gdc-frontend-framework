import React from "react";
import { AnyAction, configureStore } from "@reduxjs/toolkit";
import {
  createSelectorHook,
  createDispatchHook,
  ReactReduxContextValue,
  createStoreHook,
  TypedUseSelectorHook,
} from "react-redux";
import { cohortReducer } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";

export const coreStore = configureStore({
  reducer: {
    cohort: cohortReducer,
    session: sessionReducer,
    facets: facetsReducer,
    gdcApps: gdcAppReducer,
  },
  devTools: {
    name: "@gff/core",
  },
});

export type CoreDispatch = typeof coreStore.dispatch;
export type CoreState = ReturnType<typeof coreStore.getState>;

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
  undefined as unknown as ReactReduxContextValue<CoreState, AnyAction>
);
export const useCoreSelector: TypedUseSelectorHook<CoreState> = createSelectorHook(CoreContext);
export const useCoreDispatch = createDispatchHook(CoreContext);
export const useCoreStore = createStoreHook(CoreContext);

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
