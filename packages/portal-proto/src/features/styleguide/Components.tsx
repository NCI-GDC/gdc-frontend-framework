import { ReactNode } from "react";
import { divider_style } from "./style";
import { Divider } from "@mantine/core";
import { EnumFacet } from "../facets/EnumFacet";
import GenesTable from "../genomic/GenesTable";

const Components : ReactNode = () => {
  return (
    <div className="flex flex-col prose font-montserrat text-nci-gray prose-md w-100">
      <h1>UI Components</h1>
      <Divider label="Enumeration Facet" classNames={divider_style} />
      <EnumFacet type="cases" field="primary_site" />
      <Divider label="Genes Table" classNames={divider_style} />
      <GenesTable selectedSurvivalPlot={ { id: undefined}} />
    </div>
  );
};

export default Components;
