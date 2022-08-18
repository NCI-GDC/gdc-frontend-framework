import { useEffect, useState } from "react";
import { pickBy, mapKeys, isEqual, fromPairs } from "lodash";
import { Button, Modal, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  FaPencilAlt as PencilIcon,
  FaEyeSlash as HideIcon,
  FaEye as ShowIcon,
} from "react-icons/fa";
import {
  MdReplay as ResetIcon,
  MdHorizontalSplit as GroupIcon,
  MdOutlineHorizontalSplit as UngroupIcon,
} from "react-icons/md";
import { createKeyboardAccessibleFunction } from "src/utils";
import { CategoricalBins } from "./types";

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

  const group = () => {
    setEditField(undefined);

    const existingGroups = Object.entries(values).filter(
      ([, v]) =>
        v instanceof Object &&
        Object.keys(v).every((subKey) => selectedValues?.[subKey]),
    );

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

  const hideValues = () => {
    setEditField(undefined);
    setHiddenValues({
      ...hiddenValues,
      ...selectedValues,
    });

    setValues(filterOutSelected(values, selectedValues));

    setSelectedValues({});
  };

  const sortedValues = Object.entries(values).sort((a, b) =>
    sortBins(a[1], b[1]),
  );

  return (
    <Modal
      opened
      onClose={() => setModalOpen(false)}
      size={800}
      title={`Create Custom Bins: ${field}`}
      withinPortal={false}
    >
      <p>
        Organize values into groups of your choosing. Click <b>Save Bins</b> to
        update the analysis plots.
      </p>
      <div
        data-testid="cat-bin-modal-values"
        className="border-nci-gray-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-nci-gray-lightest p-2">
          <h3 className="font-bold my-auto">Values</h3>
          <div className="gap-1 flex">
            <Button
              onClick={() => {
                setEditField(undefined);
                setHiddenValues({});
                setValues(results);
                setSelectedValues({});
                updateBins(null);
              }}
              aria-label="reset groups"
              className="bg-nci-gray"
            >
              <ResetIcon size={20} />
            </Button>
            <Button
              onClick={group}
              disabled={
                Object.entries(values).filter(([k, v]) =>
                  v instanceof Object
                    ? Object.keys(v).some((k) => selectedValues?.[k])
                    : selectedValues?.[k],
                ).length < 2
              }
              leftIcon={<GroupIcon />}
              className="bg-nci-gray"
            >
              Group
            </Button>
            <Button
              onClick={() => {
                setEditField(undefined);
                setValues({
                  ...filterOutSelected(values, selectedValues),
                  ...selectedValues,
                });
                setSelectedValues({});
              }}
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
              className="bg-nci-gray"
            >
              Ungroup
            </Button>
            <Button
              onClick={hideValues}
              disabled={Object.keys(selectedValues).length === 0}
              leftIcon={<HideIcon />}
              className="bg-nci-gray"
            >
              Hide
            </Button>
          </div>
        </div>
        <ul className="p-2">
          {sortedValues
            .sort((a, b) => sortBins(a[1], b[1]))
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
        className="border-nci-gray-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-nci-gray-lightest p-2">
          <h3 className="font-bold my-auto">Hidden Values</h3>
          <Button
            disabled={Object.keys(selectedHiddenValues).length === 0}
            onClick={() => {
              setEditField(undefined);
              setValues({ ...values, ...selectedHiddenValues });
              setHiddenValues(
                pickBy(
                  hiddenValues,
                  (_, k) => selectedHiddenValues?.[k] === undefined,
                ),
              );
              setSelectedHiddenValues({});
            }}
            leftIcon={<ShowIcon />}
            className="bg-nci-gray"
          >
            Show
          </Button>
        </div>
        <ul className="min-h-[100px] p-2">
          {Object.entries(hiddenValues)
            .sort((a, b) => b[1] - a[1])
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
        <Button
          onClick={() => setModalOpen(false)}
          className="bg-nci-blue-darkest"
        >
          Cancel
        </Button>
        <Button
          className="bg-nci-blue-darkest"
          onClick={() => {
            setEditField(undefined);
            if (!isEqual(values, results)) {
              updateBins(values);
            }
            setModalOpen(false);
          }}
        >
          Save Bins
        </Button>
      </div>
    </Modal>
  );
};

interface ListValueProps {
  readonly name: string;
  readonly count: number;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
}

const ListValue: React.FC<ListValueProps> = ({
  name,
  count,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
}: ListValueProps) => {
  const updateSelectedValues = (name: string, count: number) => {
    if (Object.keys(selectedValues).includes(name)) {
      setSelectedValues(pickBy(selectedValues, (_, k) => k !== name));
    } else {
      setSelectedValues({ ...selectedValues, [name]: count });
    }
  };

  return (
    <li
      className={`${
        selectedValues?.[name] ? "bg-nci-yellow-lighter" : ""
      } cursor-pointer list-inside`}
    >
      <div
        onClick={() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        }}
        onKeyPress={createKeyboardAccessibleFunction(() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        })}
        tabIndex={0}
        role="button"
        className="inline"
      >
        {name} ({count.toLocaleString()})
      </div>
    </li>
  );
};

interface GroupInputProps {
  readonly groupName: string;
  readonly groupValues: Record<string, number>;
  readonly otherGroups: string[];
  readonly updateGroupName: (oldName: string, newName: string) => void;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
  readonly editing: boolean;
  readonly setEditField: (field: string) => void;
}

const GroupInput: React.FC<GroupInputProps> = ({
  groupName,
  groupValues,
  otherGroups,
  updateGroupName,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
  editing,
  setEditField,
}: GroupInputProps) => {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: { group: groupName },
    validate: {
      group: (value) =>
        value === ""
          ? "Required field"
          : Object.keys(groupValues).includes(value)
          ? "The group name cannot be the same as the name of a value"
          : otherGroups.includes(value)
          ? `"${value}" already exists`
          : null,
    },
  });

  const closeInput = () => {
    if (Object.keys(form.errors).length === 0) {
      updateGroupName(groupName, form.values.group);
      setEditField(undefined);
    }
  };

  const ref = useClickOutside(() => {
    closeInput();
  });

  const updateSelectedValues = () => {
    if (Object.keys(groupValues).every((k) => selectedValues?.[k])) {
      setSelectedValues(
        pickBy(selectedValues, (_, k) => !Object.keys(groupValues).includes(k)),
      );
    } else {
      setSelectedValues({ ...selectedValues, ...groupValues });
    }
  };

  useEffect(() => {
    if (!editing) {
      form.clearErrors();
      form.reset();
    }
  }, [editing]);

  return (
    <li>
      {editing ? (
        <TextInput
          ref={ref}
          className={"w-1/2"}
          onKeyPress={createKeyboardAccessibleFunction(closeInput)}
          {...form.getInputProps("group")}
        />
      ) : (
        <div
          onClick={updateSelectedValues}
          onKeyPress={createKeyboardAccessibleFunction(updateSelectedValues)}
          tabIndex={0}
          role="button"
          className={`${
            Object.keys(groupValues).every((k) => selectedValues?.[k])
              ? "bg-nci-yellow-lighter"
              : ""
          } cursor-pointer flex items-center`}
        >
          {groupName}{" "}
          <PencilIcon
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setEditField(groupName);
            }}
            aria-label="edit group name"
          />
        </div>
      )}
      <ul className="list-disc">
        {Object.entries(groupValues)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => (
            <ListValue
              name={k}
              count={v}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              clearOtherValues={clearOtherValues}
              key={k}
            />
          ))}
      </ul>
    </li>
  );
};

export default CategoricalBinningModal;
