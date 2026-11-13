import { createSlice } from "@reduxjs/toolkit";
import { coreStore } from "../../store";
import { userAuthChanged } from "../users/usersSlice";
import { createAppStore } from "./createAppStore";

jest.mock("uuid", () => ({ v5: () => "test-app-id" }));

describe("createAppStore", () => {
  test("app stores receive user changes from the core store", () => {
    const lastUserChange = createSlice({
      name: "lastUserChange",
      initialState: { username: undefined as string | null | undefined },
      reducers: {},
      extraReducers: (builder) =>
        builder.addCase(userAuthChanged, (_, action) => action.payload),
    });
    const { AppStore } = createAppStore({
      name: "UserChangeTestApp",
      version: "1.0.0",
      reducers: lastUserChange.reducer,
    });

    coreStore.dispatch(userAuthChanged({ username: "alice" }));

    expect(AppStore.getState()).toEqual({ username: "alice" });
  });
});
