import { useState } from "react";
import {
  Card,
  ActionIcon,
  Tooltip,
  Checkbox,
  RadioGroup,
  Radio,
} from "@mantine/core";
import {
  MdBarChart as ChartIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Statistics,
  Buckets,
  Stats,
} from "@gff/core";
import { useCasesFacet, useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, parseFieldName, toDisplayName } from "./utils";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Record<string, Buckets | Stats>;
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
  const [displayPercent, setDisplayPercent] = useState(false);
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, field),
  );

  const fieldName = toDisplayName(parseFieldName(field).field_name);

  return facet && data[facet.field] ? (
    <Card className="h-[560px]">
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
      <RadioGroup
        size="sm"
        className="p-2"
        onChange={(e) => setDisplayPercent(e === "percent")}
        defaultValue={"counts"}
      >
        <Radio value="counts" label="# of Cases" />
        <Radio value="percent" label="% of Cases" />
      </RadioGroup>
      {CONTINUOUS_FACET_TYPES.includes(facet.type) ? (
        <ContinuousResult
          field={field}
          fieldName={fieldName}
          stats={(data[facet.field] as Stats).stats}
          displayPercent={displayPercent}
        />
      ) : (
        <EnumResult
          field={facet?.field}
          fieldName={fieldName}
          displayPercent={displayPercent}
        />
      )}
    </Card>
  ) : null;
};

const parseContinuousBucket = (bucket: string): string => {
  const [fromValue, toValue] = bucket.split("-");
  return `${Number(fromValue).toFixed(2)} to < ${Number(toValue).toFixed(2)}`;
};

const formatBarChartData = (
  data: Record<string, number>,
  displayPercent: boolean,
  continuous: boolean,
) => {
  const yTotal = Object.values(data || {}).reduce((prevY, y) => prevY + y, 0);

  return Object.entries(data || {}).map(([key, value]) => ({
    x: truncateString(continuous ? parseContinuousBucket(key) : key, 8),
    fullName: continuous ? parseContinuousBucket(key) : key,
    y: displayPercent ? (value / yTotal) * 100 : value,
    yCount: value,
    yTotal,
  }));
};

interface ContinuousResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly stats: Statistics;
  readonly displayPercent: boolean;
}
const ContinuousResult: React.FC<ContinuousResultProps> = ({
  field,
  stats,
  fieldName,
  displayPercent,
}: ContinuousResultProps) => {
  const ranges = createBuckets(stats);
  const { data } = useRangeFacet(field, ranges, "cases", "repository");

  const barChartData = formatBarChartData(data, displayPercent, true);

  const color =
    tailwindConfig.theme.extend.colors[
      COLOR_MAP[parseFieldName(field).field_type]
    ].DEFAULT;

  return (
    <>
      <div className="h-80">
        <VictoryBarChart
          data={barChartData}
          color={color}
          yLabel={displayPercent ? "% of Cases" : "# Cases"}
          width={800}
          height={500}
        />
      </div>
      <CDaveTable data={barChartData} fieldName={fieldName} />
    </>
  );
};

interface EnumResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly displayPercent: boolean;
}
const EnumResult: React.FC<EnumResultProps> = ({
  field,
  fieldName,
  displayPercent,
}: EnumResultProps) => {
  const { data } = useCasesFacet(field, "cases", "repository");

  const barChartData = formatBarChartData(data, displayPercent, false);

  const color =
    tailwindConfig.theme.extend.colors[
      COLOR_MAP[parseFieldName(field).field_type]
    ].DEFAULT;

  return (
    <>
      <div className="h-80">
        <VictoryBarChart
          data={barChartData}
          color={color}
          yLabel={displayPercent ? "% of Cases" : "# Cases"}
          width={800}
          height={500}
        />
      </div>
      <CDaveTable fieldName={fieldName} data={barChartData} />
    </>
  );
};

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: ReadonlyArray<{
    fullName: string;
    yCount: number;
    yTotal: number;
  }>;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data,
}: CDaveTableProps) => {
  return (
    <div className="h-44 block overflow-auto w-full">
      <table className="bg-white w-full text-left text-nci-gray-darker ">
        <thead className="bg-nci-gray-lightest font-bold">
          <tr>
            <th>Select</th>
            <th>{fieldName}</th>
            <th># Cases</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr
              className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
              key={`${fieldName}-${d.fullName}`}
            >
              <td>
                <Checkbox />
              </td>
              <td>{d.fullName}</td>
              <td>
                {d.yCount.toLocaleString()} (
                {(d.yCount / d.yTotal).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })}
                )
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CDaveCard;
