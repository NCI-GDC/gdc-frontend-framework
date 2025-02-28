import React, { useState, useReducer, useRef, useContext } from "react";
import { omit } from "lodash";
import { useDeepCompareEffect } from "use-deep-compare";
import OverflowTooltippedLabel from "@/common/OverflowTooltippedLabel";
import { convertFilterToComponent } from "./QueryRepresentation";
import { MantineProvider, Tooltip } from "@mantine/core";
import {
  BackArrowIcon,
  DownArrowIcon,
  ForwardArrowIcon,
  UpArrowIcon,
} from "src/commonIcons";
import { AppContext } from "src/context";
import {
  getCombinedClassesExpandCollapseQuery,
  getCombinedClassesForRowCollapse,
} from "../style";
import { QueryExpressionHooks } from "./types";

const MAX_HEIGHT_QE_SECTION = 120;

interface CollapsedStateReducerAction {
  type: "expand" | "collapse" | "clear" | "init" | "expandAll" | "collapseAll";
  cohortId: string;
  field?: string;
}

const reducer = (
  state: Record<string, Record<string, boolean>>,
  action: CollapsedStateReducerAction,
) => {
  switch (action.type) {
    case "init":
      return {
        ...state,
        [action.cohortId]: {},
      };
    case "expand":
      if (!action.field) {
        return state;
      }

      return {
        ...state,
        [action.cohortId]: { ...state[action.cohortId], [action.field]: true },
      };
    case "collapse":
      if (!action.field) {
        return state;
      }

      return {
        ...state,
        [action.cohortId]: { ...state[action.cohortId], [action.field]: false },
      };

    case "expandAll":
      return {
        ...state,
        [action.cohortId]: Object.fromEntries(
          Object.keys(state[action.cohortId]).map((q) => [q, true]),
        ),
      };
    case "collapseAll":
      return {
        ...state,
        [action.cohortId]: Object.fromEntries(
          Object.keys(state[action.cohortId]).map((q) => [q, false]),
        ),
      };
    case "clear":
      if (!action.field) {
        return { ...state, [action.cohortId]: {} };
      } else {
        return {
          ...state,
          [action.cohortId]: omit(state[action.cohortId], action.field),
        };
      }
  }
};

interface QueryExpressionSectionProps {
  readonly filters: any;
  readonly hooks: QueryExpressionHooks;
}

export const QueryExpressionsExpandedContext = React.createContext<
  [
    Record<string, boolean>,
    ((action: CollapsedStateReducerAction) => void) | undefined,
  ]
>([{}, undefined]);

