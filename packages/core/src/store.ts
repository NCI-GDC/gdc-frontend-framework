import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import {
  createSelectorHook,
  createDispatchHook,
  connect,
  ReactReduxContextValue,
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  MergeProps,
  Options,
} from "react-redux";
import { cohortReducer } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";

export const coreStore = configureStore({
  reducer: {
    cohort: cohortReducer,
    session: sessionReducer,
  },
});

export type CoreState = ReturnType<typeof coreStore.getState>;

// The initial context is never used in practice. A little casting voodoo satisfy TS.
export const CoreContext = React.createContext(
  undefined as unknown as ReactReduxContextValue
);
export const useCoreSelector = createSelectorHook(CoreContext);
export const useCoreDispatch = createDispatchHook(CoreContext);

// This is untested. Need to verify that it work in
// single- and multi-store/provider contexts.
export const coreConnect = <
  TStateProps = {},
  TOwnProps = {},
  TDispatchProps = {},
  TMergedProps = {},
  State = CoreState
>(
  mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
  mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
  mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
  options?: Options<State, TStateProps, TOwnProps, TMergedProps>
) => {
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, {
    ...options,
    context: CoreContext,
  });
};
