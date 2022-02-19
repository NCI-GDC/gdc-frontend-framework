import {
  EnumFilter,
  FacetBuckets,
  fetchFacetByName,
  FilterSet,
  removeCohortFilter,
  selectCasesFacetByField,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  fetchFileFacetByName,
  selectFilesFacetByField,
} from "@gff/core";

import { useEffect, useState } from "react";

import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
  MdSearch as SearchIcon,
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
} from "react-icons/md";
import { convertFieldToName } from "./utils";
import { FacetChart } from "../charts/FacetChart";
import { Tooltip } from "@mantine/core";

/**
 * Filter selector for all of the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
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

interface EnumFacetResponse {
  readonly data?: FacetBuckets;
  readonly enumFilters: string [] | undefined;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useFilesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFilesFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(field);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFileFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFileFacetByName(field));
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

export interface FacetProps {
  readonly field: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?:boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly valueLabel?: string;
}

export interface EnumFacetProps extends FacetProps {
  readonly dataHook : (string) => EnumFacetResponse;
  readonly updateEnumFilters: (d, filters, field) => void;
}

const updateEnumFilters = (dispatch, enumerationFilters, field ) => {
  if (enumerationFilters === undefined)
    return;
  if (enumerationFilters.length > 0) {
    dispatch(updateCohortFilter({ type: "enum", op: "in", field: `${field}`, values: enumerationFilters }));
  } else { // completely remove the field
    dispatch(removeCohortFilter(field));
  }
}

export const FileEnumFacet :  React.FC<FacetProps> = ( {
                                                         field,
                                                         description,
                                                         facetName = null,
                                                         showSearch = true,
                                                         showFlip=true,
                                                         startShowingData = true,

                                                           }: FacetProps) => {


  return <EnumFacetComponent field={field}
                             description={description}
                             facetName={facetName}
                             showSearch={showSearch}
                             showFlip={showFlip}
                             startShowingData={startShowingData}
                             dataHook={useFilesFacet}
                             updateEnumFilters={updateEnumFilters}
                             valueLabel="Files" showPercent={false}
                             />
}

export const EnumFacetComponent: React.FC<EnumFacetProps> = ({
                                              field,
                                              description, dataHook, updateEnumFilters,
                                              facetName = null,
                                              showSearch = true,
                                              showFlip=true,
                                              startShowingData = true,
                                              showPercent = true,
                                              valueLabel = "Cases"
                                            }: EnumFacetProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSortedByValue, setIsSortedByValue] = useState(false);
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const [visibleItems, setVisibleItems] = useState(6);

  const { data, enumFilters, isSuccess } = dataHook(field);
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
     * Logic here: if the facet never sets a filter then return,
     * if a filter was added: update, if all are removed: remove the filter from the cohort
     */
    updateEnumFilters(coreDispatch, selectedEnums, field);
  }, [selectedEnums]);

  const maxValuesToDisplay = 6;
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
  const cardStyle = isGroupExpanded ? `flex-none  h-${cardHeight} overflow-y-scroll ` : `overflow-hidden pr-3.5`;
  const numberOfLines = (total - maxValuesToDisplay) < 0 ? total : isGroupExpanded ? 16 : maxValuesToDisplay;
  const chartHeight = [0, 60, 60, 115, 135, 165, 190];
  return (
      <div className="flex flex-col bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md ">
        <div>
          <div className="flex items-center justify-between flex-wrap bg-nci-cyan-darker shadow-md px-1.5">

            <Tooltip label={description}
                     classNames={{
                       arrow: "bg-nci-gray-light",
                       body: "bg-white text-nci-gray-dark"
                     }}
                     position="bottom"
                     placement="start"
                     wrapLines
                     width={220}
                     withArrow
                     transition="fade"
                     transitionDuration={200}>
            <div className="has-tooltip text-nci-gray-lightest font-heading font-medium text-md">{(facetName === null) ? convertFieldToName(field) : facetName}
             </div>
            </Tooltip>
            <div className="flex flex-row">
              {showSearch ? <button
                className="hover:bg-grey text-nci-gray-lightest font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleSearch}>
                <SearchIcon size="1.5em" />
              </button> : null
              }
              {showFlip ? <button
                className="hover:bg-grey text-nci-gray-lightest font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleFlip}>
                <FlipIcon size="1.15em" />
              </button> : null
              }
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
                    className={"ml-0.5 border rounded-sm border-nci-gray-darkest bg-nci-cyan hover:bg-nci-cyan-lightest text-white hover:text-nci-cyan-darker"}>
                    <AlphaSortIcon onClick={() => setIsSortedByValue(false)} scale="1.5em" />
                  </button>
                  <div className={"flex flex-row items-center "}>
                    <button onClick={() => setIsSortedByValue(true)}
                            className={"border rounded-sm border-nci-cyan-darkest bg-nci-cyan hover:bg-nci-cyan-lightest text-white hover:text-nci-cyan-darker"}>
                      <SortIcon scale="1.5em" /></button>
                    <p className="px-2 mr-3">{valueLabel}</p>
                  </div>
                </div>

                <div className={cardStyle}>
                  {
                    isSuccess ?
                      Object.entries(data).filter(data => data[0] != "_missing").sort(isSortedByValue ? ([, a], [, b]) => b - a : ([a], [b]) => a.localeCompare(b),
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
                            {showPercent ? <div
                              className="flex-none text-right w-18 ">({((count / 85415) * 100).toFixed(2).toLocaleString()}%)
                            </div> : null
                            }

                          </div>
                        );
                      }) :
                      <div>
                        { // uninitialized, loading, error animated bars
                          Array.from(Array(numberOfLines)).map((_, index) => {
                            return (
                              <div key={`${field}-${index}`} className="flex flex-row items-center px-2">
                                <div className="flex-none">
                                  <input type="checkbox" className="bg-nci-cyan-lightest hover:bg-nci-cyan-darkest text-nci-cyan-darkest"/>
                                </div>
                                <div className="flex-grow h-4 align-center justify-center mt-1 ml-1 mr-8 bg-nci-gray-light rounded-b-sm animate-pulse"/>
                                <div className="flex-none h-4 align-center justify-center mt-1 w-10 bg-nci-gray-light rounded-b-sm animate-pulse"/>
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
                        <MoreIcon key="show-more" size="1.5em" className="text-nci-cyan-darkest"
                                  onClick={() => setIsGroupExpanded(!isGroupExpanded)} />
                        <div className="pl-1 text-nci-cyan-darkest"> {isSuccess ? remainingValues : "..."} more</div>
                      </div>
                      :
                      <div
                        className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
                        <LessIcon key="show-less" size="1.5em" className="text-nci-cyan-darkest"
                                  onClick={() => setIsGroupExpanded(!isGroupExpanded)} />
                        <div className="pl-1 text-nci-cyan-darkest"> show less</div>
                      </div>
                    : null
                  }
                </div>
              }
            </div>

            <div className="card-face card-back bg-white">
              <FacetChart
                field={field}
                marginBottom={40}
                marginTop={5} padding={1}
                showXLabels={true}
                showTitle={false}
                height={isGroupExpanded ? cardHeight * 4.88 : chartHeight[total]}
                orientation="h"
                maxBins={Math.min(isGroupExpanded ? 16 : Math.min(6, total))}
              />
            </div>

          </div>
        </div>
      </div>

  );
};



