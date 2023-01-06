import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "src/reducers";
import { addSet } from "./setsSlice";

describe("setsSlice", () => {
  it("add new sets", () => {
    const coreStore = configureStore({ reducer: reducers });
    coreStore.dispatch(
      addSet({ setType: "genes", setName: "my gene set", setId: "xZaB" }),
    );
    expect(coreStore.getState().sets).toEqual({
      gene: { xZaB: "my gene set" },
      case: {},
      ssm: {},
    });
    coreStore.dispatch(
      addSet({ setType: "genes", setName: "my next gene set", setId: "aaZM" }),
    );
    expect(coreStore.getState().sets).toEqual({
      gene: { xZaB: "my gene set", aaZM: "my next gene set" },
      case: {},
      ssm: {},
    });
  });

  it("replace set with same name", () => {
    const coreStore = configureStore({ reducer: reducers });
    coreStore.dispatch(
      addSet({ setType: "case", setName: "my case set", setId: "xZaB" }),
    );
    expect(coreStore.getState().sets).toEqual({
      case: { xZaB: "my case set" },
      gene: {},
      ssm: {},
    });
    coreStore.dispatch(
      addSet({ setType: "case", setName: "my case set", setId: "pLaR" }),
    );
    expect(coreStore.getState().sets).toEqual({
      case: { pLaR: "my case set" },
      gene: {},
      ssm: {},
    });
  });
});
