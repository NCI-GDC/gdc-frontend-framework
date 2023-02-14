import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

export interface SessionState {
  readonly sessionId: string;
}

const initialState: SessionState = {
  sessionId: "",
};

const slice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
  },
});

export const sessionReducer = slice.reducer;

export const { setSessionId } = slice.actions;

export const selectSessionId = (state: CoreState): string =>
  state.session.sessionId;
