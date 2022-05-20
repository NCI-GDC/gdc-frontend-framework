export type FacetItemType = "cases" | "files" | "genes" | "ssms";

export interface FacetCardProps {
  readonly field: string;
  readonly itemType: FacetItemType;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?: boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly hideIfEmpty?: boolean;
}
