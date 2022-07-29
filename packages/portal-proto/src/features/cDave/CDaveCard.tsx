import { useState, useEffect, useContext } from "react";
import {
  Card,
  ActionIcon,
  Tooltip,
  Checkbox,
  RadioGroup,
  Radio,
  Loader,
  Button,
  Menu,
  Alert,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as BarChartIcon,
  MdShowChart as SurvivalChartIcon,
  MdOutlineClose as CloseIcon,
  MdDownload as DownloadIcon,
  MdArrowDropDown as DownIcon,
} from "react-icons/md";
import { mapKeys } from "lodash";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Statistics,
  Buckets,
  Bucket,
  Stats,
  useSurvivalPlot,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  GqlOperation,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import tailwindConfig from "tailwind.config";
import { truncateString } from "src/utils";
import { useRangeFacet } from "../facets/hooks";
import VictoryBarChart from "../charts/VictoryBarChart";
import { CONTINUOUS_FACET_TYPES, COLOR_MAP } from "./constants";
import { createBuckets, toDisplayName } from "./utils";
import SurvivalPlot from "../charts/SurvivalPlot";

interface CDaveCardProps {
  readonly field: string;
  readonly data: Buckets | Stats;
  readonly updateFields: (field: string) => void;
  readonly initialDashboardRender: boolean;
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
  initialDashboardRender,
}: CDaveCardProps) => {
  const [chartType, setChartType] = useState<ChartTypes>(ChartTypes.histogram);
  const [resultData, setResultData] = useState([]);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const { scrollIntoView, targetRef } = useScrollIntoView();
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );

  const fieldName = toDisplayName(field);

  useEffect(() => {
    if (!initialDashboardRender) {
      scrollIntoView();
    }
    // this should only happen on inital component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="h-[580px]" ref={(ref) => (targetRef.current = ref)}>
      <div className="flex justify-between mb-1">
        <h2>{fieldName}</h2>
        <div className="flex gap-1">
          <Tooltip label={"Histogram"} withArrow>
            <ActionIcon
              variant="outline"
              className={
                chartType === ChartTypes.histogram
                  ? "bg-nci-blue-darkest text-white"
                  : "border-nci-blue-darkest text-nci-blue-darkest"
              }
              onClick={() => setChartType(ChartTypes.histogram)}
            >
              <BarChartIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Survival Plot"} withArrow>
            <ActionIcon
              variant="outline"
              className={
                chartType === ChartTypes.survival
                  ? "bg-nci-blue-darkest text-white"
                  : "border-nci-blue-darkest text-nci-blue-darkest"
              }
              onClick={() => setChartType(ChartTypes.survival)}
            >
              <SurvivalChartIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={"Remove Card"} withArrow>
            <ActionIcon onClick={() => updateFields(field)}>
              <CloseIcon />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      {chartType === ChartTypes.histogram ? (
        data && facet ? (
          CONTINUOUS_FACET_TYPES.includes(facet?.type) ? (
            <ContinuousResult
              field={field}
              fieldName={fieldName}
              stats={(data as Stats).stats}
              setResultData={setResultData}
            />
          ) : (
            <EnumResult
              field={field}
              fieldName={fieldName}
              data={(data as Buckets).buckets}
              setResultData={setResultData}
            />
          )
        ) : null
      ) : (
        <ClinicalSurvivalPlot
          field={field}
          selectedSurvivalPlots={selectedSurvivalPlots}
          continuous={CONTINUOUS_FACET_TYPES.includes(facet?.type)}
        />
      )}
      <CDaveTable
        fieldName={fieldName}
        data={resultData}
        survival={chartType === ChartTypes.survival}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
      />
    </Card>
  );
};

interface ClinicalSurvivalPlotProps {
  readonly field: string;
  readonly selectedSurvivalPlots: string[];
  readonly continuous: boolean;
}

