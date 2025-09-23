import { FacetDefinitionType, GQLDocType } from "@gff/core";

export type FacetQueryOptions = {
  readonly docType: GQLDocType;
  readonly facetType?: FacetDefinitionType;
};

export interface CustomConfig {
  readonly usedFacets: readonly string[];
  readonly handleRemoveFilter: (filter: string) => void;
  readonly handleCustomFilterSelected: (filter: string) => void;
  readonly handleResetCustomFilters: () => void;
  readonly defaultFilters: string[];
}
