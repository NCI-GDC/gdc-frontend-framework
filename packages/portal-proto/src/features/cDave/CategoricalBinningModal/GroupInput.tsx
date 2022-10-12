import { useEffect } from "react";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { TextInput } from "@mantine/core";
import { pickBy } from "lodash";
import { createKeyboardAccessibleFunction } from "src/utils";
import { FaPencilAlt as PencilIcon } from "react-icons/fa";
import ListValue from "./ListValue";

interface GroupInputProps {
  readonly groupName: string;
  readonly groupValues: Record<string, number>;
  // readonly otherGroups: string[];
  readonly updateGroupName: (oldName: string, newName: string) => void;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
  readonly editing: boolean;
  readonly setEditField: (field: string) => void;
  readonly checkOtherGroups: (groupName: string, newValue: string) => boolean;
}

const GroupInput: React.FC<GroupInputProps> = ({
  groupName,
  groupValues,
  updateGroupName,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
  editing,
  setEditField,
  checkOtherGroups,
}: GroupInputProps) => {
  // useEffect(() => {
  //   const updatedOtherGroups =  Object.keys(values).filter(x => x !== groupName);
  //   console.log(`otherGroups (useEffect) NEXT state ${groupName} `, updatedOtherGroups)
  //   setOtherGroups(updatedOtherGroups)
  //   setTimeout(() => {
  //     console.log(`otherGroups (useEffect) FINAL state for ${groupName}: `, otherGroups)
  //   }, 500)
  // },  [values, groupName])

  const doFormValidate = (value) => {
    return value === ""
      ? "Required field"
      : Object.keys(groupValues).includes(value)
      ? "The group name cannot be the same as the name of a value"
      : checkOtherGroups(groupName, value)
      ? `"${value}" already exists`
      : null;
  };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { group: groupName },
    validate: {
      group: doFormValidate,
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
    clearOtherValues();

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
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              ? "bg-accent-warm-light"
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

export default GroupInput;
