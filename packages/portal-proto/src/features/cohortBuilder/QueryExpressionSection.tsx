import React, { useState, useEffect, useReducer, useRef } from "react";
import { ActionIcon } from "@mantine/core";
import {
  MdOutlineArrowBackIos as LeftArrowIcon,
  MdOutlineArrowForwardIos as RightArrowIcon,
  MdKeyboardArrowDown as DownArrowIcon,
  MdKeyboardArrowUp as UpArrowIcon,
} from "react-icons/md";
import tw from "tailwind-styled-components";
import { omit } from "lodash";
import {
  useCoreDispatch,
  clearCohortFilters,
  FilterSet,
  DEFAULT_COHORT_ID,
} from "@gff/core";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { convertFilterToComponent } from "./QueryRepresentation";

const QueryExpressionContainer = tw.div`
  flex
  items-center
  bg-white
  shadow-[0_-2px_6px_0_rgba(0,0,0,0.16)]
  border-secondary-darkest
  border-1
  border-l-4
  mt-3
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
      {currentCohortId !== DEFAULT_COHORT_ID ? (
        <QueryExpressionsExpandedContext.Provider
          value={[expandedState[currentCohortId], setExpandedState]}
        >
          <div className="flex flex-col w-full bg-primary">
            <div className="flex flex-row py-2 items-center border-secondary-darkest border-b-1">
              <OverflowTooltippedLabel
                label={currentCohortName}
                className="font-bold text-secondary-contrast-darkest ml-3 max-w-[260px]"
              >
                {currentCohortName}
              </OverflowTooltippedLabel>
              <>
                <button
                  className={`text-sm font-montserrat pl-2 ${
                    noFilters
                      ? "cursor-not-allowed text-secondary-contrast-darkest"
                      : "cursor-pointer text-secondary-contrast-darkest"
                  }`}
                  onClick={clearAllFilters}
                  disabled={noFilters}
                >
                  Clear All
                </button>
                <div className="display flex gap-2 ml-auto mr-3">
                  <ActionIcon
                    variant={
                      allQueryExpressionsCollapsed ? "filled" : "outline"
                    }
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
                    disabled={noFilters}
                  >
                    {allQueryExpressionsCollapsed ? (
                      <>
                        <LeftArrowIcon size={20} className="text-primary" />
                        <RightArrowIcon size={20} className="text-primary" />
                      </>
                    ) : (
                      <>
                        <RightArrowIcon size={20} className="text-white" />
                        <LeftArrowIcon size={20} className="text-white" />
                      </>
                    )}
                  </ActionIcon>
                  <ActionIcon
                    variant={filtersSectionCollapsed ? "outline" : "filled"}
                    color="white"
                    onClick={() =>
                      setFiltersSectionCollapsed(!filtersSectionCollapsed)
                    }
                    aria-label="Expand/collapse filters section"
                    aria-expanded={!filtersSectionCollapsed}
                    disabled={noFilters || numOfRows <= MAX_COLLAPSED_ROWS}
                  >
                    {filtersSectionCollapsed ? (
                      <>
                        <DownArrowIcon size={30} className="text-primary" />
                      </>
                    ) : (
                      <>
                        <UpArrowIcon size={30} className="text-white" />
                      </>
                    )}
                  </ActionIcon>
                </div>
              </>
            </div>
            <div
              className={`flex flex-wrap bg-base-max w-full p-2 pb-0 overflow-x-hidden ${
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
                <p className="pb-2">No filters currently applied.</p>
              ) : (
                Object.keys(filters.root).map((k) => {
                  return convertFilterToComponent(filters.root[k]);
                })
              )}
            </div>
          </div>
        </QueryExpressionsExpandedContext.Provider>
      ) : (
        <span className="text-md p-3 text-primary-darkest ">
          Currently viewing all cases in the GDC. Further refine your cohort
          with tools such as the Cohort Builder.
        </span>
      )}
    </QueryExpressionContainer>
  );
};

export default QueryExpressionSection;
