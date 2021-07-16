import {
  FacetBuckets,
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
} from "@gff/core";
import { useEffect } from "react";

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
    selectCasesFacetByField(state, field)
  );

  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, [facet]);

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  }
};

interface FacetProps {
  readonly field: string;
}

export const Facet: React.FC<FacetProps> = ({ field }: FacetProps) => {
  const {data, error, isUninitialized, isFetching, isSuccess, isError} = useCaseFacet(field);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }
  
  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }
  
  const maxValuesToDisplay = 10;
  const showAll = false;

  return (
    <div className="flex flex-col border-2 p-4 ">
      <div className="font-bold">{convertFieldToName(field)}</div>
      {Object.entries(data).map(([value, count], i) => {
        if (value === "_missing") return null;

        if (!showAll && i == maxValuesToDisplay) {
          return (
            <div key="show-more" className="text-right">
              Show more...
            </div>
          );
        }

        if (!showAll && i > maxValuesToDisplay) return null;

        return (
          <div key={`${field}-${value}`} className="flex flex-row gap-x-2">
            <div className="flex-none">
              <input type="checkbox" />
            </div>
            <div className="flex-grow truncate ...">{value}</div>
            <div className="flex-none text-right">{count}</div>
          </div>
        );
      })}
    </div>
  );
};

const convertFieldToName = (field: string): string => {
  const property = field.split('.').pop();
  const tokens = property.split('_');
  const capitalizedTokens = tokens.map(s => s[0].toUpperCase() + s.substr(1));
  return capitalizedTokens.join(' ');
};
