import { render } from "test-utils";
import { waitFor } from "@testing-library/react";
import { DropdownWithIcon } from "./DropdownWithIcon";
import userEvent from "@testing-library/user-event";

describe("<DropdownWithIcon />", () => {
  it("if right icon is NOT provided, dropdown icon should be a default", () => {
    const { getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
      />,
    );

    expect(getByTestId("dropdown-icon")).toBeDefined();
  });

  it("if right icon is provided, provided icon should render", () => {
    const { getByLabelText } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
        RightSection={
          <div aria-label="test-icon" className="border-l pl-1 -mr-2" />
        }
      />,
    );

    expect(getByLabelText("test-icon")).toBeDefined();
  });

  it("target button should be disabled if targetButtonDisabled props is true", () => {
    const { getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
        targetButtonDisabled
      />,
    );
    expect(getByTestId("menu-elem")).toBeDisabled();
  });

  it("target button should NOT be disabled if targetButtonDisabled props is not provided/undefined", () => {
    const { getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
      />,
    );
    expect(getByTestId("menu-elem")).not.toBeDisabled();
  });

  it("menu label should be present when menuLabelText is provided ", async () => {
    const { getByText, getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
        menuLabelText="test menu label text"
      />,
    );

    await userEvent.click(getByTestId("menu-elem"));
    await waitFor(() => expect(getByTestId("menu-label")).toBeDefined(), {
      timeout: 2000,
    });
    expect(getByText("test menu label text")).toBeInTheDocument();
  });

  it("menu label should NOT be present when menuLabelText is NOT provided ", async () => {
    const { queryByTestId, getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[{ title: "test" }, { title: "test2" }]}
      />,
    );
    await userEvent.click(getByTestId("menu-elem"));
    expect(queryByTestId("menu-label")).toBeNull();
  });

  it("onClick should be called menu clicked on menu items only when provided", async () => {
    const mockOnClickCallBack1 = jest.fn();
    const { getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[
          { title: "test", onClick: mockOnClickCallBack1 },
          { title: "test2" },
        ]}
      />,
    );

    await userEvent.click(getByTestId("menu-elem"));
    await waitFor(() => expect(getByTestId("test-0")).toBeInTheDocument(), {
      timeout: 2000,
    });
    const firstMenuItem = getByTestId("test-0");
    await userEvent.click(firstMenuItem);

    expect(mockOnClickCallBack1).toBeCalled();
  });

  it("test menu item disabled", async () => {
    const { getByTestId } = render(
      <DropdownWithIcon
        TargetButtonChildren="test"
        dropdownElements={[
          { title: "itemD", disabled: true },
          { title: "itemE" },
        ]}
      />,
    );

    await userEvent.click(getByTestId("menu-elem"));
    await waitFor(() => expect(getByTestId("itemD-0")).toBeDisabled(), {
      timeout: 2000,
    });
    expect(getByTestId("itemE-1")).not.toBeDisabled();
  });
});
