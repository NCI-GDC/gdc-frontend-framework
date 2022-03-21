
export interface EnumFacetProps {
  readonly field: string;
  readonly type: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?:boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly valueLabel?: string;
  readonly hideIfEmpty?: boolean;
}
