export const treeStatusInitialState = {
  collapsedNodes: 0,
  expandedNodes: 0,
  totalNodes: 0,
};

export function treeStatusStateReducer(state, action) {
  console.log("ACTION: ", action);
  switch (action.type) {
    case "COLLAPSE_NODE":
      return {
        ...state,
        collapsedNodes: state.collapsedNodes + 1,
        expandedNodes: Math.max(state.expandedNodes - 1, 0),
      };
    case "EXPAND_NODE":
      return {
        ...state,
        collapsedNodes: Math.max(state.collapsedNodes - 1, 0),
        expandedNodes: state.expandedNodes + 1,
      };
    case "TOTAL_NODES": {
      const quantity = action.payload.mounted ? 1 : -1;
      console.log("QUANTITY: ", quantity);
      console.log("action.payload.expanded: ", action.payload.expanded);
      return {
        ...state,
        ...(action.payload.expanded
          ? {
              expandedNodes: state.expandedNodes + quantity,
            }
          : {
              collapsedNodes: state.collapsedNodes + quantity,
            }),
        totalNodes: state.totalNodes + quantity,
      };
    }
    case "OVERRIDE_NODES": {
      console.log(
        "action.payload.expanded in override: ",
        action.payload.expanded,
      );
      return {
        ...state,
        collapsedNodes: action.payload.expanded ? 0 : state.totalNodes,
        expandedNodes: action.payload.expanded ? state.totalNodes : 0,
      };
    }
    default:
      return state;
  }
}
