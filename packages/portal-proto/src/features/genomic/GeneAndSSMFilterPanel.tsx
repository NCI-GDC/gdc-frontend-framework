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
  useClearAllGenomicFilters,
} from "@/features/genomic/hooks";
import { FacetDocTypeToLabelsMap } from "@/features/facets/hooks";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import FilterPanel from "@/features/facets/FilterPanel";
import { FacetCardDefinition } from "@gff/portal-components";
import { useAppSelector } from "./appApi";
import { selectFiltersAppliedCount } from "./geneAndSSMFiltersSlice";
import {
  useFieldNameToTitle,
  useFormatValue,
} from "@/features/cohortBuilder/queryExpressionHooks";
import { useSearchEnumTerms } from "../cohortBuilder/hooks";
import {
  useOpenUploadModal,
  useUploadFilterItems,
} from "@/features/genomic/hooks";

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
    FilterFacets.filter((f) => f.queryOptions.docType === "genes").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );
  useGenesFacets(
    "ssms",
    "explore",
    FilterFacets.filter((f) => f.queryOptions.docType === "ssms").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);
  const clearAllFilters = useClearAllGenomicFilters();

  const GenomicFilterHooks = {
    useGetEnumFacetData: useGenesFacetValues,
    useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
    useClearFilter: useClearGenomicFilters,
    useTotalCounts: useTotalGenomicCounts,
    useGetFacetFilters: useGenomicFilterByName,
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
    useFieldNameToTitle,
    useSearchEnumTerms,
    useOpenUploadModal,
    useFilterItems: useUploadFilterItems,
    useFormatValue,
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
        valueLabel={({ docType }: { docType: string }) =>
          FacetDocTypeToLabelsMap[docType]
        }
        app="genes-mutations-app"
        toggleAllFiltersExpanded={toggleAllFiltersExpanded}
        allFiltersCollapsed={allFiltersCollapsed}
        hideIfEmpty={false}
        showPercent={false}
        filtersAppliedCount={filtersAppliedCount}
        handleClearAll={clearAllFilters}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
