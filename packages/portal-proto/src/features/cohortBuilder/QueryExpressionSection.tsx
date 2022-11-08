import React, { useRef, useState, useEffect } from "react";
import { ActionIcon } from "@mantine/core";
import {
  MdOutlineArrowBackIos as LeftArrowIcon,
  MdOutlineArrowForwardIos as RightArrowIcon,
  MdKeyboardArrowDown as DownArrowIcon,
  MdKeyboardArrowUp as UpArrowIcon,
} from "react-icons/md";
import tw from "tailwind-styled-components";
import { useCoreDispatch, clearCohortFilters, FilterSet } from "@gff/core";
import { truncateString } from "src/utils";
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

interface QueryExpressionSectionProps {
  readonly filters: FilterSet;
  readonly currentCohortName: string;
}

export const QueryExpressionsExpandedContext = React.createContext(undefined);

const QueryExpressionSection: React.FC<QueryExpressionSectionProps> = ({
  filters,
  currentCohortName,
}: QueryExpressionSectionProps) => {
  const [queryExpressionsExpanded, setQueryExpressionsExpanded] = useState<
    Record<string, boolean>
  >({});
  const [filtersSectionCollapsed, setFiltersSectionCollapsed] = useState(true);
  const [filterSectionOverflowing, setFilterSectionOverflowing] =
    useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  const dispatch = useCoreDispatch();

  const clearAllFilters = () => {
    dispatch(clearCohortFilters());
  };

  useEffect(() => {
    const overflowing =
      (filtersRef?.current?.scrollHeight || 0) >
      (filtersRef?.current?.clientHeight || 0);
    setFilterSectionOverflowing(overflowing);
  }, [
    filtersSectionCollapsed,
    queryExpressionsExpanded,
    filtersRef?.current?.scrollHeight,
    filtersRef?.current?.clientHeight,
  ]);

  const allQueryExpressionsCollapsed = Object.values(
    queryExpressionsExpanded,
  ).every((q) => !q);

  return (
    <QueryExpressionContainer>
      {Object.keys(filters?.root || {}).length !== 0 ? (
        <QueryExpressionsExpandedContext.Provider
          value={[queryExpressionsExpanded, setQueryExpressionsExpanded]}
        >
          <div className="flex flex-col w-full">
            <div className="flex mb-2">
              <p
                className="font-bold text-primary-darkest pr-4"
                title={
                  currentCohortName.length > 30 ? currentCohortName : undefined
                }
              >
                {truncateString(currentCohortName, 30)}
              </p>
              <button
                className="text-primary-darkest text-sm font-montserrat"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
              <div className="display flex gap-2 ml-auto">
                <ActionIcon
                  variant={allQueryExpressionsCollapsed ? "outline" : "filled"}
                  color="primary.9"
                  onClick={() =>
                    setQueryExpressionsExpanded(
                      allQueryExpressionsCollapsed
                        ? Object.fromEntries(
                            Object.keys(queryExpressionsExpanded).map((q) => [
                              q,
                              true,
                            ]),
                          )
                        : Object.fromEntries(
                            Object.keys(queryExpressionsExpanded).map((q) => [
                              q,
                              false,
                            ]),
                          ),
                    )
                  }
                  aria-label="Expand/collapse all queries"
                  aria-expanded={!allQueryExpressionsCollapsed}
                >
                  {allQueryExpressionsCollapsed ? (
                    <>
                      <RightArrowIcon size={20} color="primary.9" />
                      <LeftArrowIcon size={20} color="primary.9" />
                    </>
                  ) : (
                    <>
                      <LeftArrowIcon size={20} color="white" />
                      <RightArrowIcon size={20} color="white" />
                    </>
                  )}
                </ActionIcon>
                <ActionIcon
                  variant={filtersSectionCollapsed ? "outline" : "filled"}
                  color={"primary.9"}
                  onClick={() =>
                    setFiltersSectionCollapsed(!filtersSectionCollapsed)
                  }
                  disabled={
                    !filterSectionOverflowing && filtersSectionCollapsed
                  }
                  aria-label="Expand/collapse filters section"
                  aria-expanded={!filtersSectionCollapsed}
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
            </div>
            <div
              className={`flex flex-wrap bg-base-lightest w-full p-2 rounded-md overflow-x-hidden ${
                filtersSectionCollapsed ? "overflow-y-auto max-h-32" : "h-full"
              }`}
              ref={filtersRef}
            >
              {Object.keys(filters.root).map((k) => {
                return convertFilterToComponent(filters.root[k]);
              })}
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
