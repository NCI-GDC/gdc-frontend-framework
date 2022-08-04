import { useState } from "react";
import { pickBy, map, mapKeys } from "lodash";
import { Button, Modal, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { FaPencilAlt as PencilIcon } from "react-icons/fa";

const DEFAULT_GROUP_NAME_REGEX = /selected value \d+/;

type GroupedValues = Record<string, number | Record<string, number>>;

export const flattenGroups = (
  groupedValues: GroupedValues,
): Record<string, number> => {
  let flattenedValues = {};
  Object.entries(groupedValues).forEach(([k, v]) => {
    if (Number.isInteger(v)) {
      flattenedValues[k] = v;
    } else {
      flattenedValues = {
        ...flattenedValues,
        ...(v as Record<string, number>),
      };
    }
  });
  return flattenedValues;
};

const filterOutSelected = (values, selectedValues) => {
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
  readonly updateBins: (bin: Record<string, number>) => void;
}

const CategoricalBinningModal: React.FC<CategoricalBinningModalProps> = ({
  setModalOpen,
  field,
  results,
  updateBins,
}: CategoricalBinningModalProps) => {
  const [values, setValues] = useState<GroupedValues>(results);
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {},
  );
  const [hiddenValues, setHiddenValues] = useState<Record<string, number>>({});
  const [selectedHiddenValues, setSelectedHiddenValues] = useState<
    Record<string, number>
  >({});

  const group = () => {
    const existingGroup = Object.entries(values).find(
      ([k, v]) =>
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
      <div className="border-nci-gray-lightest border-solid border-1 mt-2">
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
            <Button onClick={group}>Group</Button>
            <Button
              onClick={() => {
                setValues({
                  ...filterOutSelected(values, selectedValues),
                  ...selectedValues,
                });
                setSelectedValues({});
              }}
            >
              Ungroup
            </Button>
            <Button onClick={hideValues}>Hide</Button>
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
                value={[k, value]}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
              />
            ),
          )}
        </ul>
      </div>
      <div className="border-nci-gray-lightest border-solid border-1 mt-2">
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
          {Object.entries(hiddenValues).map((value) => (
            <ListValue
              value={value}
              selectedValues={selectedHiddenValues}
              setSelectedValues={setSelectedHiddenValues}
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
  readonly value: [string, number];
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
}

const ListValue: React.FC<ListValueProps> = ({
  value,
  selectedValues,
  setSelectedValues,
}: ListValueProps) => {
  const updateSelectedValues = (value: [string, number]) => {
    if (Object.keys(selectedValues).includes(value[0])) {
      setSelectedValues(pickBy(selectedValues, (_, k) => k !== value[0]));
    } else {
      setSelectedValues({ ...selectedValues, [value[0]]: value[1] });
    }
  };

  return (
    <li
      onClick={() => updateSelectedValues(value)}
      className={`${
        Object.keys(selectedValues).includes(value[0])
          ? "bg-nci-yellow-lighter"
          : ""
      } cursor-pointer list-inside`}
      key={value[0]}
    >
      {value[0]} ({value[1].toLocaleString()})
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
    //console.log(form);
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
    <>
      {editMode ? (
        <TextInput
          ref={ref}
          className={"w-1/2"}
          {...form.getInputProps("group")}
        />
      ) : (
        <li
          onClick={() =>
            setSelectedValues({ ...selectedValues, ...groupValues })
          }
          className={`${
            Object.keys(groupValues).every((k) => selectedValues?.[k])
              ? "bg-nci-yellow-lighter"
              : undefined
          } cursor-pointer flex items-center`}
        >
          {groupName}{" "}
          <PencilIcon className="ml-2" onClick={() => setEditMode(true)} />
        </li>
      )}
      <ul className="list-disc">
        {Object.entries(groupValues).map((v) => (
          <ListValue
            value={v}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
        ))}
      </ul>
    </>
  );
};

export default CategoricalBinningModal;
