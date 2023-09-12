import { useState, useMemo } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { Bucket } from "@gff/core";
import CDaveHistogram from "./CDaveHistogram";
import CDaveTable from "./CDaveTable";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import CardControls from "./CardControls";
import { CategoricalBins, ChartTypes, SelectedFacet } from "../types";
import { SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { flattenBinnedData } from "../utils";

interface CategoricalDataProps {
  readonly initialData: readonly Bucket[];
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
}

const CategoricalData: React.FC<CategoricalDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
  noData,
}: CategoricalDataProps) => {
  const [customBinnedData, setCustomBinnedData] =
    useState<CategoricalBins>(null);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacet[]>([]);
  const [yTotal, setYTotal] = useState(0);

  const resultData = useMemo(
    () =>
      Object.fromEntries(
        (initialData || []).map((d) => [
          d.key === "_missing" ? "missing" : d.key,
          d.doc_count,
        ]),
      ),
    [initialData],
  );

  useDeepCompareEffect(() => {
    setSelectedSurvivalPlots(
      Object.entries(
        customBinnedData !== null
          ? flattenBinnedData(customBinnedData as CategoricalBins)
          : resultData,
      )
        .filter(
          ([key, value]) =>
            key !== "missing" && value >= SURVIVAL_PLOT_MIN_COUNT,
        )
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key)
        .slice(0, 2),
    );

    if (customBinnedData === null) {
      setYTotal(Object.values(resultData).reduce((a, b) => a + b, 0));
    }

    setSelectedFacets([]);
  }, [customBinnedData, resultData]);

  return (
    <>
      {chartType === "histogram" ? (
        <CDaveHistogram
          field={field}
          data={resultData}
          yTotal={yTotal}
          isFetching={false}
          continuous={false}
          noData={noData}
          customBinnedData={customBinnedData}
        />
      ) : (
        <ClinicalSurvivalPlot
          field={field}
          selectedSurvivalPlots={selectedSurvivalPlots}
          continuous={false}
          customBinnedData={customBinnedData}
        />
      )}
      <CardControls
        continuous={false}
        field={field}
        fieldName={fieldName}
        results={resultData}
        yTotal={yTotal}
        customBinnedData={customBinnedData}
        setCustomBinnedData={setCustomBinnedData}
        selectedFacets={selectedFacets}
      />
      <CDaveTable
        fieldName={fieldName}
        data={resultData}
        yTotal={yTotal}
        customBinnedData={customBinnedData}
        survival={chartType === "survival"}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
        selectedFacets={selectedFacets}
        setSelectedFacets={setSelectedFacets}
        continuous={false}
      />
    </>
  );
};

export default CategoricalData;
