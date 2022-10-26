import { useState } from "react";
import { Button, Menu } from "@mantine/core";
import { MdArrowDropDown as DownIcon } from "react-icons/md";
import {
  selectFacetDefinitionByName,
  Statistics,
  useCoreSelector,
} from "@gff/core";

import ContinuousBinningModal from "../ContinuousBinningModal/ContinuousBinningModal";
import CategoricalBinningModal from "../CategoricalBinningModal";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";

interface CardControlsProps {
  readonly continuous: boolean;
  readonly fieldName: string;
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
  fieldName,
  field,
  results,
  customBinnedData,
  setCustomBinnedData,
  stats,
}: CardControlsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const facet = useCoreSelector((state) =>
    selectFacetDefinitionByName(state, `cases.${field}`),
  );
  return (
    <>
      <div className="flex justify-between p-2">
        <div>
          <Menu
            classNames={{
              label: "font-heading",
              item: "data-hovered:bg-base-lighter data-hovered:text-base-contrast-lighter",
            }}
          >
            <Menu.Target>
              <Button
                rightIcon={<DownIcon size={20} />}
                className="bg-base-max text-base-content-darker border-base border-base-lighter"
              >
                Select Action
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled>Save as a new cohort</Menu.Item>
              <Menu.Item disabled>Add to cohort</Menu.Item>
              <Menu.Item disabled>Remove from cohort</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button className="bg-base-max text-base-content-darker border-base border-base-lighter ml-2">
            TSV
          </Button>
        </div>
        <Menu
          classNames={{
            label: "font-heading",
            item: "data-hovered:bg-base-lighter data-hovered:text-base-contrast-lighter",
          }}
        >
          <Menu.Target>
            <Button
              rightIcon={<DownIcon size={20} />}
              className="bg-base-max text-base-content-darker border-base border-base-lighter"
            >
              Customize Bins
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => setModalOpen(true)}>Edit Bins</Menu.Item>
            <Menu.Item
              disabled={customBinnedData === null}
              onClick={() => setCustomBinnedData(null)}
            >
              Reset to Default
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      {modalOpen &&
        (continuous ? (
          <ContinuousBinningModal
            setModalOpen={setModalOpen}
            field={field}
            inputRange={facet.range}
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
