import React, { useState, useEffect, useReducer, useRef } from "react";
import { ActionIcon, Button } from "@mantine/core";
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
  border-primary-darkest
  border-l-4
  p-4
  mt-3
`;

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

  const dispatch = useCoreDispatch();

  const clearAllFilters = () => {
    dispatch(clearCohortFilters());
    setExpandedState({ type: "clear", cohortId: currentCohortId });
  };
  const allQueryExpressionsCollapsed = Object.values(
    expandedState?.[currentCohortId] || {},
  ).every((q) => !q);

  const noFilters = Object.keys(filters.root).length === 0;

  useEffect(() => {
    if (expandedState?.[currentCohortId] === undefined) {
      setExpandedState({ type: "init", cohortId: currentCohortId });
    }
  }, [currentCohortId, expandedState]);

  return (
    <QueryExpressionContainer>
      {currentCohortId !== DEFAULT_COHORT_ID ? (
        <QueryExpressionsExpandedContext.Provider
          value={[expandedState[currentCohortId], setExpandedState]}
        >
          <div className="flex flex-col w-full">
            <div className="flex mb-2 items-center">
              <OverflowTooltippedLabel
                label={currentCohortName}
                className="font-bold text-primary-darkest pr-4 max-w-[260px]"
              >
                {currentCohortName}
              </OverflowTooltippedLabel>
              <>
                <button
                  className={`text-sm font-montserrat ${
                    noFilters
                      ? "cursor-not-allowed text-base-content"
                      : "cursor-pointer text-primary-darkest"
                  }`}
                  onClick={clearAllFilters}
                  disabled={noFilters}
                >
                  Clear All
                </button>
                <div className="display flex gap-2 ml-auto">
                  <ActionIcon
                    variant={
                      allQueryExpressionsCollapsed ? "filled" : "outline"
                    }
                    color="primary.9"
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
                        <LeftArrowIcon size={20} color="white" />
                        <RightArrowIcon size={20} color="white" />
                      </>
                    ) : (
                      <>
                        <RightArrowIcon size={20} color="primary.9" />
                        <LeftArrowIcon size={20} color="primary.9" />
                      </>
                    )}
                  </ActionIcon>
                  <ActionIcon
                    variant={filtersSectionCollapsed ? "outline" : "filled"}
                    color={"primary.9"}
                    onClick={() =>
                      setFiltersSectionCollapsed(!filtersSectionCollapsed)
                    }
                    aria-label="Expand/collapse filters section"
                    aria-expanded={!filtersSectionCollapsed}
                    disabled={noFilters}
                  >
                    {filtersSectionCollapsed ? (
                      <>
                        <DownArrowIcon size={30} color="primary.9" />
                      </>
                    ) : (
                      <>
                        <UpArrowIcon size={30} color="white" />
                      </>
                    )}
                  </ActionIcon>
                </div>
              </>
            </div>
            <div
              className={`flex flex-wrap bg-base-lightest w-full p-2 rounded-md overflow-x-hidden ${
                filtersSectionCollapsed ? "overflow-y-auto max-h-36" : "h-full"
              }`}
            >
              {noFilters ? (
                <>No filters currently applied.</>
              ) : (
                Object.keys(filters.root).map((k) => {
                  return convertFilterToComponent(filters.root[k]);
                })
              )}
            </div>
          </div>
        </QueryExpressionsExpandedContext.Provider>
      ) : (
        <span className="text-md text-primary-darkest ">
          Currently viewing all cases in the GDC. Further refine your cohort
          with tools such as the Cohort Builder.
        </span>
      )}
    </QueryExpressionContainer>
  );
};

export default QueryExpressionSection;
