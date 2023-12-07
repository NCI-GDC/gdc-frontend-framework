import { SaveOrCreateEntityBody } from "../SaveOrCreateEntityModal";
import userEvent from "@testing-library/user-event";
import { render } from "test-utils";

beforeAll(() => {
  jest.clearAllMocks();
});

describe("<SaveOrCreateEntityBody />", () => {
  it("default action should be Save", () => {
    const { getByText } = render(
      <SaveOrCreateEntityBody
        entity="cohort"
        initialName="testName"
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Save")).toBeDefined();
  });

  it("action should be same name as the prop sent", () => {
    const { getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="cohort"
        action="test"
        initialName="testName"
        onActionClick={jest.fn()}
        onNameChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByTestId("input-field")).toHaveValue("testName");
  });

  it("no more than 100 char can be entered", async () => {
    const moreThan100CharText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's";
    const { getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="cohort"
        action="test"
        initialName="lorem"
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
      <SaveOrCreateEntityBody
        entity="cohort"
        action="test"
        initialName=""
        onActionClick={jest.fn()}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    expect(
      getByText("A cohort with the same name already exists."),
    ).toBeDefined();
  });

  it("onActionClick should NOT be called if there is any error - empty name", async () => {
    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="cohort"
        action="test"
        initialName=""
        onActionClick={mockActionClick}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).not.toBeCalled();
  });

  it("onActionClick SHOULD be called if there is NO any error", async () => {
    const mockActionClick = jest.fn();
    const { getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="cohort"
        action="test"
        initialName="test_cohort"
        onActionClick={mockActionClick}
        onNameChange={jest.fn().mockReturnValue(false)}
        onClose={jest.fn()}
      />,
    );

    await userEvent.click(getByTestId("action-button"));

    expect(mockActionClick).toBeCalled();
  });

  it("disallowed names are not accepted - VERSION 1", async () => {
    const mockActionClick = jest.fn();
    const { getByText, getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="test"
        action="test"
        initialName=""
        onClose={jest.fn()}
        onActionClick={mockActionClick}
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
    expect(mockActionClick).not.toBeCalled();
  });

  it("disallowed names are not accepted - VERSION 2", async () => {
    const mockActionClick = jest.fn();
    const { getByText, getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="test"
        action="test"
        initialName=""
        onClose={jest.fn()}
        onActionClick={mockActionClick}
        onNameChange={jest.fn()}
        descriptionMessage=""
        disallowedNames={["disallowed_test_name"]}
      />,
    );

    const inputField = getByTestId("input-field");
    await userEvent.type(inputField, "  disallowed_test_name  ");
    await userEvent.click(getByTestId("action-button"));
    expect(
      getByText(
        "disallowed_test_name is not a valid name for a saved test. Please try another name.",
      ),
    ).toBeInTheDocument();
    expect(mockActionClick).not.toBeCalled();
  });

  it("disallowed names are not accepted - VERSION 3", async () => {
    const mockActionClick = jest.fn();
    const { getByText, getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="test"
        action="test"
        initialName=""
        onClose={jest.fn()}
        onActionClick={mockActionClick}
        onNameChange={jest.fn()}
        descriptionMessage=""
        disallowedNames={["disallowed_test_name"]}
      />,
    );

    const inputField = getByTestId("input-field");
    await userEvent.type(inputField, "disaLLOwed_test_name");
    await userEvent.click(getByTestId("action-button"));
    expect(
      getByText(
        "disaLLOwed_test_name is not a valid name for a saved test. Please try another name.",
      ),
    ).toBeInTheDocument();
    expect(mockActionClick).not.toBeCalled();
  });

  it("disallowed names are not accepted - VERSION 4", async () => {
    const mockActionClick = jest.fn();
    const { getByText, getByTestId } = render(
      <SaveOrCreateEntityBody
        entity="test"
        action="test"
        initialName=""
        onClose={jest.fn()}
        onActionClick={mockActionClick}
        onNameChange={jest.fn()}
        descriptionMessage=""
        disallowedNames={["disallowed_test_name"]}
      />,
    );

    const inputField = getByTestId("input-field");
    await userEvent.type(inputField, "DISALLOWED_TEST_NAME");
    await userEvent.click(getByTestId("action-button"));
    expect(
      getByText(
        "DISALLOWED_TEST_NAME is not a valid name for a saved test. Please try another name.",
      ),
    ).toBeInTheDocument();
    expect(mockActionClick).not.toBeCalled();
  });
});
