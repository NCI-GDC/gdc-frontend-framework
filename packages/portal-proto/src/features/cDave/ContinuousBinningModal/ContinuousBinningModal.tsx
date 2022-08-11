import { useEffect, useState } from "react";
import { Button, Divider, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdReplay as ResetIcon } from "react-icons/md";
import { FaPlusCircle as PlusIcon, FaTrash as TrashIcon } from "react-icons/fa";
import { Statistics, NumericFromTo } from "@gff/core";
import {
  validateIntervalInput,
  validateMaxInput,
  validateMinInput,
  validateRangeInput,
} from "./validateInputs";
import { CustomInterval, NamedFromTo } from "../types";
import { isInterval } from "../utils";

interface ContinuousBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly stats: Statistics;
  readonly updateBins: (bins: NamedFromTo[] | CustomInterval) => void;
  readonly customBins: NamedFromTo[] | CustomInterval;
}

const ContinuousBinningModal: React.FC<ContinuousBinningModalProps> = ({
  setModalOpen,
  field,
  stats,
  updateBins,
  customBins,
}: ContinuousBinningModalProps) => {
  const binSize = (stats.max + 1 - stats.min) / 4;
  const customIntervalSet = isInterval(customBins);
  const [binMethod, setBinMethod] = useState<"interval" | "ranges">(
    !customIntervalSet && customBins?.length > 0 ? "ranges" : "interval",
  );

  const intervalForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      setIntervalSize: customIntervalSet
        ? String(customBins.interval)
        : String(binSize),
      setIntervalMin: customIntervalSet
        ? String(customBins.min)
        : String(stats.min),
      setIntervalMax: customIntervalSet
        ? String(customBins.max)
        : String(stats.max + 1),
    },
    validate: {
      setIntervalSize: (value, values) =>
        validateIntervalInput(
          value,
          values.setIntervalMin,
          values.setIntervalMax,
        ),
      setIntervalMin: (value, values) =>
        validateMinInput(value, values.setIntervalMax),
      setIntervalMax: (value, values) =>
        validateMaxInput(value, values.setIntervalMin),
    },
  });

  const rangeForm = useForm({
    initialValues: {
      ranges:
        !customIntervalSet && customBins?.length > 0
          ? customBins.map((b) => ({
              name: b.name,
              from: String(b.from),
              to: String(b.to),
            }))
          : [{ name: "", from: "", to: "" }],
    },
    validate: (values) => validateRangeInput(values.ranges),
  });

  useEffect(() => {
    if (binMethod === "interval") {
      rangeForm.clearErrors();
      intervalForm.validate();
    } else {
      intervalForm.clearErrors();
      if (rangeForm.values.ranges.length > 1) {
        rangeForm.validate();
      }
    }
  }, [binMethod]);

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
      <div className="flex h-10 items-center border-nci-gray-lightest border-solid border-1 p-2 mb-4 mt-2">
        <p>
          Available values from <b>{stats.min}</b> to{" "}
          <b>
            {"<"} {stats.max + 1}
          </b>
        </p>
        <Divider orientation="vertical" className="mx-4 my-auto h-3/4" />
        <p>
          Bin size in quarters: <b>{binSize}</b>
        </p>
      </div>
      <div className="bg-nci-gray-lightest p-4 flex flex-col">
        <div className="flex">
          <div className="flex-grow">
            Define bins by:
            <div
              className="flex mt-4 items-cente text-sm"
              onClick={() => setBinMethod("interval")}
            >
              <Radio
                className="px-2"
                value="interval"
                name="binMethod"
                checked={binMethod === "interval"}
                onChange={(e) =>
                  e.target.checked ? setBinMethod("interval") : undefined
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
          <Button aria-label="reset bins" className="p-2">
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
          <div className="flex mb-4">
            <Radio
              value="ranges"
              name="binMethod"
              checked={binMethod === "ranges"}
              className="px-2 "
              onChange={(e) =>
                e.target.checked ? setBinMethod("ranges") : undefined
              }
            />
            Custom ranges:
          </div>
          <table className="border-seperate border-spacing-2">
            <thead className="bg-nci-gray-lighter font-bold mb-2">
              <tr>
                <th className="py-1">Bin Name</th>
                <th className="py-1">From</th>
                <th className="py-1">To less than</th>
                <th className="py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rangeForm.values.ranges.map((_, idx) => (
                <tr key={idx} className="h-16 align-top">
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.name`)}
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.from`)}
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.to`)}
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-nci-gray-lightest"
                            : undefined,
                      }}
                    />
                  </td>
                  <td className="float-right">
                    {idx === rangeForm.values.ranges.length - 1 ? (
                      <Button
                        leftIcon={<PlusIcon />}
                        onClick={() => {
                          const result = rangeForm.validate();
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
                        aria-label="delete row"
                      >
                        <TrashIcon />
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
            binMethod === "interval"
              ? updateBins({
                  interval: Number(intervalForm.values.setIntervalSize),
                  min: Number(intervalForm.values.setIntervalMin),
                  max: Number(intervalForm.values.setIntervalMax),
                })
              : // TODO only values that have been "added"
                updateBins(
                  // Remove empty last row
                  rangeForm.values.ranges.slice(0).map((r) => ({
                    name: r.name,
                    to: Number(r.to),
                    from: Number(r.from),
                  })),
                );
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