const ClinicalSurvivalPlot: React.FC<ClinicalSurvivalPlotProps> = ({
  field,
  selectedSurvivalPlots,
  continuous,
}: ClinicalSurvivalPlotProps) => {
  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(selectCurrentCohortFilters(state)),
  );

  const filters =
    selectedSurvivalPlots.length === 0
      ? [cohortFilters]
      : selectedSurvivalPlots.map((value) => {
          const content = [];
          if (cohortFilters) {
            content.push(cohortFilters);
          }

          if (continuous) {
            const [fromValue, toValue] = value
              .split("-")
              .map((val, idx, src) => (src[idx - 1] === "" ? `-${val}` : val))
              .filter((val) => val !== "");

            content.push({
              op: ">=",
              content: { field, value: [fromValue] },
            });

            content.push({
              op: "<",
              content: { field, value: [toValue] },
            });
          } else {
            content.push({
              op: "=",
              content: { field, value },
            });
          }

          return {
            op: "and",
            content,
          } as GqlOperation;
        });

  console.log(filters);
  const { data, isLoading, isError } = useGetSurvivalPlotQuery({ filters });

  return (
    <>
      <div className="h-64">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Alert color={"red"}>Something's gone wrong</Alert>
        ) : (
          <SurvivalPlot
            data={data}
            height={150}
            title={""}
            field={field}
            names={selectedSurvivalPlots}
            plotType={"categorical"}
          />
        )}
      </div>
      <div className="flex justify-between p-2">
        <div>
          <Menu
            control={
              <Button
                rightIcon={<DownIcon size={20} />}
                className="bg-white text-nci-gray-darkest border-nci-gray"
              >
                Select Action
              </Button>
            }
          >
            <Menu.Item disabled>Save as a new case set</Menu.Item>
            <Menu.Item disabled>Add to existing case set</Menu.Item>
            <Menu.Item disabled>Remove from existing case set</Menu.Item>
          </Menu>
          <Button className="bg-white text-nci-gray-darkest border-nci-gray ml-2">
            TSV
          </Button>
        </div>
        <Menu
          control={
            <Button
              rightIcon={<DownIcon size={20} />}
              className="bg-white text-nci-gray-darkest border-nci-gray"
            >
              Customize Bins
            </Button>
          }
        >
          <Menu.Item>Edit Bins</Menu.Item>
          <Menu.Item disabled>Reset to Default</Menu.Item>
        </Menu>
      </div>
    </>
  );
};

interface ContinuousResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly stats: Statistics;
  readonly setResultData: (data) => void;
}
const ContinuousResult: React.FC<ContinuousResultProps> = ({
  field,
  stats,
  fieldName,
  setResultData,
}: ContinuousResultProps) => {
  const ranges = createBuckets(stats);
  const { data, isFetching } = useRangeFacet(
    field,
    ranges,
    "cases",
    "repository",
  );

  return (
    <Result
      field={field}
      fieldName={fieldName}
      data={data}
      isFetching={isFetching}
      continuous={true}
      noData={stats.count === 0}
      setResultData={setResultData}
    />
  );
};

interface EnumResultProps {
  readonly field: string;
  readonly fieldName: string;
  readonly data: readonly Bucket[];
  readonly setResultData: (data) => void;
}
const EnumResult: React.FC<EnumResultProps> = ({
  field,
  fieldName,
  data,
  setResultData,
}: EnumResultProps) => {
  return (
    <Result
      field={field}
      fieldName={fieldName}
      data={Object.fromEntries((data || []).map((d) => [d.key, d.doc_count]))}
      isFetching={false}
      continuous={false}
      noData={
        data !== undefined && data.every((bucket) => bucket.key === "_missing")
      }
      setResultData={setResultData}
    />
  );
};

const parseContinuousBucket = (bucket: string): string => {
  const [fromValue, toValue] = bucket
    .split("-")
    .map((val, idx, src) => (src[idx - 1] === "" ? `-${val}` : val))
    .filter((val) => val !== "");

  return `${Number(Number(fromValue).toFixed(2))} to <${Number(
    Number(toValue).toFixed(2),
  )}`;
};

const formatBarChartData = (
  data: Record<string, number>,
  displayPercent: boolean,
  continuous: boolean,
) => {
  const dataToMap = mapKeys(data || {}, (_, k) =>
    k === "_missing" ? "missing" : k,
  );
  const yTotal = Object.values(dataToMap).reduce((prevY, y) => prevY + y, 0);

  const mappedData = Object.entries(dataToMap || {}).map(([key, value]) => ({
    x: truncateString(continuous ? parseContinuousBucket(key) : key, 8),
    fullName: continuous ? parseContinuousBucket(key) : key,
    key,
    y: displayPercent ? (value / yTotal) * 100 : value,
    yCount: value,
    yTotal,
  }));

  return continuous
    ? mappedData
    : mappedData.sort((a, b) => b.yCount - a.yCount);
};

interface ResultProps {
  readonly data: Record<string, number>;
  readonly isFetching: boolean;
  readonly noData: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly continuous: boolean;
  readonly setResultData: (data) => void;
}

