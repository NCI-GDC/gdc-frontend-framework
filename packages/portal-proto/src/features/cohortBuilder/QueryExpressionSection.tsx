import React, { useState, useEffect, useReducer, useRef } from "react";
import {
  MdOutlineArrowBackIos as LeftArrowIcon,
  MdOutlineArrowForwardIos as RightArrowIcon,
  MdKeyboardArrowDown as DownArrowIcon,
  MdKeyboardArrowUp as UpArrowIcon,
} from "react-icons/md";
import tw from "tailwind-styled-components";
import { omit } from "lodash";
import { useCoreDispatch, clearCohortFilters, FilterSet } from "@gff/core";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { convertFilterToComponent } from "./QueryRepresentation";
import { Tooltip } from "@mantine/core";
import {
  getCombinedClassesExpandCollapseQuery,
  getCombinedClassesForRowCollapse,
} from "./style";

const QueryExpressionContainer = tw.div`
  flex
  items-center
  bg-white
  border-secondary-darkest
  border-1
  border-l-4
  my-4
  mx-3
`;

const MAX_COLLAPSED_ROWS = 3;

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
      return {
        ...state,
        [action.cohortId]: { ...state[action.cohortId], [action.field]: true },
      };
    case "collapse":
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
  readonly filters: FilterSet;
  readonly currentCohortName: string;
  readonly currentCohortId: string;
}

export const QueryExpressionsExpandedContext =
  React.createContext<
    [Record<string, boolean>, (action: CollapsedStateReducerAction) => void]
  >(undefined);

const QueryExpressionSection: React.FC<QueryExpressionSectionProps> = ({
  filters,
  currentCohortName,
  currentCohortId,
}: QueryExpressionSectionProps) => {
  const [expandedState, setExpandedState] = useReducer(reducer, {});
  const [filtersSectionCollapsed, setFiltersSectionCollapsed] = useState(true);
  const [numOfRows, setNumberOfRows] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const filtersRef = useRef<HTMLDivElement>(null);

  const dispatch = useCoreDispatch();

  const clearAllFilters = () => {
    dispatch(clearCohortFilters());
    setExpandedState({ type: "clear", cohortId: currentCohortId });
  };
  const allQueryExpressionsCollapsed = Object.values(
    expandedState?.[currentCohortId] || {},
  ).every((q) => !q);

  const noFilters = Object.keys(filters?.root || {}).length === 0;

  useEffect(() => {
    if (expandedState?.[currentCohortId] === undefined) {
      setExpandedState({ type: "init", cohortId: currentCohortId });
    }
  }, [currentCohortId, expandedState]);

  useEffect(() => {
    if (filtersRef.current) {
      let tempNumRows = 0;
      let tempCollapsedHeight = 0;
      const filterElements = Array.from(
        filtersRef.current.children,
      ) as HTMLDivElement[];
      filterElements.forEach((f, i) => {
        if (i === 0) {
          tempNumRows++;
          const style = window.getComputedStyle(f);
          tempCollapsedHeight += f.clientHeight + parseInt(style.marginBottom);
        } else if (f.offsetLeft <= filterElements[i - 1].offsetLeft) {
          // If the current element is further to the left than the previous, we are on a new row
          tempNumRows++;
          if (tempNumRows <= MAX_COLLAPSED_ROWS) {
            const style = window.getComputedStyle(f);
            tempCollapsedHeight +=
              f.clientHeight + parseInt(style.marginBottom);
          }
        }
      });

      setNumberOfRows(tempNumRows);
      const parentStyle = window.getComputedStyle(filtersRef.current);
      // height of rows + top padding of parent + padding below rows
      setCollapsedHeight(
        tempCollapsedHeight + parseInt(parentStyle.paddingTop) + 4,
      );
    }
  }, [filters, filtersRef?.current?.clientHeight, expandedState]);

  return (
    <QueryExpressionContainer>
      <QueryExpressionsExpandedContext.Provider
        value={[expandedState[currentCohortId], setExpandedState]}
      >
        <div className="flex flex-col w-full bg-primary">
          <div
            data-testid="text-cohort-filters-top-row"
            className="flex flex-row py-2 items-center border-secondary-darkest border-b-1"
          >
            <OverflowTooltippedLabel
              label={currentCohortName}
              className="font-bold text-secondary-contrast-darkest ml-3 max-w-[260px]"
            >
              {currentCohortName}
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
                            cohortId: currentCohortId,
                          })
                        : setExpandedState({
                            type: "collapseAll",
                            cohortId: currentCohortId,
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
                        <LeftArrowIcon size={16} aria-hidden="true" />
                        <RightArrowIcon size={16} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <RightArrowIcon size={16} aria-hidden="true" />
                        <LeftArrowIcon size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </Tooltip>

                <Tooltip
                  label={
                    filtersSectionCollapsed
                      ? numOfRows <= MAX_COLLAPSED_ROWS
                        ? "All rows are already displayed"
                        : "Display all rows"
                      : numOfRows <= MAX_COLLAPSED_ROWS
                      ? `A maximum of ${MAX_COLLAPSED_ROWS} rows is already displayed`
                      : `Display a maximum of ${MAX_COLLAPSED_ROWS} rows`
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
                    disabled={noFilters || numOfRows <= MAX_COLLAPSED_ROWS}
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
            className={`flex flex-wrap bg-base-max w-full p-2 overflow-x-hidden ${
              filtersSectionCollapsed ? "overflow-y-auto" : "h-full"
            }`}
            style={
              filtersSectionCollapsed && numOfRows > MAX_COLLAPSED_ROWS
                ? { maxHeight: collapsedHeight }
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
                return convertFilterToComponent(filters.root[k]);
              })
            )}
          </div>
        </div>
      </QueryExpressionsExpandedContext.Provider>
    </QueryExpressionContainer>
  );
};

export default QueryExpressionSection;
