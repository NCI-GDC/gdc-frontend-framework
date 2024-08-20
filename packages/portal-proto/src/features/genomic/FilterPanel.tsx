import React from "react";
import { useCoreSelector, Modals, selectCurrentModal } from "@gff/core";
import FilterFacets from "@/features/genomic/filters.json";
import {
  useClearGenomicFilters,
  useGenesFacets,
  useUpdateGenomicEnumFacetFilter,
  useGenomicFilterByName,
  useGenomicFacetFilter,
  useGenesFacetValues,
  useAllFiltersCollapsed,
  useToggleAllFilters,
  useToggleExpandFilter,
  useFilterExpandedState,
  useTotalGenomicCounts,
} from "@/features/genomic/hooks";
import { FacetDocTypeToLabelsMap } from "@/features/facets/hooks";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import FilterPanel from "@/features/facets/FilterPanel";
import { FacetCardDefinition } from "../facets/types";

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
    FilterFacets.filter((f) => f.doc_type === "genes").map((x) => x.full),
    isDemoMode,
  );
  useGenesFacets(
    "ssms",
    "explore",
    FilterFacets.filter((f) => f.doc_type === "ssms").map((x) => x.full),
    isDemoMode,
  );

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllFilters();

  const GenomicFilterHooks = {
    useGetEnumFacetData: useGenesFacetValues,
    useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
    useClearFilter: useClearGenomicFilters,
    useTotalCounts: useTotalGenomicCounts,
    useGetFacetValues: useGenomicFilterByName,
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
  };

  return (
    <>
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
      <FilterPanel
        facetDefinitions={FilterFacets as FacetCardDefinition[]}
        facetHooks={GenomicFilterHooks}
        valueLabel={(x: FacetCardDefinition) =>
          FacetDocTypeToLabelsMap[x.doc_type]
        }
        app="genes-mutations-app"
        toggleAllFiltersExpanded={toggleAllFiltersExpanded}
        allFiltersCollapsed={allFiltersCollapsed}
        hideIfEmpty={false}
        showPercent={false}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
