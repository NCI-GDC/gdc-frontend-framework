import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
} from "@gff/core";

import { useEffect, useState } from "react";
import { Button } from "../layout/UserFlowVariedPages";
import {
  MdSortByAlpha as AlphaSortIcon,
  MdSort as SortIcon,
  MdSearch as SearchIcon,
  MdFlip as FlipIcon,

} from "react-icons/md";

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


const FacetHeader: React.FC<FacetProps> = ({ field, description} : FacetProps) => {
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
  )
}



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
  const showAll = isGroupExpanded ? true : false;
  const total = Object.entries(data).length;

  const handleChange = (e) => {
    const { value, checked } = e.target;
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div>
      <Facet field={field} description={description}/>

      <div>
        <div className="bg-white border-b-2 border-r-2 border-l-2 p-1.5">
          {total - maxValuesToDisplay > 0 ? !showAll ?
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
  );
};

const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => s[0].toUpperCase() + s.substr(1));
  return capitalizedTokens.join(" ");
};
