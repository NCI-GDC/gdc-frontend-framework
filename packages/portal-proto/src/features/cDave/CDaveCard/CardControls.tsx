import { flatten } from "lodash";
import { Button } from "@mantine/core";
import { MdArrowDropDown as DownIcon } from "react-icons/md";
import { saveAs } from "file-saver";
import {
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
import {
  CategoricalBins,
  ContinuousCustomBinnedData,
  CustomInterval,
  DisplayData,
  NamedFromTo,
  SelectedFacet,
} from "../types";
import { DEMO_COHORT_FILTERS } from "../constants";
import { formatPercent, isInterval, useDataDimension } from "../utils";

interface CardControlsProps {
  readonly continuous: boolean;
  readonly field: string;
  readonly fieldName: string;
  readonly displayedData: DisplayData;
  readonly yTotal: number;
  readonly setBinningModalOpen: (open: boolean) => void;
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly setCustomBinnedData:
    | ((bins: CategoricalBins) => void)
    | ((bins: NamedFromTo[] | CustomInterval) => void);
  readonly selectedFacets: SelectedFacet[];
  readonly dataDimension?: string;
}

const CardControls: React.FC<CardControlsProps> = ({
  continuous,
  field,
  fieldName,
  displayedData,
  yTotal,
  setBinningModalOpen,
  customBinnedData,
  setCustomBinnedData,
  selectedFacets,
  dataDimension,
}: CardControlsProps) => {
  const isDemoMode = useIsDemoApp();
  const displayDataDimension = useDataDimension(field);

  const downloadTSVFile = () => {
    const header = [
      displayDataDimension ? `${fieldName} (${dataDimension})` : fieldName,
      "# Cases",
    ];
    const body = displayedData.map(({ displayName, count }) =>
      [displayName, `${count} (${formatPercent(count, yTotal)})`].join("\t"),
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
                : facet.value.split("-");
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
              { title: "Edit Bins", onClick: () => setBinningModalOpen(true) },
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
    </>
  );
};

export default CardControls;
