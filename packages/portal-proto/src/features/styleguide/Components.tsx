import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import EnumFacet from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import DateRangeFacet from "../facets/DateRangeFacet";
import ExactValueFacet from "../facets/ExactValueFacet";
import ToggleFacet from "../facets/ToggleFacet";
import { GTableContainer } from "../../components/expandableTables/genes/GTableContainer";
import {
  useEnumFacet,
  useTotalCounts,
  useSelectFieldFilter,
  useClearFilters,
  useUpdateFacetFilter,
  useRangeFacet,
} from "../facets/hooks";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-primary-content w-100">
      <p className="prose font-medium text-2xl">UI Components</p>

      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet
        hooks={{
          useUpdateFacetFilters: useUpdateFacetFilter,
          useTotalCounts: useTotalCounts,
          useClearFilter: useClearFilters,
          useGetFacetData: useEnumFacet,
        }}
        hideIfEmpty={false}
        docType="cases"
        field="primary_site"
        width="w-1/2"
      />
      <Divider label="Date Range Facet" classNames={divider_style} />
      <DateRangeFacet
        docType="files"
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
        docType="cases"
        field="cases.diagnoses.lymph_nodes_tested"
        width="w-1/3"
        rangeDatatype="range"
        hooks={{
          useGetFacetData: useRangeFacet,
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: useTotalCounts,
        }}
      />
      <Divider label="Exact Value Facet" classNames={divider_style} />
      <ExactValueFacet
        docType="cases"
        field="cases.diagnoses.annotations.case_id"
        width="w-1/3"
        hooks={{
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
        }}
      />
      <Divider label="Toggle Facet" classNames={divider_style} />
      <ToggleFacet
        docType="cases"
        indexType="explore"
        field="gene.is_cancer_gene_census"
        facetName="Is Cancer Gene Census"
        width="w-1/3"
        hooks={{
          useGetFacetData: useEnumFacet,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: useTotalCounts,
        }}
      />

      <Divider label="Year Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="year"
        field="demographic.year_of_death"
        width="w-1/3"
        hooks={{
          useGetFacetData: useRangeFacet,
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: useTotalCounts,
        }}
      />

      <Divider label="Age Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="age"
        field="diagnoses.age_at_diagnosis"
        width="w-1/3"
        hooks={{
          useGetFacetData: useRangeFacet,
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: useTotalCounts,
        }}
      />
      <Divider label="Percent Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        indexType="repository"
        rangeDatatype="percent"
        field="samples.portions.slides.percent_tumor_cells"
        width="w-1/3"
        hooks={{
          useGetFacetData: useRangeFacet,
          useGetFacetFilters: useSelectFieldFilter,
          useUpdateFacetFilters: useUpdateFacetFilter,
          useClearFilter: useClearFilters,
          useTotalCounts: useTotalCounts,
        }}
      />
      <Divider label="Genes Table" classNames={divider_style} />
      <GTableContainer
        selectedSurvivalPlot={undefined}
        handleSurvivalPlotToggled={undefined}
      />
    </div>
  );
};

export default Components;
