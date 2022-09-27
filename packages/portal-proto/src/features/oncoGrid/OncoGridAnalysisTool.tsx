import React from "react";
import FilterFacets from "./filters.json";
import OncoGrid from "./OncoGridWrapper";
import { EnumFacet } from "../facets/EnumFacet";
import {
  useClearGenomicFilters,
  useGenesFacet,
  useUpdateGenomicEnumFacetFilter,
} from "@/features/genomic/hooks";
import { useTotalCounts } from "@/features/facets/hooks";

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
              docType="genes"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              hooks={{
                useGetFacetData: useGenesFacet,
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: useTotalCounts,
              }}
            />
          );
        })}
        {FilterFacets.ssms.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              docType="ssms"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              hooks={{
                useGetFacetData: useGenesFacet,
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: useTotalCounts,
              }}
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
