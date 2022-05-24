import {
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  CoreDispatch,
  FacetBuckets,
  handleOperation,
  FilterSet,
  removeCohortFilter,
  removeGenomicFilter,
  selectCaseFacetByField,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  selectFileFacetByField,
  selectGenesFacetByField,
  selectSSMSFacetByField,
  fetchFacetByNameGQL,
  updateCohortFilter,
  updateGenomicFilter,
  useCoreDispatch,
  useCoreSelector,
  selectGenomicFilters,
  selectGenomicFiltersByName,
  GQLQueryItem,
  GQLIndexType,
} from "@gff/core";
import { useEffect } from "react";

/**
 * Filter selector for all the facet filters
 */
const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

const useGenomicFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectGenomicFilters(state));
};

export const extractValue = (op: Operation): EnumOperandValue => {
  const handler = new EnumValueExtractorHandler();
  return handleOperation<EnumOperandValue>(handler, op);
};

/**
 * Selector for the facet values from the current cohort (if any)
 * @param field
 */
const useCohortFacetFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

const useGenomicFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useCoreSelector((state) =>
    selectGenomicFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

interface EnumFacetResponse {
  readonly data?: Record<string, number>;
  readonly enumFilters?: ReadonlyArray<string>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

/**
 *  Facet Selector using GQL which will refresh when filters/enum values changes.02
 */
const useCasesFacet = (
  field: string,
  itemType: GQLQueryItem,
  indexType: GQLIndexType,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCaseFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`${field}`);
  // useEffect(() => {
  //   if (!facet) {
  //     coreDispatch(fetchFacetByNameGQL({field:field, itemType:"cases"}));
  //   }
  // }, [coreDispatch, facet, field, selectFacetFilter]);

  useEffect(() => {
    coreDispatch(
      fetchFacetByNameGQL({
        field: field,
        itemType: itemType,
        index: indexType,
      }),
    );
  }, [coreDispatch, field, indexType, itemType, selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: (enumFilters as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * File Facet Selector using GQL
 */
const useFilesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFileFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`files.${field}`);
  // useEffect(() => {
  //   if (!facet) {
  //     coreDispatch(fetchFacetByNameGQL({ field: field, itemType: "files" }));
  //   }
  // }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFacetByNameGQL({ field: field, itemType: "files" }));
  }, [coreDispatch, field, selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: (enumFilters as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * Genes Facet Selector using GQL
 */
const useGenesFacet = (
  field: string,
  itemType = "genes" as GQLQueryItem,
  indexType = "explore" as GQLIndexType,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectGenesFacetByField(state, field),
  );

  const genomicFilters = useGenomicFacetFilter();
  const cohortFilters = useCohortFacetFilter();
  const enumFilters = useGenomicFilterByName(`genes.${field}`);
  // useEffect(() => {
  //   if (!facet) {
  //     coreDispatch(fetchFacetByNameGQL({ field: field, itemType: "genes" }));
  //   }
  // }, [coreDispatch, facet, field]);

  useEffect(() => {
    console.log("useGenesFacet:", field, cohortFilters);
    coreDispatch(
      fetchFacetByNameGQL({
        field: field,
        itemType: itemType,
        index: indexType,
      }),
    );
  }, [coreDispatch, field, cohortFilters]);

  return {
    data: facet?.buckets,
    enumFilters: (enumFilters as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

/**
 * Mutations Facet Selector using GQL
 */
const useMutationsFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectSSMSFacetByField(state, field),
  );

  const selectFacetFilter = useGenomicFacetFilter();
  const selectCohortFilter = useCohortFacetFilter();
  const enumFilters = useGenomicFilterByName(`ssms.${field}`);
  // useEffect(() => {
  //   if (!facet) {
  //     coreDispatch(fetchFacetByNameGQL({ field: field, itemType: "ssms" }));
  //   }
  // }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFacetByNameGQL({ field: field, itemType: "ssms" }));
  }, [coreDispatch, field, selectCohortFilter]);

  return {
    data: facet?.buckets,
    enumFilters: (enumFilters as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

type updateEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix?: string,
) => void;
/**
 * Adds an enumeration filter to cohort filters
 * @param dispatch CoreDispatch instance
 * @param enumerationFilters values to update
 * @param field field to update
 * @param prefix optional prefix for fields
 */
export const updateEnumFilters: updateEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix = "",
) => {
  if (enumerationFilters === undefined) return;
  if (enumerationFilters.length > 0) {
    dispatch(
      updateCohortFilter({
        field: `${prefix}${field}`,
        operation: {
          operator: "includes",
          field: `${prefix}${field}`,
          operands: enumerationFilters,
        },
      }),
    );
  } else {
    // completely remove the field
    dispatch(removeCohortFilter(`${prefix}${field}`));
  }
};

type updateGenomicEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix?: string,
) => void;

export const updateGenomicEnumFilters: updateGenomicEnumFiltersFunc = (
  dispatch: CoreDispatch,
  enumerationFilters: EnumOperandValue,
  field: string,
  prefix = "",
) => {
  if (enumerationFilters === undefined) return;
  if (enumerationFilters.length > 0) {
    dispatch(
      updateGenomicFilter({
        field: `${prefix}${field}`,
        operation: {
          operator: "includes",
          field: `${prefix}${field}`,
          operands: enumerationFilters,
        },
      }),
    );
  } else {
    // completely remove the field
    dispatch(removeGenomicFilter(`${prefix}${field}`));
  }
};

export const UpdateEnums = {
  cases: updateEnumFilters,
  files: updateEnumFilters,
  genes: updateGenomicEnumFilters,
  ssms: updateGenomicEnumFilters,
};

export const FacetEnumHooks = {
  cases: useCasesFacet,
  files: useCasesFacet,
  genes: useGenesFacet,
  ssms: useGenesFacet,
};

export const FacetItemTypeToCountsIndexMap = {
  cases: "caseCounts",
  files: "fileCounts",
  genes: "genesCounts",
  ssms: "mutationCounts",
};

export const FacetItemTypeToLabelsMap = {
  cases: "Cases",
  files: "Files",
  genes: "Genes",
  ssms: "Mutations",
};
