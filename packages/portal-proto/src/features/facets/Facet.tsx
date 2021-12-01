import {
  FacetBuckets,
  EnumFilter,
  FilterSet,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  addCohortFilter,
  removeCohortFilter,
} from "@gff/core";

import { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "../layout/UserFlowVariedPages";
import {
  MdSortByAlpha as AlphaSortIcon,
  MdSort as SortIcon,
  MdSearch as SearchIcon,
  MdFlip as FlipIcon,
  MdAddCircle as MoreIcon,
  MdRemoveCircle as LessIcon,

} from "react-icons/md";
import { convertFieldToName } from "./utils";
import { FacetChart } from "../charts/FacetChart";

/**
 * Selector for the facet values (if any)
 * @param field
 */
const useCohortFacetFilterByName = (field: string): string[] | undefined => {
  const enumFilters: EnumFilter = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field) as EnumFilter,
  );
  return enumFilters ? enumFilters.values : undefined;
};

interface UseCaseFacetResponse {
  readonly data?: FacetBuckets;
  readonly enumFilters: string [] | undefined;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useCaseFacet = (field: string): UseCaseFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCasesFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(field);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFacetByName(field));
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * Filter selector for all of the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  const cohortFilters: FilterSet = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  return cohortFilters;
};

interface FacetProps {
  readonly field: string;
  readonly description?: string;
  readonly facetName?: string;
  onUpdateSummaryChart: (op: string, field: string) => void;
}


