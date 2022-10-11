import { useState } from "react";
import { pickBy, mapKeys, isEqual } from "lodash";
import { Button, Modal } from "@mantine/core";
import { FaEyeSlash as HideIcon, FaEye as ShowIcon } from "react-icons/fa";
import {
  MdReplay as ResetIcon,
  MdHorizontalSplit as GroupIcon,
  MdOutlineHorizontalSplit as UngroupIcon,
} from "react-icons/md";
import { CategoricalBins } from "../types";
import FunctionButton from "@/components/FunctionButton";
import GroupInput from "./GroupInput";
import ListValue from "./ListValue";

const DEFAULT_GROUP_NAME_REGEX = /selected value \d+/;

const filterOutSelected = (
  values: CategoricalBins,
  selectedValues: Record<string, number>,
) => {
  const newValues = {};

  Object.entries(values).forEach(([key, value]) => {
    if (Number.isInteger(value) && !selectedValues?.[key]) {
      newValues[key] = value;
    } else {
      const groupValues = pickBy(
        value as Record<string, number>,
        (_, k) => !selectedValues?.[k],
      );
      if (Object.keys(groupValues).length > 0) {
        newValues[key] = groupValues;
      }
    }
  });
  return newValues;
};

const getHiddenValues = (
  results: CategoricalBins,
  customBins: CategoricalBins,
) => {
  const flattenedKeys = [];
  Object.entries(customBins).forEach(([key, value]) => {
    if (Number.isInteger(value)) {
      flattenedKeys.push(key);
    } else {
      flattenedKeys.push(...Object.keys(value));
    }
  });

  return pickBy(
    results,
    (v, k) => Number.isInteger(v) && !flattenedKeys.includes(k),
  ) as Record<string, number>;
};

const sortBins = (
  a: number | Record<string, number>,
  b: number | Record<string, number>,
) => {
  const compA = a instanceof Object ? Object.values(a) : [a];
  const compB = b instanceof Object ? Object.values(b) : [b];

  return Math.max(...compB) - Math.max(...compA);
};

interface CategoricalBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly customBins: CategoricalBins;
  readonly updateBins: (bin: CategoricalBins) => void;
}

