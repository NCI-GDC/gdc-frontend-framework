import React from "react";
import FilterFacets from "./filters.json";
//import { runproteinpaint } from "@stjude/proteinpaint-client";
import { EnumFacet } from "../facets/EnumFacet";

//const PpLolliplot = runproteinpaint.wrapper.PpLolliplot; console.log(6, PpLolliplot, runproteinpaint)

const ProteinPaintAnalysisTool: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
        {FilterFacets.genes.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              type="genes"
              showPercent={false}
              valueLabel="Genes"
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
              type="ssms"
              showPercent={false}
              valueLabel="Mutations"
              hideIfEmpty={false}
              description={x.description}
            />
          );
        })}
      </div>

      <div className="flex flex-row">
        <div className="mt-12 w-100">test</div>
      </div>
    </div>
  );
};

export default ProteinPaintAnalysisTool;
