import { BUCKETS_MAX_COUNT } from "../constants";

const validateNumberInput = (value: string) => {
  if (value === "") {
    return "Required field";
  }

  if (Number.isNaN(Number(value))) {
    return `${value} is not a valid number`;
  }

  if (
    Number(value) !== 0 &&
    !Number.isInteger(Number(value)) &&
    value.split(".")?.[1].length > 2
  ) {
    return "Use up to 2 decimal places";
  }

  return null;
};

const validateIntervalSize = (size: string, min: string, max: string) => {
  const validNumberError = validateNumberInput(size);

  if (validNumberError) {
    return validNumberError;
  }

  if (Number(size) <= 0) {
    return "Must be greater than 0";
  }

  if (
    max !== "" &&
    min !== "" &&
    Number(max) > Number(min) &&
    Number(size) > Number(max) - Number(min)
  ) {
    return `Must be less than or equal to ${Number(max) - Number(min)}`;
  }

  if (
    Math.floor((Number(max) - Number(min)) / Number(size)) > BUCKETS_MAX_COUNT
  ) {
    return `Number of bins will exceed the maximum of ${BUCKETS_MAX_COUNT} bins.`;
  }

  return null;
};

const validateMinInput = (value: string, max: string) => {
  const validNumberError = validateNumberInput(value);

  if (validNumberError) {
    return validNumberError;
  }

  if (max !== "" && Number(value) >= Number(max)) {
    return `Must be less than ${max}`;
  }

  return null;
};

const validateMaxInput = (value: string, min: string) => {
  const validNumberError = validateNumberInput(value);

  if (validNumberError) {
    return validNumberError;
  }

  if (min !== "" && Number(value) <= Number(min)) {
    return `Must be greater than ${min}`;
  }

  return null;
};

export const validateIntervalInput = (
  size: string,
  min: string,
  max: string,
): Record<string, string> => {
  const errors = {};

  const intervalSizeResult = validateIntervalSize(size, min, max);
  if (intervalSizeResult) {
    errors["setIntervalSize"] = intervalSizeResult;
  }

  const minResult = validateMinInput(min, max);
  if (minResult) {
    errors["setIntervalMin"] = minResult;
  }

  const maxResult = validateMaxInput(max, min);
  if (maxResult) {
    errors["setIntervalMax"] = maxResult;
  }

  return errors;
};

export const validateRangeInput = (
  values: { name: string; to: string; from: string }[],
): Record<string, string> => {
  const errors = {};

  values.forEach((value, idx) => {
    if (value.name === "") {
      errors[`ranges.${idx}.name`] = "Required field";
    } else {
      const otherBinNames = values
        .filter((_, otherIdx) => otherIdx !== idx)
        .map((v) => v.name.trim());
      if (otherBinNames.includes(value.name.trim())) {
        errors[`ranges.${idx}.name`] = "Bin names must be unique";
      } else {
        const overlappingBins = [];
        values.forEach((otherValue, otherIdx) => {
          if (
            idx === otherIdx ||
            value.from === "" ||
            value.to === "" ||
            otherValue.from === "" ||
            otherValue.to === ""
          ) {
            return;
          }
          if (
            (Number(value.from) > Number(otherValue.from) &&
              Number(value.from) < Number(otherValue.to)) ||
            (Number(otherValue.from) > Number(value.from) &&
              Number(otherValue.from) < Number(value.to)) ||
            (Number(value.to) > Number(otherValue.from) &&
              Number(value.to) < Number(otherValue.to)) ||
            Number(value.to) === Number(otherValue.to) ||
            Number(value.from) === Number(otherValue.from)
          ) {
            overlappingBins.push(otherValue.name);
          }
        });

        if (overlappingBins.length > 0) {
          errors[`ranges.${idx}.name`] = `'${
            value.name
          }' overlaps with ${overlappingBins.map((b) => `'${b}'`).join(", ")}`;
        }
      }
    }
    const fromResult = validateNumberInput(value.from);
    if (fromResult) {
      errors[`ranges.${idx}.from`] = fromResult;
    }

    const toResult = validateNumberInput(value.to);
    if (toResult) {
      errors[`ranges.${idx}.to`] = toResult;
    }

    if (
      value.to !== "" &&
      value.from !== "" &&
      Number(value.to) <= Number(value.from)
    ) {
      errors[`ranges.${idx}.from`] = `Must be less than ${value.to}`;
      errors[`ranges.${idx}.to`] = `Must be greater than ${value.from}`;
    }
  });

  return errors;
};
