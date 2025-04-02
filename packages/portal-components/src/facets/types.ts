import {
  Operation,
  NumericFromTo,
  QueryExpressionHooks,
} from "@/cohort/QueryExpression/types";
import { DataFetchingResult } from "src/types";

export interface EnumFacetResponse
  extends DataFetchingResult<Record<string, number>> {
  readonly enumFilters?: ReadonlyArray<string>;
}

export type GetEnumFacetDataFunction = (
  field: string,
  queryOptions?: Record<string, string>,
) => EnumFacetResponse;

export type GetRangeFacetDataFunction = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
  queryOptions?: Record<string, string>,
) => DataFetchingResult<Record<string, number>>;

export type SelectFacetFilterFunction = (field: string) => Operation;
export type UpdateFacetFilterFunction = (field: string, op: Operation) => void;
export type UpdateFacetFilterHook = () => UpdateFacetFilterFunction;
export type ClearFacetFunction = (field: string) => void;
export type ClearFacetHook = () => ClearFacetFunction;
export type GetTotalCountsFunction = (
  queryOptions?: Record<string, string>,
) => number;

export type EnumFacetHooks = FacetCommonHooks & {
  useGetEnumFacetData: GetEnumFacetDataFunction; // gets data for EnumFacets and ToggleFacet
  useSearchEnumTerms: (
    enumData: [string, number][],
    searchTerm: string,
  ) => [string, number][];
};

export type ValueFacetHooks = FacetCommonHooks & {
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
};

export type RangeFacetHooks = FacetCommonHooks & {
  useGetRangeFacetData: GetRangeFacetDataFunction; // gets the data for Range Facets
  useGetFacetFilters: SelectFacetFilterFunction; // gets the current filters
};

export type UploadFacetHooks = FacetCommonHooks & {
  useFilterItems: (field: string) => {
    noData: boolean;
    items: readonly (string | number)[];
  };
  useOpenUploadModal: () => (field: string) => void;
};

export interface FacetCommonHooks {
  useClearFilter: ClearFacetHook; // clear Facet Filters and remove facet from filter set
  useUpdateFacetFilters: UpdateFacetFilterHook; // updates the filters
  useTotalCounts: GetTotalCountsFunction; // get the totals count by type: cases, files, genes, ssms, projects
  useToggleExpandFilter?: () => (field: string, expanded: boolean) => void;
  useFilterExpanded?: (field: string) => boolean;
  useFieldNameToTitle: () => (field: string, sections?: number) => string;
  usePopulateFacetData?: (
    facets: FacetDefinition[],
    queryOptions?: Record<string, string>,
  ) => void;
}

export interface CustomFacetHooks {
  readonly useCustomFacets: () => DataFetchingResult<FacetDefinition[]>;
  readonly useAvailableCustomFacets: (onlyFiltersWithValues: boolean) => {
    data: Record<string, FacetDefinition>;
  };
  readonly useAddCustomFilter: () => (filter: string) => void;
  readonly useRemoveCustomFilter: () => (filter: string) => void;
}

export type FacetRequiredHooks =
  | EnumFacetHooks
  | ValueFacetHooks
  | RangeFacetHooks
  | UploadFacetHooks;

export interface EnumChartProps {
  readonly field: string;
  readonly data: Record<string, number>;
  readonly selectedEnums: readonly string[];
  readonly isSuccess: boolean;
  readonly showTitle: boolean;
  readonly valueLabel: string;
  readonly maxBins: number;
  readonly height: number;
}

export interface FacetCardProps<T extends FacetCommonHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly valueLabel: string;
  readonly facetName: string;
  readonly description?: string;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly dismissCallback?: (field: string) => void;
  readonly Chart?: React.FC<EnumChartProps>;
  readonly queryOptions?: Record<string, string>;
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
  readonly queryExpressionHooks: QueryExpressionHooks;
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

export interface FacetDefinition {
  readonly description?: string; //description of field
  readonly field: string; // name of field
  readonly facet_type?: string; // classified type based on type + name: e.g. age, year, enumeration, etc
  readonly range?: AllowableRange; // range of value types
}

export interface CohortBuilderCategoryConfig {
  readonly label: string;
  readonly facets: ReadonlyArray<string>;
  readonly queryOptions?: Record<string, string>;
}

export interface SortType {
  type: "value" | "alpha";
  direction: "asc" | "dsc";
}

export type FacetCardDefinition = FacetDefinition & {
  readonly name?: string;
  readonly toolTip?: string;
  readonly uploadLabel?: string;
};
