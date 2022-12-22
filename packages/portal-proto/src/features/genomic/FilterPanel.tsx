import FilterFacets from "@/features/genomic/filters.json";
import ToggleFacet from "@/features/facets/ToggleFacet";
import partial from "lodash/partial";
import {
  useClearGenomicFilters,
  useGenesFacets,
  useUpdateGenomicEnumFacetFilter,
  useGenesFacetValues,
} from "@/features/genomic/hooks";
import {
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  useTotalCounts,
} from "@/features/facets/hooks";
import EnumFacet from "@/features/facets/EnumFacet";
import React from "react";

const GeneAndSSMFilterPanel = (): JSX.Element => {
  useGenesFacets(
    "genes",
    "explore",
    FilterFacets.genes.map((x) => x.facet_filter),
  );

  return (
    <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
      {FilterFacets.genes.map((x, index) => {
        if (x.type == "toggle") {
          return (
            <ToggleFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              hooks={{
                useGetFacetData: partial(
                  useGenesFacetValues,
                  "genes",
                  "explore",
                ),
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
              width="w-64"
            />
          );
        }
        return (
          <EnumFacet
            key={`genes-mutations-app-${x.facet_filter}-${index}`}
            field={`${x.facet_filter}`}
            hooks={{
              useGetFacetData: partial(useGenesFacetValues, "genes", "explore"),
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
            width="w-64"
          />
        );
      })}
      {FilterFacets.ssms.map((x, index) => {
        return (
          <EnumFacet
            key={`genes-mutations-app-${x.facet_filter}-${index}`}
            field={`${x.facet_filter}`}
            facetName={x.name}
            valueLabel={FacetDocTypeToLabelsMap["ssms"]}
            hooks={{
              useGetFacetData: partial(useGenesFacetValues, "ssms", "explore"),
              useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
              useClearFilter: useClearGenomicFilters,
              useTotalCounts: partial(
                useTotalCounts,
                FacetDocTypeToCountsIndexMap["ssms"],
              ),
            }}
            showPercent={false}
            hideIfEmpty={false}
            width="w-64"
          />
        );
      })}
    </div>
  );
};
export default GeneAndSSMFilterPanel;
