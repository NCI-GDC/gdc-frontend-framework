import React from "react";
import { useCoreSelector, Modals, selectCurrentModal } from "@gff/core";
import FilterFacets from "@/features/genomic/filters.json";
import ToggleFacet from "@/features/facets/ToggleFacet";
import partial from "lodash/partial";
import {
  useClearGenomicFilters,
  useGenesFacets,
  useUpdateGenomicEnumFacetFilter,
  useGenomicFilterByName,
  useGenomicFacetFilter,
  useGenesFacetValues,
} from "@/features/genomic/hooks";
import {
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  useTotalCounts,
} from "@/features/facets/hooks";
import EnumFacet from "@/features/facets/EnumFacet";
import SetFacet from "@/features/facets/SetFacet";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";

const GeneAndSSMFilterPanel = ({
  isDemoMode,
}: {
  isDemoMode: boolean;
}): JSX.Element => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const updateFilters = useUpdateGenomicEnumFacetFilter();

  useGenesFacets(
    "genes",
    "explore",
    FilterFacets.filter((f) => f.docType === "genes").map(
      (x) => x.facet_filter,
    ),
    isDemoMode,
  );
  useGenesFacets(
    "ssms",
    "explore",
    FilterFacets.filter((f) => f.docType === "ssms").map((x) => x.facet_filter),
    isDemoMode,
  );

  return (
    <div
      data-testid="filters-facets"
      className="flex flex-col gap-y-4 mt-12 max-h-screen overflow-y-auto border-t-1 border-b-1 rounded-md"
    >
      <GeneSetModal
        opened={modal === Modals.LocalGeneSetModal}
        modalTitle="Filter Mutation Frequency by Mutated Genes"
        inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter Mutation Frequency."
        selectSetInstructions="Select one or more sets below to filter Mutation Frequency."
        updateFilters={updateFilters}
        existingFiltersHook={useGenomicFacetFilter}
      />

      <MutationSetModal
        opened={modal === Modals.LocalMutationSetModal}
        modalTitle="Filter Mutation Frequency by Somatic Mutations"
        inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter Mutation Frequency."
        selectSetInstructions="Select one or more sets below to filter Mutation Frequency."
        updateFilters={updateFilters}
        existingFiltersHook={useGenomicFacetFilter}
      />

      {FilterFacets.map((x, index) => {
        if (x.type == "toggle") {
          return (
            <ToggleFacet
              key={`${x.facet_filter}-${index}`}
              field={`${x.facet_filter}`}
              hooks={{
                useGetFacetData: partial(
                  useGenesFacetValues,
                  x.docType,
                  "explore",
                ),
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useTotalCounts: partial(
                  useTotalCounts,
                  FacetDocTypeToCountsIndexMap[x.docType],
                ),
              }}
              facetName={x.name}
              facetTitle={x.title}
              valueLabel={FacetDocTypeToLabelsMap[x.docType]}
              showPercent={false}
              hideIfEmpty={false}
            />
          );
        } else if (x.type === "set") {
          return (
            <SetFacet
              key={`genes-mutations-app-${x.facet_filter}-${index}`}
              facetName={x.name}
              facetTitle={x.title}
              facetBtnToolTip={x.toolTip}
              field={x.facet_filter}
              valueLabel={FacetDocTypeToLabelsMap[x.docType]}
              hooks={{
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useGetFacetValues: useGenomicFilterByName,
              }}
            />
          );
        }
        return (
          <EnumFacet
            key={`genes-mutations-app-${x.facet_filter}-${index}`}
            field={`${x.facet_filter}`}
            hooks={{
              useGetFacetData: partial(
                useGenesFacetValues,
                x.docType,
                "explore",
              ),
              useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
              useClearFilter: useClearGenomicFilters,
              useTotalCounts: partial(
                useTotalCounts,
                FacetDocTypeToCountsIndexMap[x.docType],
              ),
            }}
            facetName={x.name}
            facetTitle={x.title}
            valueLabel={FacetDocTypeToLabelsMap[x.docType]}
            showPercent={false}
            hideIfEmpty={false}
          />
        );
      })}
    </div>
  );
};
export default GeneAndSSMFilterPanel;
