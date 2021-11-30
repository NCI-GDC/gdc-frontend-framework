import { useRef } from "react";
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

} from "react-icons/md";
import { FacetChart } from "../charts/FacetChart";


interface UseCaseFacetResponse {
  readonly data?: FacetBuckets;
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
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};


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


interface FacetLoadingProps {
  readonly field: string;
  readonly facetName?: string;
}

const FacetLoading: React.FC<FacetLoadingProps> = ({
                                                     field,
                                                     facetName = null,
                                                   }: PropsWithChildren<FacetLoadingProps>) => {
  const circleCommonClasses = "h-2.5 w-2.5 bg-current   rounded-full";

  return (
    <div className="flex flex-col border-r-2  border-b-0 border-l-2  bg-white">
      <div>
        <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">
          {(facetName === null) ? convertFieldToName(field) : facetName}
        </div>
      </div>
      <div className="flex flex-row">
        <div className={`${circleCommonClasses} mr-1 animate-bounce`} />
        <div className={`${circleCommonClasses} mr-1 animate-bounce200`} />
        <div className={`${circleCommonClasses} animate-bounce400`} />
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
  const [selectedEnums, setSelectedEnums] = useState(useCohortFacetFilterByName(field));

  const { data, error, isUninitialized, isFetching, isError, isSuccess } =
    useCaseFacet(field);

  const coreDispatch = useCoreDispatch();

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

/*
  if (isUninitialized) {
    return <FacetLoading field={field} facetName={facetName} />;
  }

  if (isFetching) {
    return <FacetLoading field={field} facetName={facetName} />;
  }

  if (isError) {
    return <FacetLoading field={field} facetName={facetName} />;
  }
*/
  const maxValuesToDisplay = 6;
  const total = isSuccess ? Object.entries(data).filter(data => data[0] != "_missing").length : 6;

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


  const visibleValues = (total - maxValuesToDisplay);
  const cardHeight = visibleValues > 16 ? 96 : visibleValues > 0 ? Math.min(96, visibleValues * 5 + 40) : 24;
  const cardStyle = isGroupExpanded ? `flex-none h-${cardHeight} overflow-y-scroll` : "overflow-hidden pr-3.5";

  return (
    <div>
      <div className="flex flex-col border-2 bg-white p-1  relative drop-shadow-md border-nci-blumine-lighter">
        <div>
          <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">

            <div className="has-tooltip">{(facetName === null) ? convertFieldToName(field) : facetName}
              <div
                className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
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
        <div>
          <div className={isFacetView ? "flip-card" : "flip-card flip-card-flipped"}>
            <div className="card-face bg-white">
              <div>
                <div
                  className="flex flex-row items-center justify-between flex-wrap border p-1">
                  <button
                    className={"ml-2 border rounded border-nci-blumine bg-nci-blumine hover:bg-nci-blumine-lightest text-white hover:text-nci-blumine-darker"}>
                    <AlphaSortIcon onClick={() => setIsSortedByCases(false)} scale="1.5em" />
                  </button>
                  <div className={"flex flex-row items-center "}>
                    <button onClick={() => setIsSortedByCases(true)}
                            className={"border rounded border-nci-blumine bg-nci-blumine hover:bg-nci-blumine-lightest text-white hover:text-nci-blumine-darker"}>
                      <SortIcon scale="1.5em" /></button>
                    <p className="px-2 mr-3">Cases</p>
                  </div>
                </div>

                <div className={cardStyle}>
                  {
                    (!(isFetching || isUninitialized || isError) ) ?
                      Object.entries(data).filter(data => data[0] != "_missing").sort(isSortedByCases ? ([, a], [, b]) => b - a : ([a], [b]) => a.localeCompare(b),
                      ).map(([value, count], i) => {
                        if (!isGroupExpanded && i >= maxValuesToDisplay) return null;
                        return (
                          <div key={`${field}-${value}`} className="flex flex-row gap-x-1 px-2">
                            <div className="flex-none">
                              <input type="checkbox" value={value} onChange={handleChange}
                                     checked={selectedEnums && selectedEnums.includes(value)} />
                            </div>
                            <div className="flex-grow truncate ...">{value}</div>
                            <div className="flex-none text-right w-14">{count.toLocaleString()}</div>
                            <div
                              className="flex-none text-right w-18">({((count / 84609) * 100).toFixed(2).toLocaleString()}%)
                            </div>
                          </div>
                        );
                      }) :
                      <div>
                        {
                          Array.from(Array(5)).map((_, index) => {
                            return (
                              <div key={`${field}-${index}`} className="flex flex-row items-center px-2">
                                <div className="flex-none">
                                  <input type="checkbox" />
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
              {!(isFetching || isUninitialized || isError) ?
                <div className={"mt-3"}>
                  {visibleValues > 0 ? !isGroupExpanded ?
                      <div className="bg-white border-2  p-1.5">
                        <Button key="show-more"
                                className="text-left p-2 w-auto hover:text-black"
                                onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
                          {visibleValues} more
                        </Button>
                      </div>
                      :
                      <div className="bg-white border-2  p-1.5">
                        <Button key="show-less"
                                className="text-left border-2 p-1.5 w-auto hover:text-black"
                                onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
                          Show less
                        </Button>
                      </div>
                    : null
                  }
                </div> : <div>

                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => s[0].toUpperCase() + s.substr(1));
  return capitalizedTokens.join(" ");
};

