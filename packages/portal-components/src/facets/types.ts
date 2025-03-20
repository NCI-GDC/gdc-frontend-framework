import { Operation } from "@/cohort/QueryExpression/types";
import { DataFetchingResult } from "src/types";

export interface EnumFacetResponse
  extends DataFetchingResult<Record<string, number>> {
  readonly enumFilters?: ReadonlyArray<string>;
}

export type GetEnumFacetDataFunction = (
  field: string,
  queryOptions?: Record<string, string>,
) => EnumFacetResponse;

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

export interface FacetCommonHooks {
  useClearFilter: ClearFacetHook; // clear Facet Filters and remove facet from filter set
  useUpdateFacetFilters: UpdateFacetFilterHook; // updates the filters
  useTotalCounts: GetTotalCountsFunction; // get the totals count by type: cases, files, genes, ssms, projects
  useToggleExpandFilter?: () => (field: string, expanded: boolean) => void;
  useFilterExpanded?: (field: string) => boolean;
  useFieldNameToTitle: () => (field: string, sections?: number) => string;
}

export type FacetRequiredHooks = EnumFacetHooks;

export interface FacetCardProps<T extends FacetCommonHooks> {
  readonly field: string;
  readonly hooks: T;
  readonly valueLabel: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly facetTitle?: string;
  readonly facetBtnToolTip?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly isFacetView?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly width?: string;
  readonly dismissCallback?: (field: string) => void;
  readonly variant?: "default" | "summary";
  readonly Chart?: React.FC<any>;
  readonly queryOptions?: Record<string, string>;
  readonly cardScrollMargin?: number;
}

export interface AllowableRange {
  readonly minimum: number;
  readonly maximum: number;
}

export interface FacetDefinition {
  readonly description: string; //description from _mapping
  readonly field: string; // name of field minus "case", "file"
  readonly full: string; //  full name of filter (e.g. prepended with case.)
  readonly type: string; // type from mapping
  readonly facet_type?: string; // classified type based on type + name: e.g. age, year, enumeration, etc
  readonly range?: AllowableRange; // range of value types
  readonly hasData?: boolean;
  readonly title?: string;
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
  name?: string;
  toolTip?: string;
  uploadLabel?: string;
};
