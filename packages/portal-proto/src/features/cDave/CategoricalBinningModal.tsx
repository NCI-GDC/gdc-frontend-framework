import { useEffect, useState, useCallback, useMemo } from "react";
import { pickBy, mapKeys, isEqual, isEmpty } from "lodash";
import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { createKeyboardAccessibleFunction } from "src/utils";
import { CategoricalBins } from "./types";
import FunctionButton from "@/components/FunctionButton";
import {
  AlertIcon,
  GroupIcon,
  HideIcon,
  PencilIcon,
  ReplayIcon,
  ShowIcon,
  UngroupIcon,
} from "@/utils/icons";
import { useDeepCompareCallback } from "use-deep-compare";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

const DEFAULT_GROUP_NAME_PREFIX = "selected value ";

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
  readonly results: CategoricalBins;
  readonly customBins: CategoricalBins;
  readonly updateBins: (bin: CategoricalBins) => void;
  readonly opened: boolean;
}

const CategoricalBinningModal: React.FC<CategoricalBinningModalProps> = ({
  setModalOpen,
  field,
  results,
  customBins,
  updateBins,
  opened,
}: CategoricalBinningModalProps) => {
  const getInitialState = useDeepCompareCallback(
    () => ({
      values: customBins !== null ? customBins : results,
      selectedValues: {},
      hiddenValues:
        customBins !== null ? getHiddenValues(results, customBins) : {},
      selectedHiddenValues: {},
      editField: undefined,
      errorMessage: "",
    }),
    [customBins, results],
  );

  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    if (opened) {
      setState(getInitialState());
    }
  }, [opened, getInitialState]);

  const {
    values,
    selectedValues,
    hiddenValues,
    selectedHiddenValues,
    editField,
    errorMessage,
  } = state;

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const group = useCallback(() => {
    updateState({ editField: undefined });

    const existingGroups = Object.entries(values).filter(
      ([, v]) =>
        v instanceof Object &&
        Object.keys(v).every((subKey) => selectedValues?.[subKey]),
    );

    if (existingGroups.length === 1) {
      updateState({
        values: {
          ...filterOutSelected(values, selectedValues),
          [existingGroups[0][0]]: {
            ...(existingGroups[0][1] as Record<string, number>),
            ...selectedValues,
          },
        },
        selectedValues: {},
        errorMessage: "",
      });
    } else {
      const valueCount = Object.keys(values).length;
      let index = 1;

      for (; index <= valueCount; index++) {
        if (!values[DEFAULT_GROUP_NAME_PREFIX + index]) {
          break;
        }
      }

      const newGroupName = DEFAULT_GROUP_NAME_PREFIX + index;

      updateState({
        values: {
          ...filterOutSelected(values, selectedValues),
          [newGroupName]: selectedValues,
        },
        selectedValues: {},
        editField: newGroupName,
        errorMessage: "",
      });
    }
  }, [values, selectedValues, updateState]);

  const updateGroupName = useCallback(
    (oldName: string, newName: string) => {
      updateState({
        values: mapKeys(values, (_, key) => (key === oldName ? newName : key)),
        errorMessage: "",
      });
    },
    [values, updateState],
  );

  const hideValues = useCallback(() => {
    const restValues = filterOutSelected(values, selectedValues);

    if (isEmpty(restValues)) {
      updateState({ errorMessage: "At least one bin must be displayed." });
      return;
    }

    updateState({
      errorMessage: "",
      editField: undefined,
      hiddenValues: {
        ...hiddenValues,
        ...selectedValues,
      },
      values: restValues,
      selectedValues: {},
    });
  }, [values, selectedValues, hiddenValues, updateState]);

  const resetToDefault = useCallback(() => {
    updateState({
      editField: undefined,
      hiddenValues: {},
      values: results,
      selectedValues: {},
      selectedHiddenValues: {},
      errorMessage: "",
    });
  }, [results, updateState]);

  const ungroupValues = useCallback(() => {
    updateState({
      editField: undefined,
      values: {
        ...filterOutSelected(values, selectedValues),
        ...selectedValues,
      },
      selectedValues: {},
    });
  }, [values, selectedValues, updateState]);

  const showHiddenValues = useCallback(() => {
    updateState({
      editField: undefined,
      values: { ...values, ...selectedHiddenValues },
      hiddenValues: pickBy(
        hiddenValues,
        (_, k) => selectedHiddenValues?.[k] === undefined,
      ),
      selectedHiddenValues: {},
    });
  }, [values, selectedHiddenValues, hiddenValues, updateState]);

  const sortedValues = useMemo(
    () => Object.entries(values).sort((a, b) => sortBins(a[1], b[1])),
    [values],
  );

  const sortedHiddenValues = useMemo(
    () => Object.entries(hiddenValues).sort((a, b) => b[1] - a[1]),
    [hiddenValues],
  );

  const isResetDisabled = useMemo(
    () => isEqual(results, values) && isEmpty(hiddenValues),
    [results, values, hiddenValues],
  );

  const isGroupDisabled = useMemo(
    () =>
      Object.entries(values).filter(([k, v]) =>
        v instanceof Object
          ? Object.keys(v).some((k) => selectedValues?.[k])
          : selectedValues?.[k],
      ).length < 2,
    [values, selectedValues],
  );

  const isUngroupDisabled = useMemo(
    () =>
      !Object.entries(values).some(
        ([, v]) =>
          v instanceof Object &&
          Object.keys(v).some((groupedValue) => selectedValues?.[groupedValue]),
      ),
    [values, selectedValues],
  );

  const handleSave = useCallback(() => {
    updateState({ editField: undefined });
    if (!isEqual(values, results) || !isEmpty(hiddenValues)) {
      updateBins(values);
    } else {
      updateBins(null);
    }
    setModalOpen(false);
  }, [values, results, hiddenValues, updateBins, setModalOpen, updateState]);

  return (
    <Modal
      opened={opened}
      onClose={() => setModalOpen(false)}
      size={900}
      title={`Create Custom Bins: ${field}`}
    >
      <div className="px-4 pb-4">
        <p className="mb-2 text-sm font-content">
          Organize values into groups of your choosing. Click <b>Save Bins</b>{" "}
          to update the analysis plots.
        </p>
        <div data-testid="cat-bin-modal-values" className="mt-2">
          <div className="flex justify-between py-2">
            <h3 className="font-bold mt-auto">Values</h3>
            <div className="gap-1 flex">
              <FunctionButton
                data-testid="button-custom-bins-reset-group"
                onClick={resetToDefault}
                disabled={isResetDisabled}
                aria-label="reset groups"
              >
                <ReplayIcon size={20} />
              </FunctionButton>
              <FunctionButton
                data-testid="button-custom-bins-group-values"
                onClick={group}
                classNames={{
                  section: "mr-1",
                }}
                disabled={isGroupDisabled}
                leftSection={<GroupIcon aria-hidden="true" />}
              >
                Group
              </FunctionButton>
              <FunctionButton
                data-testid="button-custom-bins-ungroup-values"
                onClick={ungroupValues}
                disabled={isUngroupDisabled}
                classNames={{
                  section: "mr-1",
                }}
                leftSection={<UngroupIcon aria-hidden="true" />}
              >
                Ungroup
              </FunctionButton>
              <FunctionButton
                data-testid="button-custom-bins-hide-values"
                classNames={{
                  section: "mr-1",
                }}
                onClick={hideValues}
                disabled={Object.keys(selectedValues).length === 0}
                leftSection={<HideIcon aria-hidden="true" />}
              >
                Hide
              </FunctionButton>
            </div>
          </div>
          <ul className="border-1 border-base-light rounded p-2 max-h-[200px] overflow-y-auto">
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
                    setSelectedValues={(newSelected) =>
                      updateState({ selectedValues: newSelected })
                    }
                    clearOtherValues={() =>
                      updateState({ selectedHiddenValues: {} })
                    }
                    editing={k === editField}
                    setEditField={(field) => updateState({ editField: field })}
                    key={k}
                  />
                ) : (
                  <ListValue
                    name={k}
                    count={value}
                    selectedValues={selectedValues}
                    setSelectedValues={(newSelected) =>
                      updateState({ selectedValues: newSelected })
                    }
                    clearOtherValues={() =>
                      updateState({ selectedHiddenValues: {} })
                    }
                    key={k}
                  />
                ),
              )}
          </ul>
        </div>
        <div data-testid="cat-bin-modal-hidden-values" className="mt-2">
          <div className="flex justify-between py-2">
            <h3 className="font-bold mt-auto">Hidden Values</h3>
            <FunctionButton
              data-testid="button-custom-bins-show-values"
              disabled={Object.keys(selectedHiddenValues).length === 0}
              classNames={{
                section: "mr-1",
              }}
              onClick={showHiddenValues}
              leftSection={<ShowIcon aria-hidden="true" />}
            >
              Show
            </FunctionButton>
          </div>
          <ul className="border-1 border-base-light rounded p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
            {sortedHiddenValues.map(([k, v]) => (
              <ListValue
                name={k}
                count={v}
                selectedValues={selectedHiddenValues}
                setSelectedValues={(newSelected) =>
                  updateState({ selectedHiddenValues: newSelected })
                }
                clearOtherValues={() => updateState({ selectedValues: {} })}
                key={k}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2 flex gap-2 justify-end bg-base-lightest p-4">
        {errorMessage && (
          <Group className="grow" gap={8} justify="center">
            <AlertIcon color="red" />
            <Text c="red">{errorMessage}</Text>
          </Group>
        )}
        <Group gap={8}>
          <Button
            data-testid="button-custom-bins-cancel"
            onClick={() => setModalOpen(false)}
            variant="outline"
            className="bg-base-max"
          >
            Cancel
          </Button>
          <DarkFunctionButton
            data-testid="button-custom-bins-save"
            className="bg-primary-darkest"
            onClick={handleSave}
          >
            Save Bins
          </DarkFunctionButton>
        </Group>
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
  const updateSelectedValues = useCallback(
    (name: string, count: number) => {
      if (Object.keys(selectedValues).includes(name)) {
        setSelectedValues(pickBy(selectedValues, (_, k) => k !== name));
      } else {
        setSelectedValues({ ...selectedValues, [name]: count });
      }
    },
    [selectedValues, setSelectedValues],
  );

  const handleClick = useCallback(() => {
    updateSelectedValues(name, count);
    clearOtherValues();
  }, [updateSelectedValues, name, count, clearOtherValues]);

  return (
    <li
      className={`${
        selectedValues?.[name] ? "bg-accent-warm-light" : ""
      } cursor-pointer list-inside font-content`}
    >
      <div
        onClick={handleClick}
        onKeyDown={createKeyboardAccessibleFunction(handleClick)}
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

const GroupInput = ({
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
            : otherGroups.includes(value.trim())
              ? `"${value}" already exists`
              : null,
    },
  });

  const closeInput = useCallback(() => {
    if (Object.keys(form.errors).length === 0) {
      updateGroupName(groupName, form.values.group.trim());
      setEditField(undefined);
    }
  }, [
    form.errors,
    form.values.group,
    updateGroupName,
    groupName,
    setEditField,
  ]);

  const ref = useClickOutside(() => {
    closeInput();
  });

  const updateSelectedValues = useCallback(() => {
    clearOtherValues();

    if (Object.keys(groupValues).every((k) => selectedValues?.[k])) {
      setSelectedValues(
        pickBy(selectedValues, (_, k) => !Object.keys(groupValues).includes(k)),
      );
    } else {
      setSelectedValues({ ...selectedValues, ...groupValues });
    }
  }, [groupValues, selectedValues, setSelectedValues, clearOtherValues]);

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation();
      setEditField(groupName);
    },
    [setEditField, groupName],
  );

  const isSelected = useMemo(
    () => Object.keys(groupValues).every((k) => selectedValues?.[k]),
    [groupValues, selectedValues],
  );

  const sortedGroupValues = useMemo(
    () => Object.entries(groupValues).sort((a, b) => b[1] - a[1]),
    [groupValues],
  );

  useEffect(() => {
    if (!editing) {
      form.clearErrors();
      form.reset();
    }
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  return (
    <li className="font-content">
      {editing ? (
        <TextInput
          data-testid="textbox-custom-bin-name"
          ref={ref}
          className={"w-1/2"}
          onKeyDown={createKeyboardAccessibleFunction(closeInput)}
          {...form.getInputProps("group")}
          maxLength={100}
        />
      ) : (
        <div
          onClick={updateSelectedValues}
          onKeyDown={createKeyboardAccessibleFunction(updateSelectedValues)}
          tabIndex={0}
          role="button"
          className={`${
            isSelected ? "bg-accent-warm-light" : ""
          } cursor-pointer flex items-center`}
        >
          {groupName}{" "}
          <PencilIcon
            data-testid="button-custom-bins-edit-group-name"
            className="ml-2 shrink-0"
            onClick={handleEdit}
            aria-label="edit group name"
          />
        </div>
      )}
      <ul className="list-disc">
        {sortedGroupValues.map(([k, v]) => (
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
