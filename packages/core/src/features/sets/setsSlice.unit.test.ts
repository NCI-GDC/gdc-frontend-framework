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
      genes: { xZaB: "my gene set" },
      cases: {},
      ssms: {},
    });
    coreStore.dispatch(
      addSet({ setType: "genes", setName: "my next gene set", setId: "aaZM" }),
    );
    expect(coreStore.getState().sets).toEqual({
      genes: { xZaB: "my gene set", aaZM: "my next gene set" },
      cases: {},
      ssms: {},
    });
  });

  it("replace set with same name", () => {
    const coreStore = configureStore({ reducer: reducers });
    coreStore.dispatch(
      addSet({ setType: "cases", setName: "my case set", setId: "xZaB" }),
    );
    expect(coreStore.getState().sets).toEqual({
      cases: { xZaB: "my case set" },
      gene: {},
      ssms: {},
    });
    coreStore.dispatch(
      addSet({ setType: "cases", setName: "my case set", setId: "pLaR" }),
    );
    expect(coreStore.getState().sets).toEqual({
      cases: { pLaR: "my case set" },
      genes: {},
      ssms: {},
    });
  });
});
