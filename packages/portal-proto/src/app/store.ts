import {
  configureStore,
  ThunkAction,
  Action,
  ReducersMapObject,
  AnyAction,
} from "@reduxjs/toolkit";

const configureAppStore = (reducer?: ReducersMapObject<any, AnyAction>) =>
  configureStore({
    reducer: reducer ? reducer : (state) => state,
  });

export type AppState = ReturnType<typeof configureAppStore>["getState"];

export type AppDispatch = ReturnType<typeof configureAppStore>["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default configureAppStore;
