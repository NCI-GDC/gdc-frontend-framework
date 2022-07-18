import { useState } from "react";
import { Card, ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Statistics,
} from "@gff/core";
import { useCasesFacet, useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import { humanify } from "@/features/biospecimen/utils";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, parseFieldName } from "./utils";

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

  const fieldName = humanify({ term: facet?.field || "" });
  const color = COLOR_MAP[parseFieldName(field).field_type];

  return facet && data[facet.field] ? (
    <Card>
      <div className="flex justify-between mb-2">
        <h2>{fieldName}</h2>
        <div className="flex gap-2">
          <Tooltip label={"Histogram"} withArrow>
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
          <Tooltip label={"Remove Card"} withArrow>
            <ActionIcon onClick={() => updateFields(field)}>
              <CloseIcon />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      {CONTINUOUS_FACET_TYPES.includes(facet.type) ? (
        <ContinuousResult
          field={field}
          fieldName={fieldName}
          stats={data[facet.field].stats}
          color={color}
        />
      ) : (
        <EnumResult field={facet?.field} color={color} fieldName={fieldName} />
      )}
    </Card>
  ) : null;
};

interface ContinuousResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly color: string;
  readonly stats: Statistics;
}
const ContinuousResult: React.FC<ContinuousResultProps> = ({
  field,
  stats,
  color,
  fieldName,
}: ContinuousResultProps) => {
  const ranges = createBuckets(stats);
  const { data } = useRangeFacet(field, ranges, "cases", "repository");

  const barChartData = Object.entries(data || {}).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  return (
    <>
      <VictoryBarChart data={barChartData} color={color} yLabel={"# Cases"} />
      <CDaveTable data={barChartData} fieldName={fieldName} />
    </>
  );
};

interface EnumResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly color: string;
}
const EnumResult: React.FC<EnumResultProps> = ({
  field,
  color,
  fieldName,
}: EnumResultProps) => {
  const { data } = useCasesFacet(field, "cases", "repository");
  const barChartData = Object.entries(data || {}).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  return (
    <>
      <VictoryBarChart data={barChartData} color={color} yLabel={"# Cases"} />
      <CDaveTable fieldName={fieldName} data={barChartData} />
    </>
  );
};

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: any;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data,
}: CDaveTableProps) => {
  return (
    <table className="bg-white w-full text-left text-nci-gray-darker">
      <thead className="bg-nci-gray-lightest font-bold">
        <tr>
          <th>Select</th>
          <th>{fieldName}</th>
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
