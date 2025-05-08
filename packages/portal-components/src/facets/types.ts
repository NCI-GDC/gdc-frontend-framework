import { Cohort } from "@/cohort/types";
import { Operation, NumericFromTo } from "@/cohort/QueryExpression/types";
import { DataFetchingResult } from "src/types";

export type QueryOptions = Record<string, unknown>;

export type GetEnumFacetDataFunction = (
  field: string,
  queryOptions?: QueryOptions,
) => DataFetchingResult<Record<string, number>>;

export type GetRangeFacetDataFunction = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
  queryOptions?: QueryOptions,
) => DataFetchingResult<Record<string, number>>;

export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type UpdateFacetFilterHook = () => UpdateFacetFilterFunction;
export type ClearFacetFunction = (field: string) => void;
export type ClearFacetHook = () => ClearFacetFunction;
export type GetTotalCountsFunction = (queryOptions?: QueryOptions) => number;

export type EnumFacetHooks = FacetCommonHooks & {
  /**
   * Hook that returns the values and counts for the enum facet type
   */
  useGetEnumFacetData: GetEnumFacetDataFunction;
  /**
   * Hook that takes the enum data and a search term and returns filtered data. If not provided, the search icon won't appear on cards.
   */
  useSearchEnumTerms: (
    enumData: [string, number][],
    searchTerm: string,
  ) => [string, number][];
  /**
   * Hook that returns the currently selected filters
   */
  useGetFacetFilters: SelectFacetFilterFunction;
};

export type ToggleFacetHooks = FacetCommonHooks & {
  /**
   * Hook that returns the values and counts for the enum facet type
   */
  useGetEnumFacetData: GetEnumFacetDataFunction;
  /**
   * Hook that returns the currently selected filters
   */
  useGetFacetFilters: (field: string) => Operation;
};

export type ValueFacetHooks = FacetCommonHooks & {
  /**
   * Hook that returns the currently selected filters
   */
  useGetFacetFilters: SelectFacetFilterFunction;
};

export type RangeFacetHooks = FacetCommonHooks & {
  /**
   * Hook that returns range values and counts
   */
  useGetRangeFacetData: GetRangeFacetDataFunction;
  /**
   * Hook that returns the currently selected filters
   */
  useGetFacetFilters: SelectFacetFilterFunction;
};

export type UploadFacetHooks = FacetCommonHooks & {
  /**
   * Hook that returns a list of the uploaded items
   */
  useFilterItems: (field: string) => {
    noData: boolean;
    items: readonly (string | number)[];
  };
  /**
   * Hook that opens the upload modal
   */
  useOpenUploadModal: () => (field: string) => void;
  /**
   * Hook that returns formatted label for the filter badge
   */
  useFormatValue: () => (value: string, field: string) => Promise<string>;
  /**
   * Optional hook that returns the current cohort, used for managing collapse/expand filter state
   */
  useSelectCurrentCohort?: () => Cohort;
};

export interface FacetCommonHooks {
  /**
   * Hook to clear facet card selections and remove from filters
   */
  useClearFilter: ClearFacetHook;
  /**
   * Hook to update filters with the facet card selections
   */
  useUpdateFacetFilters: UpdateFacetFilterHook;
  /**
   * Hook that returns the total count, used for calculating percentage
   */
  useTotalCounts: GetTotalCountsFunction;
  /**
   * Hook that takes the API field and returns a human readable field name
   */
  useFieldNameToTitle: () => (field: string, sections?: number) => string;
  /**
   * Hook for toggling the expand/collapse state of the facet card
   */
  useToggleExpandFilter?: () => (field: string, expanded: boolean) => void;
  /**
   * Hook that returns the expand/collapse state of the facet card
   */
  useFilterExpanded?: (field: string) => boolean;
  /**
   * Hook for prefetching the facet data for a group of facets
   */
  usePopulateFacetData?: (
    facets: FacetCardDefinition[],
    queryOptions?: QueryOptions,
  ) => void;
}

