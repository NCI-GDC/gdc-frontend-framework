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

export const validateIntervalInput = (
  value: string,
  min: string,
  max: string,
) => {
  const validNumberError = validateNumberInput(value);

  if (validNumberError) {
    return validNumberError;
  }

  if (Number(value) <= 0) {
    return "Must be greater than 0";
  }

  if (Number(value) > Number(max) - Number(min)) {
    return `Must be less than or equal to ${Number(max) - Number(min)}`;
  }

  return null;
};

export const validateMinInput = (value: string, max: string) => {
  const validNumberError = validateNumberInput(value);

  if (validNumberError) {
    return validNumberError;
  }

  if (Number(value) > Number(max)) {
    return `Must be less than ${max}`;
  }

  return null;
};

export const validateMaxInput = (value: string, min: string) => {
  const validNumberError = validateNumberInput(value);

  if (validNumberError) {
    return validNumberError;
  }

  if (Number(value) < Number(min)) {
    return `Must be greater than ${min}`;
  }

  return null;
};

export const validateRangeInput = (
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

    if (idx !== 0) {
      if (Number(values[idx - 1].to) > Number(value.from)) {
        errors[`ranges.${idx}.name`] = `${value.name} overlaps with ${
          values[idx - 1].name
        }`;
      }
    }
  });

  return errors;
};
