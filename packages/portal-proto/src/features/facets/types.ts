import { GQLDocType, GQLIndexType } from "@gff/core";

export interface FacetCardProps {
  readonly field: string;
  readonly docType: GQLDocType;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
  readonly indexType?: GQLIndexType;
  readonly width?: string;
  readonly dismissCallback?: (string) => void;
}
