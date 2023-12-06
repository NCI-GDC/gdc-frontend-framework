import { FormErrors } from "@mantine/form";

export const mantineFormNoErrorObj = {
  errors: {} as FormErrors,
  values: "s",
  setValues: jest.fn(),
  setErrors: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldError: jest.fn(),
  clearFieldError: jest.fn(),
  clearErrors: jest.fn(),
  reset: jest.fn(),
  validate: jest.fn().mockReturnValue({
    hasErrors: false,
    errors: {} as FormErrors,
  }),
  validateField: jest.fn(),
  reorderListItem: jest.fn(),
  removeListItem: jest.fn(),
  insertListItem: jest.fn(),
  getInputProps: () => ({
    value: "",
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    error: "",
  }),
  getTransformedValues: jest.fn(),
  onSubmit: jest.fn(),
  onReset: jest.fn(),
  isDirty: jest.fn(),
  isTouched: jest.fn(),
  setTouched: jest.fn(),
  setDirty: jest.fn(),
  resetTouched: jest.fn(),
  resetDirty: jest.fn(),
  isValid: jest.fn(),
};

export const mantineFormErrorObj = {
  ...mantineFormNoErrorObj,
  errors: { error1: "error" } as FormErrors,
  validate: jest.fn().mockReturnValue({
    hasErrors: true,
    errors: { error1: "error" } as FormErrors,
  }),
};
