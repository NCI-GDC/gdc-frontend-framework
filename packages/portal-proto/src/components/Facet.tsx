import {
  selectCasesFacetByField,
  fetchFacetByName,
  useCoreSelector,
  useCoreDispatch,
} from "@gff/core";
import { useEffect } from "react";

interface FacetProps {
  readonly field: string;
}

export const Facet: React.FC<FacetProps> = ({ field }) => {
  const facet = useCoreSelector((state) =>
    selectCasesFacetByField(state, field)
  );
  console.log(facet);
  const coreDispatch = useCoreDispatch();
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFacetByName(field));
    }
  }, facet);

  if (!facet) {
    return <div>Loading facets...</div>;
  }

  const maxValuesToDisplay = 10;
  const showAll = false;

  return (
    <div className="flex flex-col border-2 p-4 ">
      <div className="font-bold">{field}</div>
      {Object.entries(facet).map(([value, count], i) => {
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
