import { useState } from "react";
import { flatten } from "lodash";
import { Button } from "@mantine/core";
import { MdArrowDropDown as DownIcon } from "react-icons/md";
import { saveAs } from "file-saver";
import {
  Statistics,
  FilterSet,
  buildCohortGqlOperator,
  useCoreSelector,
  selectCurrentCohortFilters,
  joinFilters,
} from "@gff/core";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CasesCohortButtonFromFilters } from "@/features/cases/CasesView/CasesCohortButton";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { convertDateToString } from "@/utils/date";
import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import CategoricalBinningModal from "../CategoricalBinningModal";
import {
  CategoricalBins,
  ContinuousCustomBinnedData,
  CustomInterval,
  NamedFromTo,
  SelectedFacet,
} from "../types";
import { DEMO_COHORT_FILTERS } from "../constants";
import { isInterval } from "../utils";

interface CardControlsProps {
  readonly continuous: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly results: Record<string, number>;
  readonly yTotal: number;
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly setCustomBinnedData:
    | ((bins: CategoricalBins) => void)
    | ((bins: NamedFromTo[] | CustomInterval) => void);
  readonly selectedFacets: SelectedFacet[];
  readonly stats?: Statistics;
}

const CardControls: React.FC<CardControlsProps> = ({
  continuous,
  field,
  fieldName,
  results,
  yTotal,
  customBinnedData,
  setCustomBinnedData,
  selectedFacets,
  stats,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isDemoMode = useIsDemoApp();

  const downloadTSVFile = () => {
    const header = [fieldName, "# Cases"];
    const body = Object.entries(results).map(([field, count]) =>
      [
        field,
        `${count} (${
          yTotal === 0
            ? "0.00%"
            : (count / yTotal).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })
        })`,
      ].join("\t"),
    );
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${field.split(".").at(-1)}-table.${convertDateToString(new Date())}.tsv`,
    );
  };

  const cohortFilters = useCoreSelector((state) =>
    isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
  );

  const filters: FilterSet = {
    mode: "and",
    root: {
      [field]: continuous
        ? {
            operator: "or",
            operands: selectedFacets.map((facet) => {
              const customBin =
                customBinnedData &&
                !isInterval(customBinnedData as ContinuousCustomBinnedData)
                  ? (customBinnedData as NamedFromTo[]).find(
                      (bin) => bin.name === facet.value,
                    )
                  : undefined;
              const [from, to] = customBin
                ? [customBin.from, customBin.to]
                : facet.value.split(" to <");
              return {
                operator: "and",
                operands: [
                  {
                    field,
                    operator: ">=",
                    operand: from,
                  },
                  {
                    field,
                    operator: "<",
                    operand: to,
                  },
                ],
                field,
              };
            }),
          }
        : {
            operator: "includes",
            operands: customBinnedData
              ? flatten(
                  selectedFacets.map(
                    (facet) => customBinnedData[facet.value as string],
                  ),
                )
              : selectedFacets.map((facet) => facet.value),
            field,
          },
    },
  };

  return (
    <>
      <div className="flex justify-between gap-2 py-2">
        <div className="flex flex-wrap-reverse gap-2">
          <CasesCohortButtonFromFilters
            filters={
              selectedFacets.length === 0
                ? undefined
                : buildCohortGqlOperator(joinFilters(filters, cohortFilters))
            }
            numCases={
              selectedFacets.length === 0
                ? 0
                : selectedFacets
                    .map((facet) => facet.numCases)
                    .reduce((a, b) => a + b)
            }
          />
          <Button
            data-testid="button-tsv-cdave-card"
            className="bg-base-max text-primary border-primary"
            onClick={downloadTSVFile}
          >
            TSV
          </Button>
        </div>
        <div className="flex items-end">
          <DropdownWithIcon
            customDataTestId="button-customize-bins"
            RightIcon={<DownIcon size={20} />}
            TargetButtonChildren={"Customize Bins"}
            disableTargetWidth={true}
            dropdownElements={[
              { title: "Edit Bins", onClick: () => setModalOpen(true) },
              {
                title: "Reset to Default",
                disabled: customBinnedData === null,
                onClick: () => setCustomBinnedData(null),
              },
            ]}
            zIndex={100}
          />
        </div>
      </div>
      {modalOpen &&
        (continuous ? (
          <ContinuousBinningModal
            setModalOpen={setModalOpen}
            field={fieldName}
            stats={stats}
            updateBins={
              setCustomBinnedData as (
                bins: NamedFromTo[] | CustomInterval,
              ) => void
            }
            customBins={customBinnedData as NamedFromTo[] | CustomInterval}
          />
        ) : (
          <CategoricalBinningModal
            setModalOpen={setModalOpen}
            field={fieldName}
            results={results}
            updateBins={setCustomBinnedData as (bins: CategoricalBins) => void}
            customBins={customBinnedData as CategoricalBins}
          />
        ))}
    </>
  );
};

export default CardControls;
