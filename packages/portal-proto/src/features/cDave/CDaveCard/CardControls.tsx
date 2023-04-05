import { useState } from "react";
import { Button } from "@mantine/core";
import { MdArrowDropDown as DownIcon } from "react-icons/md";
import { Statistics } from "@gff/core";

import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import CategoricalBinningModal from "../CategoricalBinningModal";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";
import { ButtonTooltip } from "@/components/expandableTables/shared/ButtonTooltip";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";

interface CardControlsProps {
  readonly continuous: boolean;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly setCustomBinnedData:
    | ((bins: CategoricalBins) => void)
    | ((bins: NamedFromTo[] | CustomInterval) => void);
  readonly stats?: Statistics;
}

const CardControls: React.FC<CardControlsProps> = ({
  continuous,
  field,
  results,
  customBinnedData,
  setCustomBinnedData,
  stats,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between py-2">
        <div>
          <DropdownWithIcon
            RightIcon={<DownIcon size={20} />}
            TargetButtonChildren={"Create New Cohort"}
            disableTargetWidth={true}
            dropdownElements={[
              { title: "Only Selected Cases", disabled: true },
              { title: "Existing Cohort With Selected Cases", disabled: true },
              {
                title: "Existing Cohort Without Selected Cases",
                disabled: true,
              },
            ]}
            zIndex={100}
          />
          <ButtonTooltip label=" " comingSoon={true}>
            <Button className="bg-base-max text-primary border-primary ml-2">
              TSV
            </Button>
          </ButtonTooltip>
        </div>
        <DropdownWithIcon
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
            field={field}
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
            field={field}
            results={results}
            updateBins={setCustomBinnedData as (bins: CategoricalBins) => void}
            customBins={customBinnedData as CategoricalBins}
          />
        ))}
    </>
  );
};

export default CardControls;
