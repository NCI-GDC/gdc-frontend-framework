import { useEffect, useState } from "react";
import { addListener } from "@reduxjs/toolkit";
import { useCoreDispatch, userAuthChanged } from "@gff/core";

// Some effects only refetch when their deps change, so they miss a login or logout.
// This goes up by one on every login, logout or account switch and we add it to their deps.
export const useUserAuthChangeCount = (): number => {
  const coreDispatch = useCoreDispatch();
  const [count, setCount] = useState(0);

  useEffect(
    () =>
      coreDispatch(
        addListener({
          actionCreator: userAuthChanged,
          effect: () => setCount((current) => current + 1),
        }),
      ),
    [coreDispatch],
  );

  return count;
};
