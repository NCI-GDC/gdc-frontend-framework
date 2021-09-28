import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
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

  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

interface FacetProps {
  readonly field: string;
  readonly description?: string;
}


const FacetHeader: React.FC<FacetProps> = ({ field, description }: PropsWithChildren<FacetProps>) => {
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
          <div className="has-tooltip">{convertFieldToName(field)}
            <div
              className="inline-block tooltip w-1/4 border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
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


export const Facet: React.FC<FacetProps> = ({ field, description }: FacetProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);
  const { data, error, isUninitialized, isFetching, isError } =
    useCaseFacet(field);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  const maxValuesToDisplay = 6;
  const total = Object.entries(data).filter(data => data[0] != "_missing" ).length;

  const handleChange = (e) => {
    const { value, checked } = e.target;
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const visibleValues = (total - maxValuesToDisplay);
  const cardHeight = visibleValues > 16 ? 96 : visibleValues > 0 ? Math.min(96, visibleValues * 5 + 40): 24;

  const cardStyle = isGroupExpanded ? `flex-none h-${cardHeight} overflow-y-scroll` : "overflow-hidden pr-3.5";
;
  return (
    <div>
      <div className=" flex  flex-col border-r-2  border-b-0 border-l-2  bg-white relative">
        <div>
          <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">
            <div className="has-tooltip">{convertFieldToName(field)}
              <div
                className="inline-block tooltip w-1/4 border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
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
        <div >
        <div className={isFacetView ? "flip-card" : "flip-card flip-card-flipped"}>
          <div className="card-face bg-white">
          <div>
            <div
              className="flex flex-row items-center justify-between flex-wrap bg-white mb-1 p-2 border-b-2 border-nci-gray-lighter">
              <AlphaSortIcon scale="1.5em" />
              <div className={"flex flex-row items-center"}><SortIcon scale="1.5em" /> <p className="px-2">Cases</p>
              </div>
            </div>

            <div className={cardStyle}>
              {Object.entries(data).filter(data => data[0] != "_missing" ).map(([value, count], i) => {
                if (!isGroupExpanded && i >= maxValuesToDisplay) return null;
                return (
                  <div key={`${field}-${value}`} className="flex flex-row gap-x-1 px-2">
                    <div className="flex-none">
                      <input type="checkbox" value={`${field}:${value}`} onChange={handleChange} />
                    </div>
                    <div className="flex-grow truncate ...">{value}</div>
                    <div className="flex-none text-right w-12">{count.toLocaleString()}</div>
                    <div className="flex-none text-right w-18">({((count / 84609) * 100).toFixed(2).toLocaleString()}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        <div>
          <div className="bg-white border-b-2 border-r-2 border-l-2 p-1.5">
            {total - maxValuesToDisplay > 0 ? !isGroupExpanded ?
                <Button key="show-more"
                        className="text-left p-2 w-auto hover:text-black"
                        onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
                  {total - maxValuesToDisplay} more
                </Button>
                :
                <Button key="show-less"
                        className="text-left p-2 w-auto hover:text-black"
                        onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
                  Show less
                </Button>
              : null
            }
          </div>
        </div>
        </div>
          <div className="card-face card-back bg-white">
            <FacetChart
              field={field}
              marginBottom={40}
              showXLabels={true}
              showTitle={false}
              height={ isGroupExpanded ? cardHeight * 4.88 : 200}
              orientation='h'
              maxBins={Math.min(isGroupExpanded ? 16 : Math.min(6, total))}
            />
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
