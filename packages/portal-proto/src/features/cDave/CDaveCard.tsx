import { useState } from "react";
import { Card, ActionIcon, Tooltip } from "@mantine/core";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import { useCoreSelector, selectFacetDefinitionByName } from "@gff/core";
import { FacetChart } from "../charts/FacetChart";
import { CONTINUOUS_FACET_TYPES } from "./constants";
import { createBuckets } from "./utils";

interface CDaveCardProps {
  readonly field: string;
  readonly data: any;
  readonly updateFields: (field: string) => void;
}

enum ChartTypes {
  histogram = "histogram",
  survival = "survival",
  qq = "qq",
}

const CDaveCard: React.FC<CDaveCardProps> = ({
  field,
  data,
  updateFields,
}: CDaveCardProps) => {
  const [chartType] = useState<ChartTypes>(ChartTypes.histogram);
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, field),
  );

  console.log("full data", data);
  console.log("data", data[facet?.field]);
  console.log("facet", facet);

  if (
    facet &&
    data[facet.field] &&
    CONTINUOUS_FACET_TYPES.includes(facet.type)
  ) {
    console.log("buckets", createBuckets(data[facet.field].stats));
  }

  return facet ? (
    <Card>
      <Tooltip label={"Histogram"}>
        <ActionIcon
          variant="outline"
          className={
            chartType === ChartTypes.histogram
              ? "bg-nci-blue-darkest text-white"
              : "border-nci-blue-darkest"
          }
        >
          <ChartIcon />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Remove Card"}>
        <ActionIcon onClick={() => updateFields(field)}>
          <CloseIcon />
        </ActionIcon>
      </Tooltip>
      <FacetChart field={facet?.field} />
    </Card>
  ) : null;
};

export default CDaveCard;
