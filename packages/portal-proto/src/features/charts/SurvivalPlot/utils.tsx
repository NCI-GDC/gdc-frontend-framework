import { SurvivalElement } from "@gff/core";
import { MINIMUM_CASES, SurvivalPlotTypes } from "./types";

export const DAYS_IN_YEAR_ROUNDED = 360;
export const DAYS_IN_MONTH_ROUNDED = 30;

export const enoughData = (data: ReadonlyArray<SurvivalElement>) =>
  data && data.length && data.every((r) => r.donors.length >= MINIMUM_CASES);

export const enoughDataOnSomeCurves = (data: ReadonlyArray<SurvivalElement>) =>
  data && data.length && data.some((r) => r.donors.length >= MINIMUM_CASES);

export const buildOnePlotLegend = (data, name) => {
  const hasMultipleCurves = data.length > 0;
  const hasEnoughData = hasMultipleCurves
    ? enoughDataOnSomeCurves(data)
    : enoughData(data);
  return hasEnoughData
    ? name && [
        {
          key: name,
          value: `${data[0].donors.length.toLocaleString()} Cases with Survival Data`,
        },
      ]
    : [
        {
          key: `${name || ""}-not-enough-data`,
          value: "Not enough survival data",
        },
      ];
};

export const buildTwoPlotLegend = (data, name: string, plotType: string) => {
  const hasEnoughData = enoughData(data);
  const results1 = data.length > 0 ? data[0].donors : [];
  const results2 = data.length > 1 ? data[1].donors : [];

  const getCaseCount = (condition) =>
    condition
      ? results1.length.toLocaleString()
      : results2.length.toLocaleString();

  return hasEnoughData
    ? [
        {
          key: `${name}-not-mutated`,
          value: (
            <div className="text-gdc-survival-0 font-content">
              S<sub>1</sub>
              {` (N = ${getCaseCount(results2.length > 0)})`}
              {["mutation", "gene"].includes(plotType) && (
                <span>
                  {" - "}
                  {name}
                  {" Not Mutated Cases"}
                </span>
              )}
            </div>
          ),
        },
        {
          key: `${name}-mutated`,
          value: (
            <div className="text-gdc-survival-1 font-content">
              S<sub>2</sub>
              {` (N = ${getCaseCount(results2.length === 0)})`}
              {["mutation", "gene"].includes(plotType) && (
                <span>
                  {" - "}
                  {name}
                  {` Mutated ${plotType === "gene" ? `(SSM/CNV)` : ``} Cases`}
                </span>
              )}
            </div>
          ),
        },
        ...(results2.length === 0
          ? [
              {
                key: `${name}-cannot-compare`,
                value: (
                  <div>
                    <span className="font-content">
                      Not enough data to compare
                    </span>
                  </div>
                ),
                style: {
                  width: "100%",
                  marginTop: 5,
                },
              },
            ]
          : []),
      ]
    : [
        {
          key: `${name}-not-enough-data`,
          value: (
            <span className="font-content">
              {plotType !== "cohortComparison"
                ? `${`Not enough survival data ${name ? `for ${name}` : ``}`}`
                : null}
            </span>
          ),
        },
      ];
};

export const buildManyLegend = (
  data: readonly SurvivalElement[],
  names: readonly string[],
  field: string,
  plotType: SurvivalPlotTypes,
) => {
  const hasEnoughDataOnSomeCurves = enoughDataOnSomeCurves(data);

  return hasEnoughDataOnSomeCurves
    ? data.map((r, i) => {
        return data.length === 0
          ? {
              key: `${names[i]}-cannot-compare`,
              style: {
                marginTop: 5,
                width: "100%",
              },
              value: (
                <div className="font-content">
                  <span>Not enough data to compare</span>
                </div>
              ),
            }
          : r.donors.length < MINIMUM_CASES
          ? {
              key: `${names[i]}-not-enough-data`,
              value: (
                <span
                  className={`text-gdc-survival-${i} font-content`}
                >{`Not enough survival data for ${names[i]}`}</span>
              ),
            }
          : {
              key: names[i],
              value: (
                <span className={`text-gdc-survival-${i} font-content`}>
                  S<sub>{i + 1}</sub>
                  {` (N = ${r.donors.length.toLocaleString()})`}
                  {plotType === SurvivalPlotTypes.categorical && (
                    <span>{` - ${names[i]}`}</span>
                  )}
                </span>
              ),
            };
      })
    : [
        {
          key: `${field}-not-enough-data`,
          value: (
            <span className="font-content">
              Not enough survival data for this facet
            </span>
          ),
        },
      ];
};
