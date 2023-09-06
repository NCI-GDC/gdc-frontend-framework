import { useState } from "react";
import { Button } from "@mantine/core";
import { MdArrowDropDown as DownIcon } from "react-icons/md";
import { saveAs } from "file-saver";
import { Statistics } from "@gff/core";
import { convertDateToString } from "@/utils/date";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import CategoricalBinningModal from "../CategoricalBinningModal";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";

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
  stats,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <>
      <div className="flex justify-between py-2">
        <div className="flex flex-wrap gap-2">
          <DropdownWithIcon
            customDataTestId="button-create-new-cohort"
            RightIcon={<DownIcon size={20} />}
            TargetButtonChildren={"Create New Cohort"}
            disableTargetWidth={true}
            dropdownElements={[
              { title: "Only Selected Cases (Coming Soon)", disabled: true },
              {
                title: "Existing Cohort With Selected Cases (Coming Soon)",
                disabled: true,
              },
              {
                title: "Existing Cohort Without Selected Cases (Coming Soon)",
                disabled: true,
              },
            ]}
            zIndex={100}
          />
          <Button
            data-testid="button-tsv-cdave-card"
            className="bg-base-max text-primary border-primary"
            onClick={downloadTSVFile}
          >
            TSV
          </Button>
        </div>
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
