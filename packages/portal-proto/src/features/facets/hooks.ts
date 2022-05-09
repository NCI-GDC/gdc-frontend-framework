import {
  Operation,
  EnumValueExtractorHandler,
  EnumOperandValue,
  OperandValue,
  CoreDispatch,
  FacetBuckets,
  handleOperation,
  fetchCaseFacetByName,
  fetchFileFacetByName,
  fetchGenesFacetByName,
  fetchMutationsFacetByName,
  FilterSet,
  removeCohortFilter,
  removeGenomicFilter,
  selectCaseFacetByField,
  selectCurrentCohortFilters,
  selectCurrentCohortFiltersByName,
  selectFilesFacetByField,
  selectGenesFacetByField,
  selectMutationsFacetByField,
  updateCohortFilter,
  updateGenomicFilter,
  useCoreDispatch,
  useCoreSelector,
  selectGenomicFilters,
  selectGenomicFiltersByName,
} from "@gff/core";
import { useEffect } from "react";

/**
 * Filter selector for all of the facet filters
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
  readonly enumFilters?: EnumOperandValue;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

/**
 * Case Facet Selector using GQL
 */
const useCasesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectCaseFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`cases.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchCaseFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchCaseFacetByName(field));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters as EnumOperandValue,
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
    selectFilesFacetByField(state, field),
  );

  const selectFacetFilter = useCohortFacetFilter();
  const enumFilters = useCohortFacetFilterByName(`files.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchFileFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    coreDispatch(fetchFileFacetByName(field));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFacetFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters as EnumOperandValue,
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
const useGenesFacet = (field: string): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectGenesFacetByField(state, field),
  );

  const selectFacetFilter = useGenomicFacetFilter();
  const selectCohortFilter = useCohortFacetFilter();
  const enumFilters = useGenomicFilterByName(`genes.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchGenesFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    if (facet) {
      coreDispatch(fetchGenesFacetByName(field));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFacetFilter, selectCohortFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters as EnumOperandValue,
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
    selectMutationsFacetByField(state, field),
  );

  const selectFacetFilter = useGenomicFacetFilter();
  const selectCohortFilter = useCohortFacetFilter();
  const enumFilters = useGenomicFilterByName(`ssms.${field}`);
  useEffect(() => {
    if (!facet) {
      coreDispatch(fetchMutationsFacetByName(field));
    }
  }, [coreDispatch, facet, field]);

  useEffect(() => {
    if (facet) {
      coreDispatch(fetchMutationsFacetByName(field));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFacetFilter, selectCohortFilter]);

  return {
    data: facet?.buckets,
    enumFilters: enumFilters as EnumOperandValue,
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
 * Adds a enumeration filter to cohort filters
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
  files: useFilesFacet,
  genes: useGenesFacet,
  ssms: useMutationsFacet,
};

export const countMapping = {
  cases: "caseCounts",
  files: "fileCounts",
  genes: "geneCounts",
  ssms: "mutationCounts",
};
