import { TablePageOffsetProps } from "../gdcapi/gdcgraphql";
import { FilterSet } from "../cohort";

export interface GenomicTableProps extends TablePageOffsetProps {
  genomicFilters: FilterSet;
  sortBy: Array<any>;
}
