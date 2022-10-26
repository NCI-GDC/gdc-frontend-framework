import { useEffect, useState } from "react";
import { Button, Divider, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdReplay as ResetIcon } from "react-icons/md";
import { FaPlusCircle as PlusIcon, FaTrash as TrashIcon } from "react-icons/fa";
import { AllowableRange, Statistics } from "@gff/core";
import _ from "lodash";
import { validateIntervalInput, validateRangeInput } from "./validateInputs";
import { CustomInterval, NamedFromTo } from "../types";
import { isInterval } from "../utils";
import FunctionButton from "@/components/FunctionButton";

interface ContinuousBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly stats: Statistics;
  readonly inputRange?: AllowableRange;
  readonly updateBins: (bins: NamedFromTo[] | CustomInterval) => void;
  readonly customBins: NamedFromTo[] | CustomInterval;
}

const ContinuousBinningModal: React.FC<ContinuousBinningModalProps> = ({
  setModalOpen,
  field,
  inputRange,
  stats,
  updateBins,
  customBins,
}: ContinuousBinningModalProps) => {
  const customIntervalSet = isInterval(customBins);

  const binSize = (stats.max + 1 - stats.min) / 4;
  const initialBinMethod =
    !customIntervalSet && customBins?.length > 0 ? "ranges" : "interval";
  const [binMethod, setBinMethod] = useState<"interval" | "ranges">(
    initialBinMethod,
  );
  const [savedRangeRows, setSavedRangeRows] = useState(
    !customIntervalSet && customBins?.length > 0
      ? customBins.map((bin) => ({
          ...bin,
          to: String(bin.to),
          from: String(bin.from),
        }))
      : [],
  );
  const [hasReset, setHasReset] = useState(false);
  const [customizedIntervalForm, setCustomizedIntervalForm] = useState(false);
  const [customizedRangeForm, setCustomizedRangeForm] = useState(false);
  const [customizedBinMethod, setCustomizedBinMethod] = useState(false);

  const initialIntervalForm = {
    setIntervalSize: customIntervalSet
      ? String(customBins.interval)
      : String(binSize),
    setIntervalMin: customIntervalSet
      ? String(customBins.min)
      : String(stats.min),
    setIntervalMax: customIntervalSet
      ? String(customBins.max)
      : String(stats.max + 1),
  };

  const intervalForm = useForm({
    validateInputOnChange: true,
    initialValues: initialIntervalForm,
    validate: (values) => {
      setCustomizedIntervalForm(!_.isEqual(values, initialIntervalForm));

      return validateIntervalInput(
        values.setIntervalSize,
        values.setIntervalMin,
        values.setIntervalMax,
        inputRange,
      );
    },
  });

  const initialRangeForm = {
    ranges:
      !customIntervalSet && customBins?.length > 0
        ? [
            ...customBins.map((b) => ({
              name: b.name,
              from: String(b.from),
              to: String(b.to),
            })),
            { name: "", from: "", to: "" },
          ]
        : [{ name: "", from: "", to: "" }],
  };

  const rangeForm = useForm({
    initialValues: initialRangeForm,
    validate: (values) => {
      setCustomizedRangeForm(!_.isEqual(values, initialRangeForm));

      return validateRangeInput(values.ranges);
    },
  });

  const validateRangeField = (field: string, idx: number) => {
    rangeForm.validateField(`ranges.${idx}.${field}`);
    rangeForm.validateField(`ranges.${idx}.name`);
  };

  useEffect(() => {
    intervalForm.clearErrors();
    intervalForm.validate();
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalForm.values]);

  useEffect(() => {
    setCustomizedBinMethod(binMethod !== initialBinMethod);

    if (binMethod === "interval") {
      rangeForm.clearErrors();
      intervalForm.validate();
    } else {
      intervalForm.clearErrors();
      rangeForm.validate();
      // Ignore empty last row
      rangeForm.clearFieldError(
        `ranges.${rangeForm.values.ranges.length - 1}.name`,
      );
      rangeForm.clearFieldError(
        `ranges.${rangeForm.values.ranges.length - 1}.to`,
      );
      rangeForm.clearFieldError(
        `ranges.${rangeForm.values.ranges.length - 1}.from`,
      );
    }
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binMethod]);

  const saveBins = () => {
    setModalOpen(false);
    if (binMethod === "interval") {
      const newBins = {
        interval: Number(intervalForm.values.setIntervalSize),
        min: Number(intervalForm.values.setIntervalMin),
        max: Number(intervalForm.values.setIntervalMax),
      };
      if (!hasReset || intervalForm.isDirty()) {
        updateBins(newBins);
      } else {
        updateBins(null);
      }
    } else {
      const newBins = rangeForm.values.ranges
        .map((r) => ({
          name: r.name,
          to: Number(r.to),
          from: Number(r.from),
        }))
        .slice(0, -1);
      if (!hasReset || rangeForm.isDirty()) {
        updateBins(newBins);
      } else {
        updateBins(null);
      }
    }
  };

  return (
    <Modal
      opened
      onClose={() => setModalOpen(false)}
      size={1000}
      title={`Create Custom Bins: ${field}`}
      withinPortal={false}
      classNames={{
        header: "text-xl",
      }}
    >
      <p>
        Configure your bins, then click <b>Save Bins</b> to update the analysis
        plots.
      </p>
      <div className="flex h-10 items-center border-base-lightest border-solid border-1 p-2 mb-4 mt-2">
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
      <div className="bg-base-lightest p-4 flex flex-col">
        <div className="flex">
          <div className="flex-grow">
            {"Define bins by:"}
            {/* This switches the bin method when a user clicks on the "area", no keyboard equivalent is needed to accessibly navigate the form */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="flex mt-4 items-start text-sm"
              onClick={() => setBinMethod("interval")}
            >
              <Radio
                className="px-2"
                value="interval"
                name="binMethod"
                aria-label="select interval"
                color="nci-blue"
                checked={binMethod === "interval"}
                onChange={(e) =>
                  e.target.checked ? setBinMethod("interval") : undefined
                }
              />
              <label htmlFor="continuous-bin-modal-interval-size">
                A set interval of
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalSize")}
                id={"continuous-bin-modal-interval-size"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
              />
              <label htmlFor="continuous-bin-modal-interval-min">
                with values from
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalMin")}
                id={"continuous-bin-modal-interval-min"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
              />
              <label htmlFor="continuous-bin-modal-interval-max">
                to less than
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalMax")}
                id={"continuous-bin-modal-interval-max"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
              />
            </div>
          </div>
          <FunctionButton
            aria-label="reset bins"
            className="p-2"
            onClick={() => {
              intervalForm.setValues({
                setIntervalSize: String(binSize),
                setIntervalMin: String(stats.min),
                setIntervalMax: String(stats.max + 1),
              });
              rangeForm.setValues({
                ranges: [{ name: "", from: "", to: "" }],
              });
              setSavedRangeRows([]);
              setBinMethod("interval");
              setHasReset(true);
              setCustomizedBinMethod(false);
              setCustomizedIntervalForm(false);
              setCustomizedRangeForm(false);
            }}
            disabled={
              !customizedBinMethod &&
              !customizedIntervalForm &&
              !customizedRangeForm
            }
          >
            <ResetIcon size={20} />
          </FunctionButton>
        </div>
        {/* This switches the bin method when a user clicks on the "area", no keyboard equivalent is needed to accessibly navigate the form */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="flex flex-col text-sm mt-4"
          onClick={() => setBinMethod("ranges")}
        >
          <div className="flex mb-4">
            <Radio
              value="ranges"
              name="binMethod"
              aria-label="select range"
              checked={binMethod === "ranges"}
              className="px-2 "
              color="nci-blue"
              onChange={(e) =>
                e.target.checked ? setBinMethod("ranges") : undefined
              }
            />
            Custom ranges:
          </div>
          <table
            className="border-separate"
            style={{ borderSpacing: "0 10px" }}
          >
            <thead className="bg-base-lighter font-bold mb-2 text-left">
              <tr>
                <th className="p-1">Bin Name</th>
                <th className="p-1">From</th>
                <th className="p-1">To less than</th>
                <th className="pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rangeForm.values.ranges.map((_, idx) => (
                <tr key={idx} className="h-16 align-top">
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.name`)}
                      aria-label="range name"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.values.ranges.length - 1
                          ? rangeForm.validateField(`ranges.${idx}.name`)
                          : undefined
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.from`)}
                      aria-label="range from"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.values.ranges.length - 1
                          ? validateRangeField("from", idx)
                          : undefined
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.to`)}
                      aria-label="range to"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.values.ranges.length - 1
                          ? validateRangeField("to", idx)
                          : undefined
                      }
                    />
                  </td>
                  <td className="float-right">
                    {idx === rangeForm.values.ranges.length - 1 ? (
                      <FunctionButton
                        leftIcon={<PlusIcon />}
                        onClick={() => {
                          const result = rangeForm.validate();
                          if (!result.hasErrors) {
                            setSavedRangeRows(rangeForm.values.ranges);

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
                      </FunctionButton>
                    ) : (
                      <FunctionButton
                        onClick={() => {
                          rangeForm.removeListItem("ranges", idx);
                          setSavedRangeRows(
                            savedRangeRows.filter((_, i) => idx !== i),
                          );
                        }}
                        aria-label="delete row"
                      >
                        <TrashIcon />
                      </FunctionButton>
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
          variant="outline"
          color="primary.5"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-primary-darkest text-primary-contrast-darkest disabled:bg-opacity-60 disabled:text-opacity-60"
          onClick={saveBins}
          disabled={
            binMethod === "interval"
              ? Object.keys(intervalForm.errors).length > 0
              : savedRangeRows.length === 0 ||
                Object.keys(rangeForm.errors).length > 0
          }
        >
          Save Bins
        </Button>
      </div>
    </Modal>
  );
};

export default ContinuousBinningModal;
