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
import { useCoreDispatch, clearCohortFilters, FilterSet } from "@gff/core";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { convertFilterToComponent } from "./QueryRepresentation";

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
                <ActionIcon
                  data-testid="button-expand-collapse-cohort-queries"
                  variant={allQueryExpressionsCollapsed ? "filled" : "outline"}
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
                  className="text-primary hover:bg-primary-darkest hover:text-primary-content-lightest hover:border-primary-darkest"
                  disabled={noFilters}
                >
                  {allQueryExpressionsCollapsed ? (
                    <>
                      <LeftArrowIcon size={20} />
                      <RightArrowIcon size={20} />
                    </>
                  ) : (
                    <>
                      <RightArrowIcon size={20} className="text-white" />
                      <LeftArrowIcon size={20} className="text-white" />
                    </>
                  )}
                </ActionIcon>
                <ActionIcon
                  data-testid="button-expand-collapse-cohort-filters-section"
                  variant={filtersSectionCollapsed ? "outline" : "filled"}
                  color={filtersSectionCollapsed ? "white" : "white"}
                  onClick={() =>
                    setFiltersSectionCollapsed(!filtersSectionCollapsed)
                  }
                  aria-label="Expand/collapse filters section"
                  aria-expanded={!filtersSectionCollapsed}
                  disabled={
                    noFilters || filtersRef?.current?.clientHeight < 100
                  }
                  className={`text-white data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary hover:bg-primary-darkest hover:border-primary-darkest`}
                >
                  {filtersSectionCollapsed ? (
                    <>
                      <DownArrowIcon size={30} className="" />
                    </>
                  ) : (
                    <>
                      <UpArrowIcon
                        size={30}
                        className="text-primary hover:text-white "
                      />
                    </>
                  )}
                </ActionIcon>
              </div>
            </>
          </div>
          <div
            data-testid="text-cohort-filters"
            className={`flex flex-wrap bg-base-max w-full p-2 overflow-x-hidden ${
              filtersSectionCollapsed ? "overflow-y-auto" : "h-full"
            }`}
            style={
              filtersSectionCollapsed && filtersRef?.current?.clientHeight > 100
                ? { maxHeight: 100 }
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
