import React, {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { ActionIcon } from "@mantine/core";
import {
  MdKeyboardArrowLeft as LeftArrowIcon,
  MdKeyboardArrowRight as RightArrowIcon,
  MdKeyboardArrowDown as DownArrowIcon,
  MdKeyboardArrowUp as UpArrowIcon,
} from "react-icons/md";
import { useCoreDispatch, clearCohortFilters, FilterSet } from "@gff/core";
import { truncateString } from "src/utils";
import { convertFilterToComponent } from "./QueryRepresentation";

interface QueryExpressionSectionProps {
  readonly filters: FilterSet;
  readonly currentCohortName: string;
}

export const QueryExpressionsExpandedStateContext =
  React.createContext(undefined);

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
  const filtersRef = useRef(null);

  const dispatch = useCoreDispatch();

  const clearAllFilters = () => {
    dispatch(clearCohortFilters());
  };

  useEffect(() => {
    const overflowing =
      (filtersRef?.current?.scrollHeight || 0) >
      (filtersRef?.current?.clientHeight || 0);
    console.log(filtersRef?.current?.scrollHeight || 0);
    console.log(filtersRef?.current?.clientHeight || 0);
    console.log(filtersRef);
    setFilterSectionOverflowing(overflowing);
  }, [filtersRef?.current?.scrollHeight, filtersRef?.current?.clientHeight]);

  return (
    <div className="flex items-center bg-white shadow-[0_-2px_6px_0_rgba(0,0,0,0.16)] border-primary-darkest border-l-4 p-4 mt-3">
      {Object.keys(filters.root).length !== 0 ? (
        <QueryExpressionsExpandedStateContext.Provider
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
                  variant="outline"
                  className={`border-primary-darkest ${
                    Object.values(queryExpressionsExpanded).every((q) => !q)
                      ? "bg-primary-darkest"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setQueryExpressionsExpanded(
                      Object.values(queryExpressionsExpanded).every((q) => !q)
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
                >
                  {Object.values(queryExpressionsExpanded).every((q) => !q) ? (
                    <>
                      <LeftArrowIcon size={30} color="white" />
                      <RightArrowIcon size={30} color="white" />
                    </>
                  ) : (
                    <>
                      <RightArrowIcon size={30} color="primary.9" />
                      <LeftArrowIcon size={30} color="primary.9" />
                    </>
                  )}
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  className={`border-primary-darkest ${
                    filtersSectionCollapsed ? "bg-white" : "bg-primary-darkest"
                  }`}
                  onClick={() =>
                    setFiltersSectionCollapsed(!filtersSectionCollapsed)
                  }
                  disabled={
                    !filterSectionOverflowing && filtersSectionCollapsed
                  }
                  aria-label="Expand/collapse filters section"
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
              className={`flex flex-wrap bg-base-lightest w-full p-2 ${
                filtersSectionCollapsed ? "overflow-auto max-h-32" : "h-full"
              }`}
              ref={filtersRef}
            >
              {Object.keys(filters.root).map((k) => {
                return convertFilterToComponent(filters.root[k]);
              })}
            </div>
          </div>
        </QueryExpressionsExpandedStateContext.Provider>
      ) : (
        <span className="text-md text-primary-darkest ">
          Currently viewing all cases in the GDC. Further refine your cohort
          with tools such as the Cohort Builder.
        </span>
      )}
    </div>
  );
};

export default QueryExpressionSection;
