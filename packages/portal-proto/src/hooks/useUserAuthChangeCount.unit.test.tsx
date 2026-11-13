import { act, renderHook } from "@testing-library/react";
import { CoreProvider, coreStore, userAuthChanged } from "@gff/core";
import { useUserAuthChangeCount } from "./useUserAuthChangeCount";

describe("useUserAuthChangeCount", () => {
  test("counts user changes dispatched on the core store", () => {
    const { result } = renderHook(() => useUserAuthChangeCount(), {
      wrapper: CoreProvider,
    });
    expect(result.current).toBe(0);

    act(() => {
      coreStore.dispatch(userAuthChanged({ username: "alice" }));
    });
    expect(result.current).toBe(1);

    act(() => {
      coreStore.dispatch(userAuthChanged({ username: null }));
    });
    expect(result.current).toBe(2);
  });
});
