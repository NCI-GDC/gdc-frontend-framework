import { TablePageOffsetProps } from "../gdcapi/gdcgraphql";
import { FilterSet } from "../cohort";

export interface GenomicTableProps extends TablePageOffsetProps {
  genesTableFilters: FilterSet;
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
}
