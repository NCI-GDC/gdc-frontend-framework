import React from "react";

interface CollapsedStateReducerAction {
  type: "expand" | "collapse" | "clear" | "init" | "expandAll" | "collapseAll";
  cohortId: string;
  field?: string;
}

export type { CollapsedStateReducerAction };

export const QueryExpressionsExpandedContext = React.createContext<
  [
    Record<string, boolean>,
    ((action: CollapsedStateReducerAction) => void) | undefined,
  ]
>([{}, undefined]);
