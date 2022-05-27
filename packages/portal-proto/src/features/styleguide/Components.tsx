import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import BooleanFacet from "../facets/BooleanFacet";
import GenesTable from "../genesTable/GenesTable";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-nci-gray w-100">
      <p className="prose font-medium text-2xl">UI Components</p>
      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet itemType="cases" field="primary_site" />
      <Divider label="Year Facet" classNames={divider_style} />
      <NumericRangeFacet
        itemType="cases"
        rangeDatatype="year"
        field="demographic.year_of_death"
      />
      <Divider label="Age Facet" classNames={divider_style} />
      <NumericRangeFacet
        itemType="cases"
        rangeDatatype="age"
        field="diagnoses.age_at_diagnosis"
      />
      <Divider label="Percent Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        itemType="cases"
        indexType="repository"
        rangeDatatype="percent"
        field="samples.portions.slides.percent_tumor_cells"
      />
      <Divider label="Boolean Facet" classNames={divider_style} />
      <BooleanFacet
        itemType="genes"
        indexType="explore"
        facetName="Is Cancer Gene Census"
        field="is_cancer_gene_census"
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
