import { GQLIndexType } from "@gff/core";

export interface FacetCardProps {
  readonly field: string;
  readonly docType: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly indexType?: GQLIndexType;
}