export interface CustomFacetHooks {
  /**
   * Hook that returns a list of a user's currently selected custom facets
   */
  readonly useCustomFacets: () => DataFetchingResult<FacetCardDefinition[]>;
  /**
   * Hook that returns facets available for a user to add to their custom facets, option to return only facets
   * with data
   */
  readonly useAvailableCustomFacets: (
    usedFacets: readonly string[],
    onlyFiltersWithValues: boolean,
    queryOptions?: QueryOptions,
  ) => {
    data: Record<string, FacetCardDefinition>;
  };
  /**
   * Hook to add a custom filter to a user's panel
   */
  readonly useAddCustomFilter: () => (filter: string) => void;
  /**
   * Hook to remove a custom filter to a user's panel
   */
  readonly useRemoveCustomFilter: () => (filter: string) => void;
}

export type FacetRequiredHooks =
  | EnumFacetHooks
  | ToggleFacetHooks
  | ValueFacetHooks
  | RangeFacetHooks
  | UploadFacetHooks;

export interface EnumChartProps {
  readonly field: string;
  readonly data: Record<string, number>;
  readonly selectedEnums: readonly string[];
  readonly isSuccess: boolean;
  readonly showTitle: boolean;
  readonly maxBins: number;
  readonly height: number;
  readonly valueLabel?: string;
}

export interface FacetCardProps<T extends FacetCommonHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly facetName: string;
  readonly valueLabel?: string;
  readonly description?: string;
  readonly showCount?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly dismissCallback?: (field: string) => void;
  readonly Chart?: React.FC<EnumChartProps>;
  readonly queryOptions?: QueryOptions;
  readonly cardScrollMargin?: number;
}

export type EnumFacetCardProps = FacetCardProps<EnumFacetHooks> & {
  readonly variant?: "default" | "summary";
};

export type UploadFacetCardProps = Pick<
  FacetCardProps<UploadFacetHooks>,
  "field" | "hooks" | "facetName" | "cardScrollMargin"
> & {
  readonly uploadLabel?: string;
  readonly facetBtnToolTip?: string;
};

export type NumericFacetCardProps = FacetCardProps<RangeFacetHooks> & {
  readonly rangeDatatype?: string;
  readonly minimum: number | undefined;
  readonly maximum: number | undefined;
  readonly clearValues?: boolean;
};

export type RangeFromOp = ">" | ">=";
export type RangeToOp = "<" | "<=";

export interface FromToRangeValues<T> {
  readonly from?: T;
  readonly to?: T;
}

export interface FromToRange<T> extends FromToRangeValues<T> {
  readonly fromOp?: RangeFromOp;
  readonly toOp?: RangeToOp;
}

export interface StringRange {
  readonly fromOp?: RangeFromOp;
  readonly from?: string;
  readonly toOp?: RangeToOp;
  readonly to?: string;
}

/**
 * Represent a range. Used to configure a row
 * of a range list.
 */
export interface RangeBucketElement {
  readonly from: number;
  readonly to: number;
  readonly key: string; // key for facet range
  readonly label: string; // label for value
  readonly valueLabel?: string; // string representation of the count
  readonly value?: number; // count of items in range
}

export interface AllowableRange {
  readonly minimum: number;
  readonly maximum: number;
}

export interface CohortBuilderCategoryConfig {
  readonly label: string;
  readonly facets: ReadonlyArray<string>;
  readonly queryOptions?: QueryOptions;
}

export interface SortType {
  readonly type: "value" | "alpha";
  readonly direction: "asc" | "dsc";
}

export type FacetCardDefinition = {
  /**
   * field name in the API
   */
  readonly field: string;
  /**
   * description of field
   */
  readonly description?: string;
  /**
   * classified type based on type + name: e.g. age, year, enumeration, etc
   */
  readonly facet_type?: string;
  /**
   * specific field for numeric range facets, specifies the min/max bounds of the values
   */
  readonly range?: AllowableRange;
  /**
   * human readable name, if not supplied will use facetNameFormatter
   */
  readonly name?: string;
  /**
   * specifc field for upload facet, toolip for upload button
   */
  readonly toolTip?: string;
  /**
   * specific field for upload facet, upload button label
   */
  readonly uploadLabel?: string;
  /**
   *  info to pass back to data fetching hooks about this facet
   */
  readonly queryOptions?: QueryOptions;
};
