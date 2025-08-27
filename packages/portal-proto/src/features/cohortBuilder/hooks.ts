import { useState, useEffect } from "react";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { flatten } from "lodash";
import MiniSearch from "minisearch";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
  buildGqlOperationToFilterSet,
  setActiveCohortList,
  Cohort,
  removeCohort,
  NullCountsData,
  useFacetDictionary,
  selectFacetDefinitionsByName,
  selectCohortBuilderConfigCategory,
  selectUsefulFacets,
  fetchFacetsWithValues,
  FacetDefinition,
  GQLDocType,
  GQLIndexType,
  addFilterToCohortBuilder,
  removeFilterFromCohortBuilder,
  Modals,
  showModal,
  Includes,
  FacetDefinitionType,
} from "@gff/core";
import { FacetCardDefinition } from "@gff/portal-components";
import { useEnumFacets } from "@/features/facets/hooks";
import { STOP_WORDS, TOKENIZE_STRING } from "./dictionary";
import { useCohortFacetFilters } from "./utils";
import { FacetQueryOptions } from "../facets/types";

export const useSetupInitialCohorts = (): boolean => {
  const [fetched, setFetched] = useState(false);
  const {
    data: cohortsListData,
    isSuccess,
    isError,
  } = useGetCohortsByContextIdQuery(null, { skip: fetched });

  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const updatedCohortIds = (cohortsListData || []).map((cohort) => cohort.id);
  const outdatedCohortsIds = cohorts
    .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
    .map((c) => c.id);

  useDeepCompareEffect(() => {
    if ((isSuccess || isError) && !fetched) {
      const updatedList: Cohort[] = (cohortsListData || []).map((data) => {
        const existingCohort = cohorts.find((c) => c.id === data.id);
        return existingCohort?.modified
          ? existingCohort
          : {
              id: data.id,
              name: data.name,
              filters: buildGqlOperationToFilterSet(data.filters),
              caseSet: {
                ...(existingCohort?.caseSet ?? { status: "uninitialized" }),
              },
              counts: {
                ...NullCountsData,
              },
              modified_datetime: data.modified_datetime,
              saved: true,
              modified: false,
            };
      });

      coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      // A saved cohort that's not present in the API response has been deleted in another session
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ id }));
      }

      setFetched(true);
    }
  }, [
    cohortsListData,
    isSuccess,
    isError,
    cohorts,
    fetched,
    setFetched,
    coreDispatch,
    outdatedCohortsIds,
  ]);

  return fetched;
};

export const usePopulateFacetData = (
  facets: FacetDefinition[],
  queryOptions: { indexType: GQLIndexType; docType: GQLDocType },
) => {
  const enumFacets = facets.filter((x) => x.facet_type === "enum");
  useEnumFacets(
    enumFacets.map((entry) => entry.full),
    queryOptions,
  );
};

export const useCustomFacets = () => {
  const customConfig = useCoreSelector((state) =>
    selectCohortBuilderConfigCategory(state, "custom"),
  );

  const [customFacetDefinitions, setCustomFacetDefinitions] = useState<
    ReadonlyArray<FacetDefinition>
  >([]);
  const { isSuccess } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, customConfig.facets),
  );

  useDeepCompareEffect(() => {
    if (isSuccess) {
      setCustomFacetDefinitions(facets.map((f) => ({ ...f, field: f.full })));
    }
  }, [facets, isSuccess]);

  return { data: customFacetDefinitions, isSuccess };
};

