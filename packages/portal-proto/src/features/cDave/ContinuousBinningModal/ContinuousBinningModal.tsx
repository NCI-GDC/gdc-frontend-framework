import { useState } from "react";
import { Button, Divider, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdReplay as ResetIcon } from "react-icons/md";
import { FaPlusCircle as PlusIcon, FaTrash as TrashIcon } from "react-icons/fa";
import { Statistics } from "@gff/core";
import { validateIntervalInput, validateRangeInput } from "./validateInputs";
import { CustomInterval, DataDimension, NamedFromTo } from "../types";
import {
  convertDataDimension,
  isInterval,
  useDataDimension,
  formatValue,
  toDisplayName,
} from "../utils";
import FunctionButton from "@/components/FunctionButton";
import { DATA_DIMENSIONS } from "../constants";
import { useDeepCompareEffect } from "use-deep-compare";

interface ContinuousBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly stats: Statistics;
  readonly updateBins: (bins: NamedFromTo[] | CustomInterval) => void;
  readonly customBins: NamedFromTo[] | CustomInterval;
  readonly dataDimension?: DataDimension;
  readonly opened: boolean;
}

const ContinuousBinningModal: React.FC<ContinuousBinningModalProps> = ({
  setModalOpen,
  field,
  stats,
  updateBins,
  customBins,
  dataDimension,
  opened,
}: ContinuousBinningModalProps) => {
  const customIntervalSet = isInterval(customBins);

  const displayDataDimension = useDataDimension(field);
  const originalDataDimension = DATA_DIMENSIONS[field]?.unit;
  const formattedStats = {
    min: formatValue(
      convertDataDimension(stats.min, originalDataDimension, dataDimension),
    ),
    max: formatValue(
      convertDataDimension(stats.max + 1, originalDataDimension, dataDimension),
    ),
  };

  const binSize = formatValue((formattedStats.max - formattedStats.min) / 4);

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
  const initialIntervalForm = {
    setIntervalSize: customIntervalSet
      ? String(
          formatValue(
            convertDataDimension(
              customBins.interval,
              originalDataDimension,
              dataDimension,
            ),
          ),
        )
      : String(binSize),
    setIntervalMin: customIntervalSet
      ? String(
          formatValue(
            convertDataDimension(
              customBins.min,
              originalDataDimension,
              dataDimension,
            ),
          ),
        )
      : String(formattedStats.min),
    setIntervalMax: customIntervalSet
      ? String(
          formatValue(
            convertDataDimension(
              customBins.max,
              originalDataDimension,
              dataDimension,
            ),
          ),
        )
      : String(formattedStats.max),
  };

  const intervalForm = useForm({
    validateInputOnChange: true,
    initialValues: initialIntervalForm,
    validate: (values) => {
      return validateIntervalInput(
        values.setIntervalSize,
        values.setIntervalMin,
        values.setIntervalMax,
      );
    },
  });

  const initialRangeForm = {
    ranges:
      !customIntervalSet && customBins?.length > 0
        ? [
            ...customBins.map((b) => ({
              name: b.name,
              from: String(
                convertDataDimension(
                  b.from,
                  originalDataDimension,
                  dataDimension,
                ),
              ),
              to: String(
                convertDataDimension(
                  b.to,
                  originalDataDimension,
                  dataDimension,
                ),
              ),
            })),
            { name: "", from: "", to: "" },
          ]
        : [{ name: "", from: "", to: "" }],
  };

  const rangeForm = useForm({
    initialValues: initialRangeForm,
    validate: (values) => {
      return validateRangeInput(values.ranges);
    },
  });

  const validateRangeField = (field: string, idx: number) => {
    rangeForm.validateField(`ranges.${idx}.${field}`);
    rangeForm.validateField(`ranges.${idx}.name`);
  };

  useDeepCompareEffect(() => {
    intervalForm.clearErrors();
    intervalForm.validate();
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalForm.values]);

  useDeepCompareEffect(() => {
    intervalForm.setValues({
      setIntervalMax: initialIntervalForm.setIntervalMax,
      setIntervalMin: initialIntervalForm.setIntervalMin,
      setIntervalSize: initialIntervalForm.setIntervalSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDimension]);

  const saveBins = () => {
    setModalOpen(false);
    // Store bins in the field's original data dimension
    if (binMethod === "interval") {
      const newBins: CustomInterval = {
        interval: convertDataDimension(
          Number(intervalForm.getValues().setIntervalSize),
          dataDimension,
          originalDataDimension,
        ),
        min: convertDataDimension(
          Number(intervalForm.getValues().setIntervalMin),
          dataDimension,
          originalDataDimension,
        ),
        max: convertDataDimension(
          Number(intervalForm.getValues().setIntervalMax),
          dataDimension,
          originalDataDimension,
        ),
      };
      if (!hasReset || intervalForm.isDirty()) {
        updateBins(newBins);
      } else {
        updateBins(null);
      }
    } else {
      const newBins: NamedFromTo[] = rangeForm
        .getValues()
        .ranges.map((r) => ({
          name: r.name,
          to: convertDataDimension(
            Number(r.to),
            dataDimension,
            originalDataDimension,
          ),
          from: convertDataDimension(
            Number(r.from),
            dataDimension,
            originalDataDimension,
          ),
        }))
        .slice(0, -1);
      if (!hasReset || rangeForm.isDirty()) {
        updateBins(newBins);
      } else {
        updateBins(null);
      }
    }
  };

  const intervalFormAtDefault =
    intervalForm.getValues().setIntervalSize === String(binSize) &&
    intervalForm.getValues().setIntervalMin === String(formattedStats.min) &&
    intervalForm.getValues().setIntervalMax === String(formattedStats.max);
  const rangeFormAtDefault =
    rangeForm.getValues().ranges.length === 1 &&
    rangeForm.getValues().ranges[0].name === "" &&
    rangeForm.getValues().ranges[0].to === "" &&
    rangeForm.getValues().ranges[0].from === "";

  return (
    <Modal
      opened={opened}
      onClose={() => setModalOpen(false)}
      size={1000}
      zIndex={400}
      title={`Create Custom Bins: ${toDisplayName(field)}`}
      classNames={{
        header: "text-xl !m-0 !px-0",
        content: "p-4",
      }}
    >
      <p className="font-content">
        Configure your bins, then click <b>Save Bins</b> to update the analysis
        plots.
      </p>
      <div
        data-testid="text-available-bin-values"
        className="flex h-10 items-center border-base-lightest border-solid border-1 p-2 mb-4 mt-2 font-content"
      >
        <p>
          Available values from <b>{formattedStats.min?.toLocaleString()}</b> to{" "}
          <b>
            {"<"} {formattedStats.max?.toLocaleString()}
          </b>
        </p>
        <Divider orientation="vertical" className="mx-4 my-auto h-3/4" />
        <p>
          Bin size in quarters: <b>{binSize?.toLocaleString()}</b>
        </p>
      </div>
      <div className="bg-base-lightest p-4 flex flex-col">
        <div className="flex">
          <div className="flex-grow">
            <span className="font-content" id="continuous-bin-modal-form-label">
              Define bins{" "}
              {displayDataDimension
                ? `in ${dataDimension.toLocaleLowerCase()}`
                : "by"}
              :
            </span>

            {/* This switches the bin method when a user clicks on the "area", no keyboard equivalent is needed to accessibly navigate the form */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
            <div
              onClick={() => setBinMethod("interval")}
              className="flex mt-4 items-start text-sm"
              role="group"
              aria-labelledby="continuous-bin-modal-form-label"
            >
              <Radio
                data-testid="button-select-set-interval"
                className="px-2"
                value="interval"
                name="binMethod"
                aria-label="select interval"
                color="blue"
                checked={binMethod === "interval"}
                onChange={(e) =>
                  e.target.checked ? setBinMethod("interval") : undefined
                }
              />
              <label
                htmlFor="continuous-bin-modal-interval-size"
                className="font-content"
              >
                A set interval of
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalSize")}
                value={Number(
                  intervalForm.values.setIntervalSize,
                )?.toLocaleString()}
                id={"continuous-bin-modal-interval-size"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
                data-testid="textbox-set-interval-size"
              />
              <label
                htmlFor="continuous-bin-modal-interval-min"
                className="font-content"
              >
                with values from
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalMin")}
                value={Number(
                  intervalForm.values.setIntervalMin,
                )?.toLocaleString()}
                id={"continuous-bin-modal-interval-min"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
                data-testid="textbox-set-interval-min"
              />
              <label
                htmlFor="continuous-bin-modal-interval-max"
                className="font-content"
              >
                to less than
              </label>
              <TextInput
                {...intervalForm.getInputProps("setIntervalMax")}
                value={Number(
                  intervalForm.values.setIntervalMax,
                )?.toLocaleString()}
                id={"continuous-bin-modal-interval-max"}
                classNames={{
                  wrapper: `px-2`,
                  input:
                    binMethod === "ranges" ? "bg-base-lightest" : undefined,
                }}
                data-testid="textbox-set-interval-max"
              />
            </div>
          </div>
          <FunctionButton
            data-testid="button-reset-bins"
            aria-label="reset bins"
            className="p-2"
            onClick={() => {
              intervalForm.setValues({
                setIntervalSize: String(binSize),
                setIntervalMin: String(formattedStats.min),
                setIntervalMax: String(formattedStats.max),
              });
              rangeForm.setValues({
                ranges: [{ name: "", from: "", to: "" }],
              });
              setSavedRangeRows([]);
              setBinMethod("interval");
              setHasReset(true);
            }}
            disabled={intervalFormAtDefault && rangeFormAtDefault}
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
              data-testid="button-select-custom-interval"
              value="ranges"
              name="binMethod"
              aria-label="select range"
              checked={binMethod === "ranges"}
              className="px-2"
              classNames={{ label: "font-content" }}
              color="blue"
              onChange={(e) =>
                e.target.checked ? setBinMethod("ranges") : undefined
              }
            />
            <span className="font-content">Custom ranges:</span>
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
              {rangeForm.getValues().ranges.map((_, idx) => (
                <tr key={idx} className="h-16 align-top">
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.name`)}
                      data-testid="textbox-range-name"
                      aria-label="range name"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.getValues().ranges.length - 1
                          ? rangeForm.validateField(`ranges.${idx}.name`)
                          : undefined
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.from`)}
                      data-testid="textbox-range-from"
                      aria-label="range from"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.getValues().ranges.length - 1
                          ? validateRangeField("from", idx)
                          : undefined
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      {...rangeForm.getInputProps(`ranges.${idx}.to`)}
                      data-testid="textbox-range-to"
                      aria-label="range to"
                      classNames={{
                        wrapper: "w-11/12",
                        input:
                          binMethod === "interval"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      onBlur={() =>
                        idx !== rangeForm.getValues().ranges.length - 1
                          ? validateRangeField("to", idx)
                          : undefined
                      }
                    />
                  </td>
                  <td className="float-right">
                    {idx === rangeForm.getValues().ranges.length - 1 ? (
                      <FunctionButton
                        data-testid="button-range-add"
                        leftSection={<PlusIcon aria-hidden="true" />}
                        onClick={() => {
                          const result = rangeForm.validate();
                          if (!result.hasErrors) {
                            setSavedRangeRows(rangeForm.getValues().ranges);

                            rangeForm.setFieldValue(
                              `ranges.${idx}.name`,
                              rangeForm.getValues().ranges[idx].name.trim(),
                            );
                            rangeForm.insertListItem("ranges", {
                              name: "",
                              from: "",
                              to: "",
                            });
                          }
                        }}
                        disabled={
                          rangeForm.getValues().ranges[idx].name === "" ||
                          rangeForm.getValues().ranges[idx].from === "" ||
                          rangeForm.getValues().ranges[idx].to === ""
                        }
                      >
                        Add
                      </FunctionButton>
                    ) : (
                      <FunctionButton
                        data-testid="button-range-delete"
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
          data-testid="button-custom-bins-cancel"
          variant="outline"
          color="primary.5"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          data-testid="button-custom-bins-save"
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
