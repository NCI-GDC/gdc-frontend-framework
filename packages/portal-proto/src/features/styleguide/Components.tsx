import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import EnumFacet from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import DateRangeFacet from "../facets/DateRangeFacet";
import ExactValueFacet from "../facets/ExactValueFacet";
import ToggleFacet from "../facets/ToggleFacet";
import GenesTable from "../genesTable/GenesTable";
import {
  useEnumFacet,
  useTotalCounts,
  useSelectFieldFilter,
  useClearFilters,
  useUpdateFacetFilter,
  useRangeFacet,
} from "../facets/hooks";
import partial from "lodash/partial";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-primary-content w-100">
      <p className="prose font-medium text-2xl">UI Components</p>

      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet
        hooks={{
          useUpdateFacetFilters: useUpdateFacetFilter,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
          useClearFilter: useClearFilters,
          useGetFacetData: partial(useEnumFacet, "cases", "repository"),
        }}
        hideIfEmpty={false}
        field="primary_site"
        width="w-1/2"
        valueLabel="Cases"
      />
      <Divider label="Date Range Facet" classNames={divider_style} />
      <DateRangeFacet
        valueLabel="Files"
        field="files.analysis.input_files.created_datetime"
        width="w-1/3"
        hooks={{
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
        }}
      />
      <Divider label="Numeric Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        field="cases.diagnoses.lymph_nodes_tested"
        width="w-1/3"
        rangeDatatype="range"
        valueLabel="Cases"
        hooks={{
          useGetFacetData: partial(useRangeFacet, "cases", "explore"),
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
        }}
      />
      <Divider label="Exact Value Facet" classNames={divider_style} />
      <ExactValueFacet
        field="cases.diagnoses.annotations.case_id"
        width="w-1/3"
        valueLabel="cases"
        hooks={{
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
        }}
      />
      <Divider label="Toggle Facet" classNames={divider_style} />
      <ToggleFacet
        field="gene.is_cancer_gene_census"
        facetName="Is Cancer Gene Census"
        valueLabel={"Cases"}
        width="w-1/3"
        hooks={{
          useGetFacetData: partial(useEnumFacet, "cases", "explore"),
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
        }}
      />

      <Divider label="Year Facet" classNames={divider_style} />
      <NumericRangeFacet
        valueLabel="Cases"
        rangeDatatype="year"
        field="demographic.year_of_death"
        width="w-1/3"
        hooks={{
          useGetFacetData: partial(useRangeFacet, "cases", "repository"),
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
        }}
      />

      <Divider label="Age Facet" classNames={divider_style} />
      <NumericRangeFacet
        valueLabel="Cases"
        rangeDatatype="age"
        field="diagnoses.age_at_diagnosis"
        width="w-1/3"
        hooks={{
          useGetFacetData: partial(useRangeFacet, "cases", "repository"),
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
        }}
      />

      <Divider label="Percent Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        valueLabel="Cases"
        rangeDatatype="percent"
        field="samples.portions.slides.percent_tumor_cells"
        width="w-1/3"
        hooks={{
          useGetFacetData: partial(useRangeFacet, "cases", "repository"),
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: partial(useTotalCounts, "caseCounts"),
        }}
      />

      <Divider label="Genes Table" classNames={divider_style} />
      <GenesTable
        selectedSurvivalPlot={{ id: undefined }}
        handleSurvivalPlotToggled={undefined}
      />
    </div>
  );
};

export default Components;
