import { useState } from "react";
import { pickBy, mapKeys } from "lodash";
import { Button, Modal, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { FaPencilAlt as PencilIcon } from "react-icons/fa";
import { createKeyboardAccessibleFunction } from "src/utils";

const DEFAULT_GROUP_NAME_REGEX = /selected value \d+/;

type GroupedValues = Record<string, number | Record<string, number>>;

const filterOutSelected = (
  values: GroupedValues,
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

interface CategoricalBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly customBins: Record<string, number>;
  readonly updateBins: (bin: GroupedValues) => void;
}

const CategoricalBinningModal: React.FC<CategoricalBinningModalProps> = ({
  setModalOpen,
  field,
  results,
  customBins,
  updateBins,
}: CategoricalBinningModalProps) => {
  const [values, setValues] = useState<GroupedValues>(
    Object.keys(customBins).length > 0 ? customBins : results,
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {},
  );
  const [hiddenValues, setHiddenValues] = useState<Record<string, number>>({});
  const [selectedHiddenValues, setSelectedHiddenValues] = useState<
    Record<string, number>
  >({});

  const group = () => {
    const existingGroup = Object.entries(values).find(
      ([, v]) =>
        v instanceof Object &&
        Object.keys(v).every((subKey) => selectedValues?.[subKey]),
    );

    if (existingGroup) {
      setValues({
        ...filterOutSelected(values, selectedValues),
        [existingGroup[0]]: {
          ...(existingGroup[1] as Record<string, number>),
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
      } as GroupedValues);
    }
    setSelectedValues({});
  };

  const updateGroupName = (oldName: string, newName: string) => {
    setValues(mapKeys(values, (_, key) => (key === oldName ? newName : key)));
  };

  const hideValues = () => {
    setHiddenValues({
      ...hiddenValues,
      ...selectedValues,
    });

    setValues(filterOutSelected(values, selectedValues));

    setSelectedValues({});
  };

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
                setHiddenValues({});
                setValues(results);
                setSelectedValues({});
              }}
            >
              Reset
            </Button>
            <Button
              onClick={group}
              disabled={Object.keys(selectedValues).length < 2}
            >
              Group
            </Button>
            <Button
              onClick={() => {
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
            >
              Ungroup
            </Button>
            <Button
              onClick={hideValues}
              disabled={Object.keys(selectedValues).length === 0}
            >
              Hide
            </Button>
          </div>
        </div>
        <ul className="p-2">
          {Object.entries(values).map(([k, value]) =>
            value instanceof Object ? (
              <GroupInput
                groupName={k}
                groupValues={value}
                otherGroups={Object.keys(values)}
                updateGroupName={updateGroupName}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                key={k}
              />
            ) : (
              <ListValue
                name={k}
                count={value}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
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
              setValues({ ...values, ...selectedHiddenValues });
              setHiddenValues(
                pickBy(
                  hiddenValues,
                  (_, k) => !Object.keys(selectedHiddenValues).includes(k),
                ),
              );
              setSelectedHiddenValues({});
            }}
          >
            Show
          </Button>
        </div>
        <ul className="min-h-[100px] p-2">
          {Object.entries(hiddenValues).map(([k, v]) => (
            <ListValue
              name={k}
              count={v}
              selectedValues={selectedHiddenValues}
              setSelectedValues={setSelectedHiddenValues}
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
            updateBins(values);
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
}

const ListValue: React.FC<ListValueProps> = ({
  name,
  count,
  selectedValues,
  setSelectedValues,
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
      onClick={() => updateSelectedValues(name, count)}
      onKeyPress={createKeyboardAccessibleFunction(() =>
        updateSelectedValues(name, count),
      )}
      tabIndex={0}
      className={`${
        selectedValues?.[name] ? "bg-nci-yellow-lighter" : ""
      } cursor-pointer list-inside`}
    >
      {name} ({count.toLocaleString()})
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
}

const GroupInput: React.FC<GroupInputProps> = ({
  groupName,
  groupValues,
  otherGroups,
  updateGroupName,
  selectedValues,
  setSelectedValues,
}: GroupInputProps) => {
  const [editMode, setEditMode] = useState(true);

  const ref = useClickOutside(() => {
    form.validate();
    if (Object.keys(form.errors).length === 0) {
      updateGroupName(groupName, form.values.group);
      setEditMode(false);
    }
  });

  const form = useForm({
    initialValues: { group: groupName },
    validate: {
      group: (value) =>
        value === ""
          ? "Required field"
          : Object.keys(groupValues).includes(value)
          ? "The group name cannot be the same as the name of the values"
          : otherGroups.includes(value)
          ? `${value} already exists`
          : null,
    },
  });

  return (
    <li
      onClick={() => setSelectedValues({ ...selectedValues, ...groupValues })}
      onKeyPress={createKeyboardAccessibleFunction(() =>
        setSelectedValues({ ...selectedValues, ...groupValues }),
      )}
      tabIndex={0}
      className={`${
        Object.keys(groupValues).every((k) => selectedValues?.[k])
          ? "bg-nci-yellow-lighter"
          : undefined
      } cursor-pointer flex items-center`}
    >
      {editMode ? (
        <TextInput
          ref={ref}
          className={"w-1/2"}
          {...form.getInputProps("group")}
        />
      ) : (
        <>
          {groupName}{" "}
          <PencilIcon className="ml-2" onClick={() => setEditMode(true)} />
        </>
      )}
      <ul className="list-disc">
        {Object.entries(groupValues).map(([k, v]) => (
          <ListValue
            name={k}
            count={v}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            key={k}
          />
        ))}
      </ul>
    </li>
  );
};

export default CategoricalBinningModal;
