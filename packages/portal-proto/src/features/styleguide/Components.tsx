import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import GenesTable from "../genesTable/GenesTable";
import { CohortFacetSelectionModal } from "@/features/cohortBuilder/CohortFacetSelection";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-nci-gray w-100">
      <p className="prose font-medium text-2xl">UI Components</p>
      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet docType="cases" field="primary_site" />
      <Divider label="Year Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="year"
        field="demographic.year_of_death"
      />
      <Divider label="Age Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="age"
        field="diagnoses.age_at_diagnosis"
      />
      <Divider label="Percent Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        indexType="repository"
        rangeDatatype="percent"
        field="samples.portions.slides.percent_tumor_cells"
      />
      <Divider label="Facet Filters" classNames={divider_style} />
      <CohortFacetSelectionModal />
      <Divider label="Genes Table" classNames={divider_style} />
      <GenesTable
        selectedSurvivalPlot={{ id: undefined }}
        handleSurvivalPlotToggled={undefined}
      />
    </div>
  );
};

export default Components;
