import React from "react";
import FilterFacets from "./filters.json";
import OncoGrid from "./OncoGridWrapper";
import { EnumFacet } from "../facets/EnumFacet";

const OncoGridAnalysisTool: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
        {FilterFacets.genes.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              itemType="genes"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
            />
          );
        })}
        {FilterFacets.ssms.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              itemType="ssms"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
            />
          );
        })}
      </div>
      <div className="mt-12 w-100">
        <OncoGrid />
      </div>
    </div>
  );
};

export default OncoGridAnalysisTool;