export const useAvailableCustomFacets = (
  usedFacets: ReadonlyArray<string>,
  onlyFiltersWithValues: boolean,
  queryOptions?: FacetQueryOptions,
) => {
  // get the current list of cohort filters
  const { data: dictionaryData, isSuccess: isDictionaryReady } =
    useFacetDictionary();

  const { facetType = "cases" } = queryOptions;

  const [availableFacets, setAvailableFacets] = useState<
    Record<string, FacetCardDefinition> | undefined
  >(undefined); // Facets that are current not used
  const [currentFacets, setCurrentFacets] = useState(undefined); // current set of Facets

  const { data: usefulFacets, status: usefulFacetsStatus } = useCoreSelector(
    (state) => selectUsefulFacets(state, facetType as FacetDefinitionType),
  );
  const coreDispatch = useCoreDispatch();

  // select facets with values if not already requested
  useEffect(() => {
    if (
      onlyFiltersWithValues &&
      usefulFacetsStatus == "uninitialized" &&
      isDictionaryReady
    ) {
      coreDispatch(fetchFacetsWithValues(facetType as FacetDefinitionType));
    }
  }, [
    coreDispatch,
    isDictionaryReady,
    onlyFiltersWithValues,
    usefulFacetsStatus,
    facetType,
  ]);

  // if data changes or the current facetSet changes rebuild the
  // available facet list
  useDeepCompareEffect(() => {
    if (isDictionaryReady) {
      // build the list of filters that are not currently used
      const unusedFacets = Object.values(dictionaryData)
        .filter((x: FacetDefinition) => {
          return x.full.startsWith(facetType);
        })
        .filter((x: FacetDefinition) => {
          return !usedFacets.includes(x.full);
        })
        .map((x: FacetDefinition) => ({ ...x, name: x.field, field: x.full }))
        .reduce(
          (
            res: Record<string, FacetCardDefinition>,
            value: FacetCardDefinition,
          ) => {
            return { ...res, [value.field]: value };
          },
          {},
        );
      setAvailableFacets(unusedFacets);
    }
  }, [
    usedFacets,
    isDictionaryReady,
    onlyFiltersWithValues,
    usefulFacetsStatus,
    usefulFacets,
    dictionaryData,
    queryOptions,
    facetType,
  ]);

  useEffect(() => {
    if (onlyFiltersWithValues && availableFacets && usefulFacets) {
      if (usefulFacetsStatus == "fulfilled") {
        const filteredFacets = Object.values(availableFacets).filter((facet) =>
          usefulFacets.includes(facet.name),
        );

        const filters = filteredFacets.reduce((acc, facet) => {
          acc[facet.field] = facet;
          return acc;
        }, {});

        setCurrentFacets(filters);
      } else {
        setCurrentFacets(undefined);
      }
    } else {
      // use all un-used filters (not assigned to Cohort Builder or Download)
      setCurrentFacets(availableFacets);
    }
  }, [
    availableFacets,
    onlyFiltersWithValues,
    usefulFacetsStatus,
    usefulFacets,
  ]);

  return { data: currentFacets };
};

export const useAddCustomFilter = () => {
  const coreDispatch = useCoreDispatch();

  const addCustomFilter = (filter: string) => {
    coreDispatch(addFilterToCohortBuilder({ facetName: filter }));
  };

  return addCustomFilter;
};

export const useRemoveCustomFilter = () => {
  const coreDispatch = useCoreDispatch();

  const removeCustomFilter = (filter: string) => {
    coreDispatch(removeFilterFromCohortBuilder({ facetName: filter }));
  };

  return removeCustomFilter;
};

interface FacetResultDoc {
  enum: string;
  count: number;
}

export const miniSearch = new MiniSearch<FacetResultDoc>({
  fields: ["enum"],
  storeFields: ["enum", "count"],
  tokenize: (string) => string.split(TOKENIZE_STRING), // indexing tokenizer
  processTerm: (term) => (STOP_WORDS.has(term) ? null : term.toLowerCase()), // index term processing
});

export const useSearchEnumTerms = (
  enumData: [string, number][],
  searchTerm: string,
) => {
  miniSearch.removeAll();

  const searchDocuments = enumData.map((entry) => ({
    id: entry[0],
    enum: entry[0],
    count: entry[1],
  }));

  miniSearch.addAll(searchDocuments);

  const results = miniSearch.search(searchTerm, {
    prefix: true,
    combineWith: "OR",
  });

  const terms = flatten(results.map((r) => r.terms));
  return enumData.filter((d) =>
    terms.some((t) => d[0].toLowerCase().includes(t)),
  );
};

export const useOpenUploadModal = () => {
  const coreDispatch = useCoreDispatch();

  const openUploadModal = (field: string) => {
    if (field === "cases.upload.case_id") {
      coreDispatch(showModal({ modal: Modals.GlobalCaseSetModal }));
    } else if (field === "genes.upload.gene_id") {
      coreDispatch(showModal({ modal: Modals.GlobalGeneSetModal }));
    } else if (field === "ssms.upload.ssm_id") {
      coreDispatch(showModal({ modal: Modals.GlobalMutationSetModal }));
    }
  };

  return openUploadModal;
};

export const useUploadFilterItems = (uploadField: string) => {
  const filters = useCohortFacetFilters();
  const noData = Object.keys(filters?.root || {}).length === 0;

  const items = useDeepCompareMemo(() => {
    if (noData) return [];

    const includeFilters = Object.values(
      filters.root as Record<string, Includes>,
    );

    const field = uploadField.split(".upload").join("");
    return includeFilters.find((f) => f.field === field)?.operands || [];
  }, [filters, uploadField, noData]);

  return { noData, items };
};