const FacetHeader: React.FC<FacetProps> = ({ field, description, facetName = null }: PropsWithChildren<FacetProps>) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div className="flex flex-col border-r-2  border-b-0 border-l-2  bg-white">
      <div>
        <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">
          <div className="has-tooltip">{(facetName === null) ? convertFieldToName(field) : facetName}
            <div
              className="inline-block tooltip w-1/2 border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
          </div>
          <div className="flex flex-row">
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={toggleSearch}>
              <SearchIcon />
            </button>
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={toggleFlip}>
              <FlipIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Facet: React.FC<FacetProps> = ({
                                              field,
                                              description,
                                              onUpdateSummaryChart,
                                              facetName = null,
                                            }: FacetProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSortedByCases, setIsSortedByCases] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);
  const [ visibleItems, setVisibleItems] = useState(6);

  const { data, enumFilters,  isError, isSuccess  } =
    useCaseFacet(field);

  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const coreDispatch = useCoreDispatch();

  useEffect(() => {
    setSelectedEnums(enumFilters);
  } ,[enumFilters]);

  useEffect(() => {
    if (isSuccess) {
      setVisibleItems(Object.entries(data).filter(data => data[0] != "_missing").length)
    }
  } ,[isSuccess]);


  useEffect(() => {
    /**
     * Logic here: if the facet never sets a filter return,
     * if a filter was added update, if all are removed set remove the filter from the cohort
     */
    if (selectedEnums === undefined)
      return;
    if (selectedEnums.length > 0) {
      coreDispatch(addCohortFilter({ type: "enum", op: "in", field: field, values: selectedEnums }));
    } else {
      coreDispatch(removeCohortFilter(field));
    }
  }, [selectedEnums]);

  const maxValuesToDisplay = 6;
 // const total = isSuccess ? Object.entries(data).filter(data => data[0] != "_missing").length : 6;
  const total = visibleItems;
  if (total == 0) {
    return null; // nothing to render if total == 0
  }

  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const updated = selectedEnums ? [...selectedEnums, value] : [value];
      setSelectedEnums(updated);
    } else {
      const updated = selectedEnums.filter((x) => x != value);
      setSelectedEnums(updated);
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };


  const remainingValues = (total - maxValuesToDisplay);
  const cardHeight = remainingValues > 16 ? 96 : remainingValues > 0 ? Math.min(96, remainingValues * 5 + 40) : 24;
  const cardStyle = isGroupExpanded ? `flex-none h-${cardHeight} overflow-y-scroll` : "overflow-hidden pr-3.5";
  const numberOfLines = (total - maxValuesToDisplay) < 0 ? total : isGroupExpanded ? 16 : maxValuesToDisplay;
  return (
    <div>
      <div className="flex flex-col bg-white relative shadow-md border-nci-cyan-darker border-2 rounded-b-md">
        <div>
          <div className="flex items-center justify-between flex-wrap bg-nci-cyan-darker shadow-md px-1.5">

            <div className="has-tooltip text-nci-gray-lightest font-heading font-medium text-md">{(facetName === null) ? convertFieldToName(field) : facetName}
              <div
                className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
            </div>
            <div className="flex flex-row">
              <button
                className="bg-nci-cyan-darker hover:bg-grey text-nci-gray-lightest font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleSearch}>
                <SearchIcon size="1.5em" />
              </button>
              <button
                className="bg-nci-cyan-darker hover:bg-grey text-nci-gray-lightest font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleFlip}>
                <FlipIcon size="1.15em"  />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className={isFacetView ? "flip-card" : "flip-card flip-card-flipped"}>
            <div className="card-face bg-white">
              <div>
                <div
                  className="flex flex-row items-center justify-between flex-wrap border p-1">
                  <button
                    className={"ml-0.5 border rounded-sm border-nci-cyan-darkest bg-nci-cyan hover:bg-nci-cyan-lightest text-white hover:text-nci-cyan-darker"}>
                    <AlphaSortIcon onClick={() => setIsSortedByCases(false)} scale="1.5em" />
                  </button>
                  <div className={"flex flex-row items-center "}>
                    <button onClick={() => setIsSortedByCases(true)}
                            className={"border ∂rounded-sm border-nci-cyan-darkest bg-nci-cyan hover:bg-nci-cyan-lightest text-white hover:text-nci-cyan-darker"}>
                      <SortIcon scale="1.5em" /></button>
                    <p className="px-2 mr-3">Cases</p>
                  </div>
                </div>

                <div className={cardStyle}>
                  {
                    isSuccess ?
                      Object.entries(data).filter(data => data[0] != "_missing").sort(isSortedByCases ? ([, a], [, b]) => b - a : ([a], [b]) => a.localeCompare(b),
                      ).map(([value, count], i) => {
                        if (!isGroupExpanded && i >= maxValuesToDisplay) return null;
                        return (
                          <div key={`${field}-${value}`} className="flex flex-row gap-x-1 px-2">
                            <div className="flex-none">
                              <input type="checkbox" value={value} onChange={handleChange}
                                     className="bg-nci-cyan-lightest hover:bg-nci-cyan-darkest text-nci-cyan-darkest"
                                     checked={selectedEnums && selectedEnums.includes(value)} />
                            </div>
                            <div className="flex-grow truncate ... font-heading text-md pt-0.5">{value}</div>
                            <div className="flex-none text-right w-14 ">{count.toLocaleString()}</div>
                            <div
                              className="flex-none text-right w-18 ">({((count / 84609) * 100).toFixed(2).toLocaleString()}%)
                            </div>

                          </div>
                        );
                      }) :
                      <div>
                        { // unnitialized, loading, error
                          Array.from(Array(numberOfLines)).map((_, index) => {
                           // const grayBar = "flex-none h-4 align-center justify-center mt-1 w-10 bg-nci-gray-light rounded-b-sm animate-pulse";
                            return (
                              <div key={`${field}-${index}`} className="flex flex-row items-center px-2">
                                <div className="flex-none">
                                  <input type="checkbox" className="bg-nci-cyan-lightest hover:bg-nci-cyan-darkest text-nci-cyan-darkest"/>
                                </div>
                                <div className="flex-grow h-4 align-center justify-center mt-1 ml-1 mr-8 bg-nci-gray-light rounded-b-sm animate-pulse"></div>
                                <div className="flex-none h-4 align-center justify-center mt-1 w-10 bg-nci-gray-light rounded-b-sm animate-pulse"></div>
                              </div>);

                          })
                        }
                      </div>
                  }
                </div>
              </div>
              {
                <div className="mt-3 m-1">
                  {remainingValues > 0 ? !isGroupExpanded ?
                      <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
                          <MoreIcon key="show-more" size="1.5em" className="text-nci-cyan-darkest"  onClick={() => setIsGroupExpanded(!isGroupExpanded)}/>
                        <div className="pl-1 text-nci-cyan-darkest"> {isSuccess ? remainingValues : "..."} more </div>
                      </div>
                      :
                        <div className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
                          <LessIcon key="show-less" size="1.5em" className="text-nci-cyan-darkest"  onClick={() => setIsGroupExpanded(!isGroupExpanded)}/>
                          <div className="pl-1 text-nci-cyan-darkest"> show less </div>
                        </div>
                    : null
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