const CategoricalBinningModal: React.FC<CategoricalBinningModalProps> = ({
  setModalOpen,
  field,
  results,
  customBins,
  updateBins,
}: CategoricalBinningModalProps) => {
  const [values, setValues] = useState<CategoricalBins>(
    customBins !== null ? customBins : results,
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {},
  );
  const [hiddenValues, setHiddenValues] = useState<Record<string, number>>(
    customBins !== null ? getHiddenValues(results, customBins) : {},
  );
  const [selectedHiddenValues, setSelectedHiddenValues] = useState<
    Record<string, number>
  >({});
  const [editField, setEditField] = useState(undefined);

  const handleGroupBtnClick = () => {
    setEditField(undefined);
    const existingGroups = Object.entries(values).filter(
      ([, v]) =>
        v instanceof Object &&
        Object.keys(v).every((subKey) => selectedValues?.[subKey]),
    );
    console.log(existingGroups);
    if (existingGroups.length === 1) {
      setValues({
        ...filterOutSelected(values, selectedValues),
        [existingGroups[0][0]]: {
          ...(existingGroups[0][1] as Record<string, number>),
          ...selectedValues,
        },
      });
    } else {
      const defaultNames = Object.entries(values).filter(
        ([k, v]) => v instanceof Object && k.match(DEFAULT_GROUP_NAME_REGEX),
      );

      setValues({
        ...filterOutSelected(values, selectedValues),
        [`selected value ${defaultNames.length + 1}`]: selectedValues,
      });

      setEditField(`selected value ${defaultNames.length + 1}`);
    }
    setSelectedValues({});
  };

  const updateGroupName = (oldName: string, newName: string) => {
    setValues(mapKeys(values, (_, key) => (key === oldName ? newName : key)));
  };

  const handleHideValuesBtnClick = () => {
    setEditField(undefined);
    setHiddenValues({
      ...hiddenValues,
      ...selectedValues,
    });

    setValues(filterOutSelected(values, selectedValues));
    setSelectedValues({});
  };

  const sortedValues = Object.entries(values).sort((a: any, b: any) =>
    sortBins(a[1], b[1]),
  );

  const handleSaveBtnClick = () => {
    () => {
      setEditField(undefined);
      if (!isEqual(values, results)) {
        updateBins(values);
      } else {
        updateBins(null);
      }
      setModalOpen(false);
    };
  };

  const handleRefeshClick = () => {
    setEditField(undefined);
    setHiddenValues({});
    setValues(results);
    setSelectedValues({});
  };

  const handleUngroupBtnClick = () => {
    setEditField(undefined);
    setValues({
      ...filterOutSelected(values, selectedValues),
      ...selectedValues,
    });
    setSelectedValues({});
  };

  const handleShowHiddenBtnClick = () => {
    setEditField(undefined);
    setValues({ ...values, ...selectedHiddenValues });
    setHiddenValues(
      pickBy(hiddenValues, (_, k) => selectedHiddenValues?.[k] === undefined),
    );
    setSelectedHiddenValues({});
  };

  const handleCancelBtnClick = () => setModalOpen(false);

  return (
    <Modal
      opened
      onClose={() => setModalOpen(false)}
      size={800}
      title={`Create Custom Bins: ${field}`}
      withinPortal={false}
      classNames={{ header: "text-xl" }}
    >
      <p>
        Organize values into groups of your choosing. Click <b>Save Bins</b> to
        update the analysis plots.
      </p>
      <div
        data-testid="cat-bin-modal-values"
        className="border-base-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-base-lightest p-2">
          <h3 className="font-bold my-auto">Values</h3>
          <div className="gap-1 flex">
            <FunctionButton
              onClick={handleRefeshClick}
              aria-label="reset groups"
            >
              <ResetIcon size={20} />
            </FunctionButton>
            <FunctionButton
              onClick={handleGroupBtnClick}
              disabled={
                Object.entries(values).filter(([k, v]) =>
                  v instanceof Object
                    ? Object.keys(v).some((k) => selectedValues?.[k])
                    : selectedValues?.[k],
                ).length < 2
              }
              leftIcon={<GroupIcon />}
            >
              Group
            </FunctionButton>
            <FunctionButton
              onClick={handleUngroupBtnClick}
              disabled={
                !Object.entries(values).some(
                  ([, v]) =>
                    v instanceof Object &&
                    Object.keys(v).some(
                      (groupedValue) => selectedValues?.[groupedValue],
                    ),
                )
              }
              leftIcon={<UngroupIcon />}
            >
              Ungroup
            </FunctionButton>
            <FunctionButton
              onClick={handleHideValuesBtnClick}
              disabled={Object.keys(selectedValues).length === 0}
              leftIcon={<HideIcon />}
            >
              Hide
            </FunctionButton>
          </div>
        </div>
        <ul className="p-2">
          {sortedValues
            .sort((a: any, b: any) => sortBins(a[1], b[1]))
            .map(([k, value], idx) =>
              value instanceof Object ? (
                <GroupInput
                  groupName={k}
                  groupValues={value}
                  otherGroups={sortedValues
                    .map((v) => v[0])
                    .filter((_, i) => idx !== i)}
                  updateGroupName={updateGroupName}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                  clearOtherValues={() => setSelectedHiddenValues({})}
                  editing={k === editField}
                  setEditField={setEditField}
                  key={k}
                />
              ) : (
                <ListValue
                  name={k}
                  count={value}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                  clearOtherValues={() => setSelectedHiddenValues({})}
                  key={k}
                />
              ),
            )}
        </ul>
      </div>
      <div
        data-testid="cat-bin-modal-hidden-values"
        className="border-base-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-base-lightest p-2">
          <h3 className="font-bold my-auto">Hidden Values</h3>
          <FunctionButton
            disabled={Object.keys(selectedHiddenValues).length === 0}
            onClick={handleShowHiddenBtnClick}
            leftIcon={<ShowIcon />}
          >
            Show
          </FunctionButton>
        </div>
        <ul className="min-h-[100px] p-2">
          {Object.entries(hiddenValues)
            .sort((a: any, b: any) => b[1] - a[1])
            .map(([k, v]) => (
              <ListValue
                name={k}
                count={v}
                selectedValues={selectedHiddenValues}
                setSelectedValues={setSelectedHiddenValues}
                clearOtherValues={() => setSelectedValues({})}
                key={k}
              />
            ))}
        </ul>
      </div>
      <div className="mt-2 flex gap-2 justify-end">
        <Button onClick={handleCancelBtnClick} className="bg-primary-darkest">
          Cancel
        </Button>
        <Button className="bg-primary-darkest" onClick={handleSaveBtnClick}>
          Save Bins
        </Button>
      </div>
    </Modal>
  );
};

export default CategoricalBinningModal;
