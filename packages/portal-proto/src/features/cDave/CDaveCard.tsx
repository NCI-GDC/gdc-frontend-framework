import { useCoreSelector, selectFacetDefinitionByName } from "@gff/core";
import { Card } from "@mantine/core";
import { useState } from "react";
import { FacetChart } from "../charts/FacetChart";

interface CDaveCardProps {
  readonly field: string;
  readonly stats: any;
}

enum ChartTypes {
  histogram = "histogram",
  survival = "survival",
  qq = "qq",
}

const CDaveCard: React.FC<CDaveCardProps> = ({
  field,
  stats,
}: CDaveCardProps) => {
  const [chartType, setChartType] = useState<ChartTypes>(ChartTypes.histogram);
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, field),
  );

  console.log("stats", stats[facet?.field]);
  console.log("facet", facet);

  return facet ? (
    <Card>
      <FacetChart field={facet?.field} />
    </Card>
  ) : null;
};

export default CDaveCard;