const QueryExpressionSection: React.FC<QueryExpressionSectionProps> = ({
  filters,
  hooks,
}: QueryExpressionSectionProps) => {
  const { theme } = useContext(AppContext);

  const currentCohort = hooks.useSelectCurrentCohort();
  const clearCohortFilters = hooks.useClearCohortFilters();

  const [expandedState, setExpandedState] = useReducer(reducer, {});
  const [filtersSectionCollapsed, setFiltersSectionCollapsed] = useState(true);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [QESectionHeight, setQESectionHeight] = useState(0);

  useDeepCompareEffect(() => {
    if (filtersRef.current) {
      const height = filtersRef.current.scrollHeight;
      setQESectionHeight(
        height > MAX_HEIGHT_QE_SECTION ? MAX_HEIGHT_QE_SECTION : height,
      );
    }
  }, [expandedState, filters, filtersRef]);

  const clearAllFilters = () => {
    clearCohortFilters();
    setExpandedState({ type: "clear", cohortId: currentCohort.id });
  };
  const allQueryExpressionsCollapsed = Object.values(
    expandedState?.[currentCohort?.id] || {},
  ).every((q) => !q);

  const noFilters = Object.keys(filters?.root || {}).length === 0;

  useDeepCompareEffect(() => {
    if (
      currentCohort !== undefined &&
      expandedState?.[currentCohort.id] === undefined
    ) {
      setExpandedState({ type: "init", cohortId: currentCohort.id });
    }
  }, [currentCohort, expandedState]);

  return (
    <MantineProvider theme={theme}>
      <div className="flex items-center bg-white border-secondary-darkest border-1 border-l-4 m-4">
        {currentCohort !== undefined && (
          <QueryExpressionsExpandedContext.Provider
            value={[expandedState[currentCohort.id], setExpandedState]}
          >
            <div className="flex flex-col w-full bg-primary">
              <div
                data-testid="text-cohort-filters-top-row"
                className="flex flex-row py-2 items-center border-secondary-darkest border-b-1"
              >
                <OverflowTooltippedLabel
                  label={currentCohort.name}
                  className="font-bold text-secondary-contrast-darkest ml-3 max-w-[260px]"
                >
                  {currentCohort.name}
                </OverflowTooltippedLabel>
                <>
                  <button
                    data-testid="button-clear-all-cohort-filters"
                    className={`text-sm font-montserrat ml-2 px-1 hover:bg-primary-darkest hover:text-primary-content-lightest hover:rounded-md ${
                      noFilters
                        ? "hidden"
                        : "cursor-pointer text-secondary-contrast-darkest"
                    }`}
                    onClick={clearAllFilters}
                    disabled={noFilters}
                  >
                    Clear All
                  </button>
                  <div className="display flex gap-2 ml-auto mr-3">
                    <Tooltip
                      label={
                        noFilters
                          ? "No values to expand/collapse"
                          : allQueryExpressionsCollapsed
                          ? "Expand all values"
                          : "Collapse all values"
                      }
                    >
                      <button
                        data-testid="button-expand-collapse-cohort-queries"
                        color="white"
                        onClick={() =>
                          allQueryExpressionsCollapsed
                            ? setExpandedState({
                                type: "expandAll",
                                cohortId: currentCohort.id,
                              })
                            : setExpandedState({
                                type: "collapseAll",
                                cohortId: currentCohort.id,
                              })
                        }
                        aria-label="Expand/collapse all queries"
                        aria-expanded={!allQueryExpressionsCollapsed}
                        className={getCombinedClassesExpandCollapseQuery(
                          allQueryExpressionsCollapsed,
                        )}
                        disabled={noFilters}
                      >
                        {allQueryExpressionsCollapsed ? (
                          <>
                            <BackArrowIcon size={16} aria-hidden="true" />
                            <ForwardArrowIcon size={16} aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            <ForwardArrowIcon size={16} aria-hidden="true" />
                            <BackArrowIcon size={16} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </Tooltip>

                    <Tooltip
                      label={
                        noFilters ||
                        (filtersRef?.current?.scrollHeight !== undefined &&
                          filtersRef.current.scrollHeight <=
                            MAX_HEIGHT_QE_SECTION)
                          ? "All rows are already displayed"
                          : filtersSectionCollapsed
                          ? "Display all rows"
                          : "Display fewer rows"
                      }
                    >
                      <button
                        data-testid="button-expand-collapse-cohort-filters-section"
                        color="white"
                        onClick={() =>
                          setFiltersSectionCollapsed(!filtersSectionCollapsed)
                        }
                        aria-label="Expand/collapse filters section"
                        aria-expanded={!filtersSectionCollapsed}
                        disabled={
                          noFilters ||
                          (filtersRef?.current?.scrollHeight !== undefined &&
                            filtersRef.current.scrollHeight <=
                              MAX_HEIGHT_QE_SECTION)
                        }
                        className={getCombinedClassesForRowCollapse(
                          filtersSectionCollapsed,
                        )}
                      >
                        {filtersSectionCollapsed ? (
                          <>
                            <DownArrowIcon size={30} aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            <UpArrowIcon size={30} aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </>
              </div>
              <div
                data-testid="text-cohort-filters"
                className="flex flex-wrap bg-base-max w-full p-2 overflow-x-hidden"
                style={
                  filtersSectionCollapsed
                    ? { maxHeight: `${QESectionHeight}px`, overflowY: "scroll" }
                    : undefined
                }
                ref={filtersRef}
              >
                {noFilters ? (
                  <p
                    data-testid="text-no-active-cohort-filter"
                    className="font-content"
                  >
                    No filters currently applied.
                  </p>
                ) : (
                  Object.keys(filters.root).map((k) => {
                    return convertFilterToComponent(filters.root[k], hooks);
                  })
                )}
              </div>
            </div>
          </QueryExpressionsExpandedContext.Provider>
        )}
      </div>
    </MantineProvider>
  );
};

export default QueryExpressionSection;
