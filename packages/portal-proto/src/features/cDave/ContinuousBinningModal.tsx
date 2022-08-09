import { useState } from "react";
import { Statistics } from "@gff/core";
import { Button, Divider, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdReplay as ResetIcon } from "react-icons/md";

interface ContinuousBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly stats: Statistics;
}

const ContinuousBinningModal: React.FC<ContinuousBinningModalProps> = ({
  setModalOpen,
  field,
  stats,
}: ContinuousBinningModalProps) => {
  const binSize = (stats.max + 1 - stats.min) / 4;
  const [binMethod, setBinMethod] = useState<"interval" | "ranges">("interval");

  const validateNumberInput = (value: string) => {
    if (value === "") {
      return "Required field";
    }

    if (Number.isNaN(Number(value))) {
      return `${value} is not a valid number`;
    }

    /*
    if (value !==0 && !Number.isInteger(value) && value.split(".")?.[1].length > 2) {
      return "Use up to 2 decimal places";
    }
    */

    return null;
  };

  const validateInput = (value, min, max) => {
    const validNumberError = validateNumberInput(value);

    if (validNumberError) {
      return validNumberError;
    }

    if (Number(value) <= 0) {
      return "Must be greater than 0";
    }

    if (Number(value) > Number(max) - Number(min)) {
      return `Must be less than or equal to ${max - min}`;
    }

    return null;
  };

  const validateMinInput = (value, max) => {
    const validNumberError = validateNumberInput(value);

    if (validNumberError) {
      return validNumberError;
    }

    if (Number(value) > Number(max)) {
      return `Must be less than ${max}`;
    }

    return null;
  };

  const validateMaxInput = (value, min) => {
    const validNumberError = validateNumberInput(value);

    if (validNumberError) {
      return validNumberError;
    }

    if (Number(value) < Number(min)) {
      return `Must be greater than ${min}`;
    }

    return null;
  };

  const validateRangeInput = (
    values: { name: string; to: string; from: string }[],
  ) => {
    const errors = {};

    values.forEach((value, idx) => {
      if (value.name === "") {
        errors[`ranges.${idx}.name`] = "Required field";
      }

      const otherBinNames = values
        .filter((_, otherIdx) => otherIdx !== idx)
        .map((v) => v.name);
      if (otherBinNames.includes(value.name)) {
        errors[`ranges.${idx}.name`] = "Bin names must be unique";
      }

      const fromResult = validateNumberInput(value.to);
      if (fromResult) {
        errors[`ranges.${idx}.from`] = fromResult;
      }

      const toResult = validateNumberInput(value.to);
      if (toResult) {
        errors[`ranges.${idx}.to`] = toResult;
      }

      if (Number(value.to) <= Number(value.from)) {
        errors[`ranges.${idx}.from`] = `Must be less than ${value.to}`;
        errors[`ranges.${idx}.to`] = `Must be greater than ${value.from}`;
      }
    });

    // TODO - overlapping bins

    return errors;
  };

  const intervalForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      setIntervalSize: binSize,
      setIntervalMin: stats.min,
      setIntervalMax: stats.max + 1,
    },
    validate: {
      setIntervalSize: (value, values) =>
        validateInput(value, values.setIntervalMin, values.setIntervalMax),
      setIntervalMin: (value, values) =>
        validateMinInput(value, values.setIntervalMax),
      setIntervalMax: (value, values) =>
        validateMaxInput(value, values.setIntervalMin),
    },
  });

  const rangeForm = useForm({
    initialValues: {
      ranges: [{ name: "", from: "", to: "" }],
    },
    validate: (values) => validateRangeInput(values.ranges),
  });

  return (
    <Modal
      opened
      onClose={() => setModalOpen(false)}
      size={1000}
      title={`Create Custom Bins: ${field}`}
      withinPortal={false}
    >
      <p>
        Configure your bins, then click <b>Save Bins</b> to update the analysis
        plots.
      </p>
      <div className="flex h-10 items-center border-nci-gray-lightest border-solid border-1 p-2 mb-4">
        <p>
          Available values from <b>{stats.min}</b> to{" "}
          <b>
            {"<"} {stats.max + 1}
          </b>
        </p>
        <Divider orientation="vertical" className="mx-4 my-auto h-3/4" />
        <p>Bin size in quarters: {binSize}</p>
      </div>
      <div className="bg-nci-gray-lightest p-2 flex flex-col">
        <div className="flex">
          <div className="flex-grow">
            Define bins by:
            <div
              className="flex mt-2 items-cente text-sm"
              onClick={() => setBinMethod("interval")}
            >
              <Radio
                className="px-2"
                value="interval"
                name="binMethod"
                checked={binMethod === "interval"}
                onChange={(e) =>
                  e.target.checked ? setBinMethod("interval") : null
                }
              />
              A set interval of
              <TextInput
                {...intervalForm.getInputProps("setIntervalSize")}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-nci-gray-lightest" : undefined,
                }}
              />
              with values from
              <TextInput
                {...intervalForm.getInputProps("setIntervalMin")}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-nci-gray-lightest" : undefined,
                }}
              />
              to less than
              <TextInput
                {...intervalForm.getInputProps("setIntervalMax")}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-nci-gray-lightest" : undefined,
                }}
              />
            </div>
          </div>
          <Button aria-label="reset bins">
            <ResetIcon
              size={20}
              onClick={() => {
                intervalForm.reset();
                rangeForm.reset();
              }}
            />
          </Button>
        </div>
        <div
          className="flex flex-col text-sm mt-4"
          onClick={() => setBinMethod("ranges")}
        >
          <div className="flex mb-2">
            <Radio
              value="ranges"
              name="binMethod"
              checked={binMethod === "ranges"}
              className="px-2 "
              onChange={(e) =>
                e.target.checked ? setBinMethod("ranges") : null
              }
            />
            Custom ranges:
          </div>
          <table>
            <thead className="bg-nci-gray-lighter">
              <tr>
                <td>Bin Name</td>
                <td>From</td>
                <td>To less than</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {rangeForm.values.ranges.map((_, idx) => (
                <tr>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.name`)}
                      classNames={{
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    ></TextInput>
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.from`)}
                      classNames={{
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    ></TextInput>
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.to`)}
                      classNames={{
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    ></TextInput>
                  </td>
                  <td>
                    {idx === rangeForm.values.ranges.length - 1 ? (
                      <Button
                        onClick={() => {
                          const result = rangeForm.validate();
                          console.log(result);
                          if (!result.hasErrors) {
                            rangeForm.insertListItem("ranges", {
                              name: "",
                              from: "",
                              to: "",
                            });
                          }
                        }}
                        disabled={
                          rangeForm.values.ranges[idx].name === "" ||
                          rangeForm.values.ranges[idx].from === "" ||
                          rangeForm.values.ranges[idx].to === ""
                        }
                      >
                        Add
                      </Button>
                    ) : (
                      <Button
                        onClick={() => rangeForm.removeListItem("ranges", idx)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            setModalOpen(false);
          }}
          disabled={
            binMethod === "interval"
              ? Object.keys(intervalForm.errors).length > 0
              : Object.keys(rangeForm.errors).length > 0 ||
                rangeForm.values.ranges.length === 1
          }
        >
          Save Bins
        </Button>
      </div>
    </Modal>
  );
};

export default ContinuousBinningModal;
