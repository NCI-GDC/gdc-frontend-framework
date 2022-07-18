import { useState } from "react";
import { Card, ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import { useCoreSelector, selectFacetDefinitionByName } from "@gff/core";
import { FacetChart } from "../charts/FacetChart";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, parseFieldName } from "./utils";
import { useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import { humanify } from "@/features/biospecimen/utils";

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

  console.log(facet);

  const color = COLOR_MAP[parseFieldName(field).field_type];

  if (
    facet &&
    data[facet.field] &&
    CONTINUOUS_FACET_TYPES.includes(facet.type)
  ) {
    console.log("buckets", createBuckets(data[facet.field].stats));
  }

  return facet && data[facet.field] ? (
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
      {CONTINUOUS_FACET_TYPES.includes(facet.type) ? (
        <ContinuousResult
          field={facet.field}
          stats={data[facet.field].stats}
          color={color}
        />
      ) : (
        <FacetChart field={facet?.field} />
      )}
    </Card>
  ) : null;
};

const ContinuousResult = ({ field, stats, color }) => {
  const ranges = createBuckets(stats);
  const { data } = useRangeFacet(field, ranges, "cases", "repository");

  const barChartData = Object.entries(data || {}).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  console.log("range facet data", data);
  return (
    <>
      <VictoryBarChart data={barChartData} color={color} yLabel={"# Cases"} />
      <CDaveTable field={field} data={barChartData} />
    </>
  );
};

const CDaveTable = ({ field, data }) => {
  return (
    <table className="bg-white w-full text-left text-nci-gray-darker">
      <thead className="bg-nci-gray-lightest font-bold">
        <tr>
          <th>Select</th>
          <th>{humanify({ term: field })}</th>
          <th># Cases</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, idx) => (
          <tr className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}>
            <td>
              <Checkbox />
            </td>
            <td>{d.x}</td>
            <td>{d.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CDaveCard;
