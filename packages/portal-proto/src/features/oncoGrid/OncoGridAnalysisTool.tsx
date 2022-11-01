import React from "react";
import FilterFacets from "./filters.json";
import OncoGrid from "./OncoGridWrapper";
import EnumFacet from "../facets/EnumFacet";
import ToggleFacet from "@/features/facets/ToggleFacet";
import {
  useClearGenomicFilters,
  useGenesFacet,
  useUpdateGenomicEnumFacetFilter,
} from "@/features/genomic/hooks";
import {
  useTotalCounts,
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
} from "@/features/facets/hooks";
import partial from "lodash/partial";

const OncoGridAnalysisTool: React.FC = () => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
        {FilterFacets.genes.map((x, index) => {
          if (x.type == "toggle") {
            return (
              <ToggleFacet
                key={`${x.facet_filter}-${index}`}
                field={`${x.facet_filter}`}
                hooks={{
                  useGetFacetData: partial(useGenesFacet, "genes", "explore"),
                  useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                  useClearFilter: useClearGenomicFilters,
                  useTotalCounts: partial(
                    useTotalCounts,
                    FacetDocTypeToCountsIndexMap["genes"],
                  ),
                }}
                facetName={x.name}
                valueLabel={FacetDocTypeToLabelsMap["genes"]}
                showPercent={false}
                hideIfEmpty={false}
                description={x.description}
              />
            );
          }
          return (
            <EnumFacet
              key={`onco-grid-app-${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              valueLabel={FacetDocTypeToLabelsMap["genes"]}
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              hooks={{
                useGetFacetData: partial(useGenesFacet, "genes", "explore"),
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: partial(
                  useTotalCounts,
                  FacetDocTypeToCountsIndexMap["genes"],
                ),
              }}
            />
          );
        })}
        {FilterFacets.ssms.map((x, index) => {
          return (
            <EnumFacet
              valueLabel={FacetDocTypeToLabelsMap["ssms"]}
              key={`onco-grid-app-${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              facetName={x.name}
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              hooks={{
                useGetFacetData: partial(useGenesFacet, "ssms", "explore"),
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: partial(
                  useTotalCounts,
                  FacetDocTypeToCountsIndexMap["ssms"],
                ),
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
