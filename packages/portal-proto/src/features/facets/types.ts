import { FacetDefinitionType, GQLDocType, GQLIndexType } from "@gff/core";

export type FacetQueryOptions = {
  readonly docType?: GQLDocType;
  readonly indexType?: GQLIndexType;
  readonly facetType?: FacetDefinitionType;
};

export interface CustomConfig {
  readonly usedFacets: readonly string[];
  readonly handleRemoveFilter: (filter: string) => void;
  readonly handleCustomFilterSelected: (filter: string) => void;
  readonly handleResetCustomFilters: () => void;
  readonly defaultFilters: string[];
  readonly queryOptions?: FacetQueryOptions;
}