const Result: React.FC<ResultProps> = ({
  data,
  isFetching,
  field,
  fieldName,
  continuous,
  noData,
  setResultData,
}: ResultProps) => {
  const [displayPercent, setDisplayPercent] = useState(false);
  const barChartData = formatBarChartData(data, displayPercent, continuous);
  useEffect(() => {
    setResultData(barChartData);
  }, []);
  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field.split(".").at(-2)]]
      ?.DEFAULT;
  const hideXTicks = barChartData.length > 20;

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : noData ? (
        <div className="h-full w-full flex">
          <p className="m-auto">No data for this property</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between p-2">
            <RadioGroup
              size="sm"
              className="p-2"
              onChange={(e) => setDisplayPercent(e === "percent")}
              defaultValue={"counts"}
            >
              <Radio value="counts" label="# of Cases" />
              <Radio value="percent" label="% of Cases" />
            </RadioGroup>
            <Menu
              control={
                <ActionIcon
                  variant="outline"
                  className="text-nci-blue-darkest border-nci-blue-darkest"
                >
                  <DownloadIcon />
                </ActionIcon>
              }
            >
              <Menu.Item>SVG</Menu.Item>
              <Menu.Item>PNG</Menu.Item>
              <Menu.Item>JSON</Menu.Item>
            </Menu>
          </div>
          <div className="h-64">
            <VictoryBarChart
              data={barChartData}
              color={color}
              yLabel={displayPercent ? "% of Cases" : "# of Cases"}
              width={900}
              height={500}
              hideXTicks={hideXTicks}
              xLabel={
                hideXTicks
                  ? "Mouse over the histogram to see x-axis labels"
                  : undefined
              }
            />
          </div>
          <div className="flex justify-between p-2">
            <div>
              <Menu
                control={
                  <Button
                    rightIcon={<DownIcon size={20} />}
                    className="bg-white text-nci-gray-darkest border-nci-gray"
                  >
                    Select Action
                  </Button>
                }
              >
                <Menu.Item disabled>Save as a new case set</Menu.Item>
                <Menu.Item disabled>Add to existing case set</Menu.Item>
                <Menu.Item disabled>Remove from existing case set</Menu.Item>
              </Menu>
              <Button className="bg-white text-nci-gray-darkest border-nci-gray ml-2">
                TSV
              </Button>
            </div>
            <Menu
              control={
                <Button
                  rightIcon={<DownIcon size={20} />}
                  className="bg-white text-nci-gray-darkest border-nci-gray"
                >
                  Customize Bins
                </Button>
              }
            >
              <Menu.Item>Edit Bins</Menu.Item>
              <Menu.Item disabled>Reset to Default</Menu.Item>
            </Menu>
          </div>
        </>
      )}
    </>
  );
};

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: ReadonlyArray<{
    fullName: string;
    yCount: number;
    yTotal: number;
    key: string;
  }>;
  readonly survival: boolean;
  readonly selectedSurvivalPlots: string[];
  readonly setSelectedSurvivalPlots: (field: string[]) => void;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data,
  survival,
  selectedSurvivalPlots,
  setSelectedSurvivalPlots,
}: CDaveTableProps) => {
  useEffect(() => {
    setSelectedSurvivalPlots(data.slice(0, 2).map((d) => d.key));
  }, [data, setSelectedSurvivalPlots]);

  return (
    <div className="h-48 block overflow-auto w-full relative">
      <table className="bg-white w-full text-left text-nci-gray-darker mb-2">
        <thead className="bg-nci-gray-lightest font-bold">
          <tr>
            <th>Select</th>
            <th>{fieldName}</th>
            <th className="text-right"># Cases</th>
            {survival && <th>Survival</th>}
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
              <td className="text-right">
                {d.yCount.toLocaleString()} (
                {(d.yCount / d.yTotal).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })}
                )
              </td>
              {survival && (
                <td>
                  <ActionIcon
                    variant="outline"
                    className={
                      selectedSurvivalPlots.includes(d.key)
                        ? `bg-gdc-survival-${idx} text-white`
                        : "bg-nci-gray text-white"
                    }
                    disabled={
                      (!selectedSurvivalPlots.includes(d.key) &&
                        selectedSurvivalPlots.length === 5) ||
                      d.yCount <= 10
                    }
                    onClick={() =>
                      selectedSurvivalPlots.includes(d.key)
                        ? setSelectedSurvivalPlots(
                            selectedSurvivalPlots.filter((s) => s !== d.key),
                          )
                        : setSelectedSurvivalPlots([
                            ...selectedSurvivalPlots,
                            d.key,
                          ])
                    }
                  >
                    <SurvivalChartIcon />
                  </ActionIcon>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CDaveCard;
