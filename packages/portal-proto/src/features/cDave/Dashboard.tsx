import {
  useEffect,
  useMemo,
  useRef,
  createContext,
  useReducer,
  Dispatch,
} from "react";
import { Grid, Alert, Loader, Tooltip, Menu, ActionIcon } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import {
  GqlOperation,
  Buckets,
  Stats,
  usePrevious,
  useFacetDictionary,
  useGetSurvivalPlotQuery,
} from "@gff/core";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { convertDateToString } from "@/utils/date";
import SurvivalPlot, { SurvivalPlotTypes } from "../charts/SurvivalPlot";
import CDaveCard from "./CDaveCard/CDaveCard";

interface ChartDownloadInfo {
  readonly chartRef: React.MutableRefObject<HTMLElement>;
  readonly filename: string;
}

const chartDownloadReducer = (
  state: ChartDownloadInfo[],
  action: { type: "add" | "remove"; payload: ChartDownloadInfo[] },
) => {
  switch (action.type) {
    case "add":
      return [...state, ...action.payload];
    case "remove":
      return state.filter(
        (d) =>
          !action.payload.map((chart) => chart.filename).includes(d.filename),
      );
    default:
      return state;
  }
};

export const DashboardDownloadContext =
  createContext<
    Dispatch<{ type: "add" | "remove"; payload: ChartDownloadInfo[] }>
  >(undefined);

interface DashboardProps {
  readonly cohortFilters: GqlOperation;
  readonly activeFields: string[];
  readonly results: Record<string, Buckets | Stats>;
  readonly updateFields: (field: string) => void;
  readonly controlsExpanded: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  cohortFilters,
  activeFields,
  results,
  updateFields,
  controlsExpanded,
}: DashboardProps) => {
  const initialDashboardRender = useRef(true);
  const lastDashboardRender = usePrevious(initialDashboardRender);
  const {
    data: survivalData,
    isError,
    isFetching,
    isUninitialized,
  } = useGetSurvivalPlotQuery({
    filters: cohortFilters && [cohortFilters],
  });
  useFacetDictionary();

  useEffect(() => {
    if (lastDashboardRender) {
      initialDashboardRender.current = false;
    }
  });

  const [colCountInLastRow, colSpanInLastRow] = useMemo(() => {
    const colCount = activeFields.length + 1;
    const colCountInRow = controlsExpanded ? 2 : 3;
    const colCountInLastRow = colCount % colCountInRow;
    const colSpanInLastRow = colCountInLastRow
      ? 12 / colCountInLastRow
      : 12 / colCountInRow;
    return [colCountInLastRow, colSpanInLastRow];
  }, [activeFields, controlsExpanded]);

  const [chartDownloadState, dispatch] = useReducer(chartDownloadReducer, []);

  return (
    <Grid className="w-full m-0">
      <Menu>
        <Menu.Target>
          <Tooltip
            label="Download image or data"
            withArrow
            withinPortal
            position={"left"}
          >
            <ActionIcon
              data-testid="button-histogram-download"
              variant="outline"
              className="bg-base-max border-primary"
              aria-label="Download image or data"
            >
              <DownloadIcon className="text-primary" />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              chartDownloadState.map((download) => {
                handleDownloadPNG(
                  download.chartRef,
                  `${download.filename}.png`,
                );
              });
            }}
          >
            PNG
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              chartDownloadState.map((download) => {
                handleDownloadSVG(
                  download.chartRef,
                  `${download.filename}.png`,
                );
              });
            }}
          >
            SVG
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <DashboardDownloadContext.Provider value={dispatch}>
        <Grid.Col span={controlsExpanded ? 6 : 4}>
          <div
            data-testid="overall-survival-plot"
            className="h-full shadow-md rounded-lg p-2"
          >
            <h2 className="font-heading font-medium">Overall Survival</h2>
            {isError ? (
              <Alert>{"Something's gone wrong"}</Alert>
            ) : isFetching || isUninitialized ? (
              <Loader />
            ) : (
              <SurvivalPlot
                data={survivalData}
                title=""
                plotType={SurvivalPlotTypes.overall}
                downloadFileName={`overall-survival-plot.${convertDateToString(
                  new Date(),
                )}`}
              />
            )}
          </div>
        </Grid.Col>
        {activeFields.map((field, index) => {
          const isLastRow = index >= activeFields.length - colCountInLastRow;
          const colSpan = isLastRow
            ? colSpanInLastRow
            : controlsExpanded
            ? 6
            : 4;

          return (
            <Grid.Col span={colSpan} key={field}>
              <CDaveCard
                field={field}
                data={results[field]}
                updateFields={updateFields}
                initialDashboardRender={initialDashboardRender.current}
                cohortFilters={cohortFilters}
              />
            </Grid.Col>
          );
        })}
      </DashboardDownloadContext.Provider>
    </Grid>
  );
};

export default Dashboard;
