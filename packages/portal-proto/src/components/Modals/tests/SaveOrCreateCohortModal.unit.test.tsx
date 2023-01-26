import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { SaveOrCreateCohortModal } from "../SaveOrCreateCohortModal";
import tailwindConfig from "tailwind.config";
import userEvent from "@testing-library/user-event";
import * as mantine_form from "@mantine/form";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("<SaveOrCreateCohortModal />", () => {
  it("default action should be Save", () => {
    const { getByText } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          initialName="testName"
          opened={true}
          onActionClick={jest.fn()}
          onNameChange={jest.fn()}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    expect(getByText("Save Cohort")).toBeDefined();
  });

  it("action should be same as the prop sent", () => {
    const { getByText } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          action="test"
          initialName="testName"
          opened={true}
          onActionClick={jest.fn()}
          onNameChange={jest.fn()}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    expect(getByText("Test Cohort")).toBeDefined();
  });

  it("no more than 100 char can be entered", async () => {
    const moreThan100CharText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's";
    const { getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          action="test"
          initialName="lorem"
          opened={true}
          onActionClick={jest.fn()}
          onNameChange={jest.fn()}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    const inputField = getByTestId("input-field");

    await userEvent.type(inputField, moreThan100CharText);

    expect((inputField as HTMLInputElement).value.length).toBe(100);
  });

  it("duplicate name warning should be shown if onNameChange returns false and there is no error", () => {
    const { getByText } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          action="test"
          initialName=""
          opened={true}
          onActionClick={jest.fn()}
          onNameChange={jest.fn().mockReturnValue(false)}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    expect(
      getByText("A cohort with the same name already exists."),
    ).toBeDefined();
  });

  it("onActionClick should NOT be called if there is any error", async () => {
    jest.spyOn(mantine_form, "useForm").mockReturnValue({
      errors: { error1: "error" } as mantine_form.FormErrors,
      values: "s",
      setValues: jest.fn(),
      setErrors: jest.fn(),
      setFieldValue: jest.fn(),
      setFieldError: jest.fn(),
      clearFieldError: jest.fn(),
      clearErrors: jest.fn(),
      reset: jest.fn(),
      validate: jest.fn().mockReturnValue({
        hasErrors: true,
        errors: { error1: "error" } as mantine_form.FormErrors,
      }),
      validateField: jest.fn(),
      reorderListItem: jest.fn(),
      removeListItem: jest.fn(),
      insertListItem: jest.fn(),
      getInputProps: jest.fn(),
      onSubmit: jest.fn(),
      onReset: jest.fn(),
      isDirty: jest.fn(),
      isTouched: jest.fn(),
      setTouched: jest.fn(),
      setDirty: jest.fn(),
      resetTouched: jest.fn(),
      resetDirty: jest.fn(),
      isValid: jest.fn(),
    });

    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          action="test"
          initialName=""
          opened={true}
          onActionClick={mockActionClick}
          onNameChange={jest.fn().mockReturnValue(false)}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).not.toBeCalled();
  });

  it("onActionClick SHOULD be called if there is NO any error", async () => {
    jest.spyOn(mantine_form, "useForm").mockReturnValue({
      errors: {} as mantine_form.FormErrors,
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
        errors: {} as mantine_form.FormErrors,
      }),
      validateField: jest.fn(),
      reorderListItem: jest.fn(),
      removeListItem: jest.fn(),
      insertListItem: jest.fn(),
      getInputProps: jest.fn(),
      onSubmit: jest.fn(),
      onReset: jest.fn(),
      isDirty: jest.fn(),
      isTouched: jest.fn(),
      setTouched: jest.fn(),
      setDirty: jest.fn(),
      resetTouched: jest.fn(),
      resetDirty: jest.fn(),
      isValid: jest.fn(),
    });
    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <SaveOrCreateCohortModal
          entity="cohort"
          action="test"
          initialName=""
          opened={true}
          onActionClick={mockActionClick}
          onNameChange={jest.fn().mockReturnValue(false)}
          onClose={jest.fn()}
        />
      </MantineProvider>,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).toBeCalled();
  });
});
