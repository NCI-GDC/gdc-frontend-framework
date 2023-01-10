import React from "react";
import { useRouter } from "next/router";
import {
  useCoreSelector,
  Modals,
  selectCurrentModal,
  FilterGroup,
} from "@gff/core";
import FilterFacets from "@/features/genomic/filters.json";
import ToggleFacet from "@/features/facets/ToggleFacet";
import partial from "lodash/partial";
import {
  useClearGenomicFilters,
  useGenesFacets,
  useUpdateGenomicEnumFacetFilter,
  useGenomicFilterByName,
  useGenomicFacetFilter,
  useRemoveFilterGroup,
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
import { useAppDispatch, useAppSelector } from "@/features/genomic/appApi";
import { addNewFilterGroups, selectFilterGroups } from "./geneFilterGroupSlice";

const GeneAndSSMFilterPanel = (): JSX.Element => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const updateFilters = useUpdateGenomicEnumFacetFilter();
  const dispatch = useAppDispatch();

  const addNewGenomicFilterGroups = (groups: FilterGroup[]) => {
    dispatch(addNewFilterGroups(groups));
  };
  const useFilterGroups = () =>
    useAppSelector((state) => selectFilterGroups(state));

  const removeFilterGroup = useRemoveFilterGroup();

  // TODO - remove feature flag
  const router = useRouter();
  const { FEATURE_SETS } = router.query;
  if (FEATURE_SETS !== "true") {
    FilterFacets.genes.splice(2);
    FilterFacets.ssms.splice(5);
  }
  useGenesFacets(
    "genes",
    "explore",
    FilterFacets.genes.map((x) => x.facet_filter),
  );
  useGenesFacets(
    "ssms",
    "explore",
    FilterFacets.ssms.map((x) => x.facet_filter),
  );

  return (
    <div className="flex flex-col gap-y-4 mr-3 mt-12 w-min-64 w-max-64">
      {modal === Modals.LocalGeneSetModal && (
        <GeneSetModal
          modalTitle="Filter Mutation Frequency by Genes"
          inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter Mutation Frequency."
          selectSetInstructions="Select one or more sets below to filter Mutation Frequency."
          updateFilters={updateFilters}
          existingFiltersHook={useGenomicFacetFilter}
          addNewFilterGroups={addNewGenomicFilterGroups}
        />
      )}
      {modal === Modals.LocalMutationSetModal && (
        <MutationSetModal
          modalTitle="Filter Mutation Frequency by Mutations"
          inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter Mutation Frequency."
          selectSetInstructions="Select one or more sets below to filter Mutation Frequency."
          updateFilters={updateFilters}
          existingFiltersHook={useGenomicFacetFilter}
          addNewFilterGroups={addNewGenomicFilterGroups}
        />
      )}
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
        } else if (x.type === "set") {
          return (
            <SetFacet
              key={`genes-mutations-app-${x.facet_filter}-${index}`}
              facetName={x.name}
              field={x.facet_filter}
              width="w-64"
              valueLabel={FacetDocTypeToLabelsMap["genes"]}
              hooks={{
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useGetFacetValues: useGenomicFilterByName,
                useFilterGroups: useFilterGroups,
                removeFilterGroup: removeFilterGroup,
              }}
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
        if (x.type === "set") {
          return (
            <SetFacet
              key={`genes-mutations-app-${x.facet_filter}-${index}`}
              facetName={x.name}
              field={x.facet_filter}
              width="w-64"
              valueLabel={FacetDocTypeToLabelsMap["ssms"]}
              hooks={{
                useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
                useClearFilter: useClearGenomicFilters,
                useGetFacetValues: useGenomicFilterByName,
                useFilterGroups: useFilterGroups,
                removeFilterGroup: removeFilterGroup,
              }}
            />
          );
        }
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
