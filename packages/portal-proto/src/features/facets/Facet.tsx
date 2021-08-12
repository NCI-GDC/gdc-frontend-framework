import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
  selectCurrentCohort
} from "@gff/core";


import { useEffect, useState } from "react";
import { Button } from "../layout/UserFlowVariedPages";
import 'lodash';

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
}

export const Facet: React.FC<FacetProps> = ({ field }: FacetProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
    const  { value, checked } = e.target;

  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  }


  return (
    <div>
      <div className="flex flex-col border-2 px-0 bg-white">
        <div className="flex items-center justify-between flex-wrap bg-gray-300 p-1.5">
          {convertFieldToName(field)}
          <button
            className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={toggleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between flex-wrap bg-gray-50 ">
        </div>
        <div>
          <div className={showAll ? "flex-none h-96 overflow-scroll" : "overflow-hidden"}>
            {Object.entries(data).map(([value, count], i) => {
              if (value === "_missing") return null;
              if (!showAll && i > maxValuesToDisplay) return null;
              return (
                <div key={`${field}-${value}`} className="flex flex-row gap-x-2 px-2">
                  <div className="flex-none">
                    <input type="checkbox" value={`${field}:${value}`} onChange={handleChange}/>
                  </div>
                  <div className="flex-grow truncate ...">{value}</div>
                  <div className="flex-none text-right">{count.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
      {total - maxValuesToDisplay > 0 ? !showAll ?
          <Button key="show-more"
                  className="text-left p-2 w-auto text-blue-600  hover:text-black"
                  onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
            {total - maxValuesToDisplay} more
          </Button>
          :
          <Button key="show-less"
                  className="text-left p-2 w-auto text-blue-600  hover:text-black"
                  onClick={() => setIsGroupExpanded(!isGroupExpanded)}>
            Show less
          </Button>
        : null
      }
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
