import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import GenesTable from "../genesTable/GenesTable";

const Components: ReactNode = () => {
  return (
    <div className="flex flex-col font-montserrat text-nci-gray w-100">
      <p className="prose font-medium text-2xl">UI Components</p>
      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet type="cases" field="primary_site" />
      <Divider label="Genes Table" classNames={divider_style} />
      <GenesTable
        selectedSurvivalPlot={{ id: undefined }}
        handleSurvivalPlotToggled={undefined}
      />
    </div>
  );
};

export default Components;
