import { FacetDefinitionType, GQLDocType, GQLIndexType } from "@gff/core";

export type FacetQueryOptions = {
  readonly docType?: GQLDocType;
  readonly indexType?: GQLIndexType;
  readonly facetType?: FacetDefinitionType;
};
