import {
  SaveOrCreateEntityBody,
  SaveOrCreateEntityModal,
} from "../SaveOrCreateEntityModal";
import userEvent from "@testing-library/user-event";
import * as mantine_form from "@mantine/form";
import {
  mantineFormErrorObj,
  mantineFormNoErrorObj,
} from "__mocks__/sharedMockData";
import { render } from "test-utils";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("<SaveOrCreateEntityModal />", () => {
  it("default action should be Save", () => {
    const { getByText } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        initialName="testName"
        opened={true}
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Save Cohort")).toBeDefined();
  });

  it("action should be same as the prop sent", () => {
    const { getByText } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        action="test"
        initialName="testName"
        opened={true}
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Test Cohort")).toBeDefined();
  });

  it("no more than 100 char can be entered", async () => {
    const moreThan100CharText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's";
    const { getByTestId } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        action="test"
        initialName="lorem"
        opened={true}
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    const inputField = getByTestId("input-field");

    await userEvent.type(inputField, moreThan100CharText);

    expect((inputField as HTMLInputElement).value.length).toBe(100);
  });

  it("duplicate name warning should be shown if onNameChange returns false and there is no error", () => {
    const { getByText } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        action="test"
        initialName=""
        opened={true}
        onActionClick={jest.fn()}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    expect(
      getByText("A cohort with the same name already exists."),
    ).toBeDefined();
  });

  it("onActionClick should NOT be called if there is any error", async () => {
    jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormErrorObj);

    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        action="test"
        initialName=""
        opened={true}
        onActionClick={mockActionClick}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).not.toBeCalled();
  });

  it("onActionClick SHOULD be called if there is NO any error", async () => {
    jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormNoErrorObj);
    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <SaveOrCreateEntityModal
        entity="cohort"
        action="test"
        initialName=""
        opened={true}
        onActionClick={mockActionClick}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).toBeCalled();
  });
});

describe.only("<SaveOrCreateEntityBody />", () => {
  // jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormNoErrorObj);

  it("test", async () => {
    const { getByText, getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="test"
        action="test"
        initialName=""
        onClose={jest.fn()}
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        descriptionMessage=""
        disallowedNames={["disallowed_test_name"]}
      />,
    );

    const inputField = getByTestId("input-field");
    await userEvent.type(inputField, "disallowed_test_name");
    await userEvent.click(getByTestId("action-button"));
    expect(
      getByText(
        "disallowed_test_name is not a valid name for a saved test. Please try another name.",
      ),
    ).toBeInTheDocument();
  });
});
