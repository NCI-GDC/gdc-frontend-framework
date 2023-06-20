import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { SaveOrCreateEntityModal } from "../SaveOrCreateEntityModal";
import tailwindConfig from "tailwind.config";
import userEvent from "@testing-library/user-event";
import * as mantine_form from "@mantine/form";
import {
  mantineFormErrorObj,
  mantineFormNoErrorObj,
} from "__mocks__/sharedMockData";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("<SaveOrCreateEntityModal />", () => {
  it("default action should be Save", () => {
    const { getByText } = render(
      <MantineProvider
        theme={{
          colors: {
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <SaveOrCreateEntityModal
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
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <SaveOrCreateEntityModal
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
        <SaveOrCreateEntityModal
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
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <SaveOrCreateEntityModal
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
    jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormErrorObj);

    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <SaveOrCreateEntityModal
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
    jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormNoErrorObj);
    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <SaveOrCreateEntityModal
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
