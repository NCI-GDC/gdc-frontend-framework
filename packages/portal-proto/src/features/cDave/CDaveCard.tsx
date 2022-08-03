import { useState, useEffect } from "react";
import {
  Card,
  ActionIcon,
  Tooltip,
  Checkbox,
  Button,
  Menu,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  MdBarChart as BarChartIcon,
  MdShowChart as SurvivalChartIcon,
  MdOutlineClose as CloseIcon,
  MdArrowDropDown as DownIcon,
} from "react-icons/md";
import {
  useCoreSelector,
  selectFacetDefinitionByName,
  Buckets,
  Stats,
} from "@gff/core";

import { CONTINUOUS_FACET_TYPES } from "./constants";
import { toDisplayName } from "./utils";
import { CategoricalHistogram, ContinuousHistogram } from "./CDaveHistogram";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import ContinuousBinningModal from "./ContinuousBinningModal";
import CategoricalBinningModal from "./CategoricalBinningModal";

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
  const [resultData, setResultData] = useState({});
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const [customBinnedData, setCustomBinnedData] = useState({});
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

  const continuous = CONTINUOUS_FACET_TYPES.includes(facet?.type);

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
          continuous ? (
            <ContinuousHistogram
              field={field}
              fieldName={fieldName}
              stats={(data as Stats).stats}
              setResultData={setResultData}
            />
          ) : (
            <CategoricalHistogram
              field={field}
              fieldName={fieldName}
              data={(data as Buckets).buckets}
              setResultData={setResultData}
              customBinnedData={customBinnedData}
            />
          )
        ) : null
      ) : (
        <ClinicalSurvivalPlot
          field={field}
          selectedSurvivalPlots={selectedSurvivalPlots}
          continuous={continuous}
        />
      )}
      <CardControls
        continuous={continuous}
        field={fieldName}
        results={resultData}
        hasCustomBinnedData={Object.keys(customBinnedData).length > 0}
        setCustomBinnedData={setCustomBinnedData}
      />
      {/*
      <CDaveTable
        fieldName={fieldName}
        data={resultData}
        survival={chartType === ChartTypes.survival}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
      />
      */}
    </Card>
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
            {survival && <th className="text-right">Survival</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => {
            const survivalSelected = selectedSurvivalPlots.includes(d.key);
            const enoughCasesForSurvival = d.yCount > 10;
            const survivalDisabled =
              (!survivalSelected && selectedSurvivalPlots.length === 5) ||
              !enoughCasesForSurvival;

            return (
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
                    <Tooltip
                      label={
                        !enoughCasesForSurvival
                          ? "Not enough data"
                          : survivalSelected
                          ? `Click to remove ${d.fullName} from plot`
                          : `Click to plot ${d.fullName}`
                      }
                      className="float-right"
                    >
                      <ActionIcon
                        variant="outline"
                        className={
                          survivalDisabled
                            ? "bg-nci-gray-lighter text-white"
                            : survivalSelected
                            ? `bg-gdc-survival-${selectedSurvivalPlots.indexOf(
                                d.key,
                              )} text-white`
                            : "bg-nci-gray text-white"
                        }
                        disabled={survivalDisabled}
                        onClick={() =>
                          survivalSelected
                            ? setSelectedSurvivalPlots(
                                selectedSurvivalPlots.filter(
                                  (s) => s !== d.key,
                                ),
                              )
                            : setSelectedSurvivalPlots([
                                ...selectedSurvivalPlots,
                                d.key,
                              ])
                        }
                      >
                        <SurvivalChartIcon />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface CardControlsProps {
  readonly continuous: boolean;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly hasCustomBinnedData: boolean;
  readonly setCustomBinnedData: (bins: Record<string, number>) => void;
}

const CardControls: React.FC<CardControlsProps> = ({
  continuous,
  field,
  results,
  hasCustomBinnedData,
  setCustomBinnedData,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
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
            <Menu.Item disabled>Save as a new cohort</Menu.Item>
            <Menu.Item disabled>Add to cohort</Menu.Item>
            <Menu.Item disabled>Remove from cohort</Menu.Item>
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
          <Menu.Item onClick={() => setModalOpen(true)}>Edit Bins</Menu.Item>
          <Menu.Item
            disabled={!hasCustomBinnedData}
            onClick={() => setCustomBinnedData([])}
          >
            Reset to Default
          </Menu.Item>
        </Menu>
      </div>
      {modalOpen &&
        (continuous ? (
          <ContinuousBinningModal setModalOpen={setModalOpen} />
        ) : (
          <CategoricalBinningModal
            setModalOpen={setModalOpen}
            field={field}
            results={results}
            updateBins={setCustomBinnedData}
          />
        ))}
    </>
  );
};

export default CDaveCard;
