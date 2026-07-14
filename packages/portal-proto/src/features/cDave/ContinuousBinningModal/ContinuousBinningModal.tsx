import { useCallback, useEffect, useState } from "react";
import { Button, Divider, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
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
import { CirclePlusIcon, ReplayIcon, TrashIcon } from "@/utils/icons";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

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
  const [hasReset, setHasReset] = useState(false);
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

  const resetFields = useCallback(() => {
    intervalForm.setValues({
      setIntervalSize: String(binSize),
      setIntervalMin: String(formattedStats.min),
      setIntervalMax: String(formattedStats.max),
    });
    rangeForm.setValues({
      ranges: [{ name: "", from: "", to: "" }],
    });
    // Adding form objects to dep array causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binSize, formattedStats.max, formattedStats.min]);

  useEffect(() => {
    if (customBins === null) {
      resetFields();
    }
  }, [resetFields, customBins]);

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
      title={`Create Custom Bins: ${toDisplayName(field)}`}
      classNames={{
        header: "p-4! mx-0!",
      }}
    >
      <div className="px-4 pb-4">
        <p className="mb-2 text-sm font-content">
          Configure your bins, then click <b>Save Bins</b> to update the
          analysis plots.
        </p>
        <div
          data-testid="text-available-bin-values"
          className="flex h-10 items-center border-base-lightest border-solid border-1 p-2 mb-4 mt-2 font-content bg-base-lightest text-sm"
        >
          <p>
            Available values from <b>{formattedStats.min?.toLocaleString()}</b>{" "}
            to{" "}
            <b>
              {"<"} {formattedStats.max?.toLocaleString()}
            </b>
          </p>
          <Divider orientation="vertical" className="mx-4 my-auto h-3/4" />
          <p>
            Bin size in quarters: <b>{binSize?.toLocaleString()}</b>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span
              className="font-content font-bold"
              id="continuous-bin-modal-form-label"
            >
              Define bins{" "}
              {displayDataDimension
                ? `in ${dataDimension.toLocaleLowerCase()}`
                : "by"}
              :
            </span>
            <FunctionButton
              data-testid="button-reset-bins"
              aria-label="reset bins"
              size="sm"
              onClick={() => {
                resetFields();
                setSavedRangeRows([]);
                setBinMethod("interval");
                setHasReset(true);
              }}
              disabled={intervalFormAtDefault && rangeFormAtDefault}
            >
              <ReplayIcon size={20} />
            </FunctionButton>
          </div>

          <div className="flex items-center text-sm gap-2">
            <Radio
              data-testid="button-select-set-interval"
              value="interval"
              name="binMethod"
              aria-label="select interval"
              color="accent"
              checked={binMethod === "interval"}
              onChange={(e) =>
                e.target.checked ? setBinMethod("interval") : undefined
              }
            />
            <label
              htmlFor="continuous-bin-modal-interval-size"
              className="font-content"
            >
              A set interval
            </label>
          </div>

          {/* This switches the bin method when a user clicks on the "area", no keyboard equivalent is needed to accessibly navigate the form */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div
            onClick={() => setBinMethod("interval")}
            className="flex items-start text-sm mt-2"
            role="group"
            aria-labelledby="continuous-bin-modal-form-label"
          >
            <table className="w-full border-1 border-base-lighter">
              <thead className="font-bold text-left border-b-4 border-b-base-lighter">
                <tr>
                  <th className="p-2" id="bin-size-label">
                    Bin size
                  </th>
                  <th className="p-2" id="interval-from-label">
                    From
                  </th>
                  <th className="p-2" id="interval-to-label">
                    To less than
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">
                    <TextInput
                      {...intervalForm.getInputProps("setIntervalSize")}
                      id={"continuous-bin-modal-interval-size"}
                      classNames={{
                        input:
                          binMethod === "ranges"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      data-testid="textbox-set-interval-size"
                      aria-labelledby="bin-size-label"
                    />
                  </td>
                  <td className="p-2">
                    <TextInput
                      {...intervalForm.getInputProps("setIntervalMin")}
                      id={"continuous-bin-modal-interval-min"}
                      classNames={{
                        input:
                          binMethod === "ranges"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      data-testid="textbox-set-interval-min"
                      aria-labelledby="interval-from-label"
                    />
                  </td>
                  <td className="p-2">
                    <TextInput
                      {...intervalForm.getInputProps("setIntervalMax")}
                      id={"continuous-bin-modal-interval-max"}
                      classNames={{
                        input:
                          binMethod === "ranges"
                            ? "bg-base-lightest"
                            : undefined,
                      }}
                      data-testid="textbox-set-interval-max"
                      aria-labelledby="interval-to-label"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <div className="flex gap-2">
            <Radio
              data-testid="button-select-custom-interval"
              value="ranges"
              name="binMethod"
              aria-label="select range"
              checked={binMethod === "ranges"}
              classNames={{ label: "font-content" }}
              color="accent"
              size="sm"
              onChange={(e) =>
                e.target.checked ? setBinMethod("ranges") : undefined
              }
            />
            <span className="font-content text-sm">Custom ranges</span>
          </div>

          {/* This switches the bin method when a user clicks on the "area", no keyboard equivalent is needed to accessibly navigate the form */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="flex flex-col text-sm mt-2"
            onClick={() => setBinMethod("ranges")}
          >
            <table className="w-full border-1 border-base-lighter">
              <thead className="font-bold text-left border-b-4 border-b-base-lighter">
                <tr>
                  <th className="p-2" id="range-name-label">
                    Bin name
                  </th>
                  <th className="p-2" id="range-from-label">
                    From
                  </th>
                  <th className="p-2" id="range-to-label">
                    To less than
                  </th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rangeForm.getValues().ranges.map((_, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="p-2">
                      <TextInput
                        {...rangeForm.getInputProps(`ranges.${idx}.name`)}
                        data-testid="textbox-range-name"
                        aria-labelledby="range-name-label"
                        classNames={{
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
                        maxLength={100}
                      />
                    </td>
                    <td className="p-2">
                      <TextInput
                        {...rangeForm.getInputProps(`ranges.${idx}.from`)}
                        data-testid="textbox-range-from"
                        aria-labelledby="range-from-label"
                        classNames={{
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
                    <td className="p-2">
                      <TextInput
                        {...rangeForm.getInputProps(`ranges.${idx}.to`)}
                        data-testid="textbox-range-to"
                        aria-labelledby="range-to-label"
                        classNames={{
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
                    <td className="p-2">
                      {idx === rangeForm.getValues().ranges.length - 1 ? (
                        <FunctionButton
                          data-testid="button-range-add"
                          leftSection={<CirclePlusIcon aria-hidden="true" />}
                          aria-label="Add range"
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
                          classNames={{
                            section: "mr-1",
                          }}
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
                          <TrashIcon size={16} />
                        </FunctionButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2 justify-end bg-base-lightest p-4">
        <Button
          data-testid="button-custom-bins-cancel"
          variant="outline"
          color="primary.5"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>
        <DarkFunctionButton
          data-testid="button-custom-bins-save"
          onClick={saveBins}
          disabled={
            binMethod === "interval"
              ? Object.keys(intervalForm.errors).length > 0
              : savedRangeRows.length === 0 ||
                Object.keys(rangeForm.errors).length > 0
          }
        >
          Save Bins
        </DarkFunctionButton>
      </div>
    </Modal>
  );
};

export default ContinuousBinningModal;
