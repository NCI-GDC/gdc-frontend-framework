import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import DateRangeFacet from "../facets/DateRangeFacet";
import GenesTable from "../genesTable/GenesTable";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-primary-content w-100">
      <p className="prose font-medium text-2xl">UI Components</p>
      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet docType="cases" field="primary_site" width="w-1/2" />
      <Divider label="Year Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="year"
        field="demographic.year_of_death"
        width="w-1/3"
      />
      <Divider label="Age Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        rangeDatatype="age"
        field="diagnoses.age_at_diagnosis"
        width="w-1/3"
      />
      <Divider label="Date Range Facet" classNames={divider_style} />
      <DateRangeFacet
        docType="files"
        field="files.analysis.input_files.created_datetime"
        width="w-1/3"
      />
      <Divider label="Percent Range Facet" classNames={divider_style} />
      <NumericRangeFacet
        docType="cases"
        indexType="repository"
        rangeDatatype="percent"
        field="samples.portions.slides.percent_tumor_cells"
        width="w-1/3"
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
