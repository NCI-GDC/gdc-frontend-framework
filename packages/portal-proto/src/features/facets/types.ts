import { FacetDefinitionType, GQLDocType, GQLIndexType } from "@gff/core";

export interface FacetQueryOptions {
  readonly docType?: GQLDocType;
  readonly indexType?: GQLIndexType;
  readonly facetType: FacetDefinitionType;
}
