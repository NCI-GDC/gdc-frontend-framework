import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SwitchSpring from "../SwitchSpring";

describe("<SwitchSpring />", () => {
  it("tooltip should be disabled when tooltip is undefined", () => {
    const { queryByTestId } = render(
      <SwitchSpring
        isActive
        icon={false}
        selected="test"
        handleSwitch={jest.fn()}
        tooltip=""
        margin="test"
      />,
    );

    expect(queryByTestId("tooltipSwitchSpring")).toBeNull();
  });

  it("tooltip should be disabled when tooltip is undefined", () => {
    const { queryByTestId } = render(
      <SwitchSpring
        isActive
        icon={false}
        selected="test"
        handleSwitch={jest.fn()}
        tooltip="test"
        margin="test"
      />,
    );

    expect(queryByTestId("tooltipSwitchSpring")).toBeDefined();
  });

  it("switch spring should have cursor-not-allowed, border-gray-300 class when disabled prop is true", async () => {
    const mockHandleSwitch = jest.fn();
    const { getByTestId } = render(
      <SwitchSpring
        isActive
        icon={false}
        selected="test"
        handleSwitch={mockHandleSwitch}
        tooltip="test"
        margin="test"
        disabled
      />,
    );

    expect(getByTestId("middle-div-switchSpring")).toHaveClass(
      "cursor-not-allowed",
    );

    expect(getByTestId("bottom-div-switchSpring")).toHaveClass(
      "border-gray-300",
    );
    await userEvent.click(getByTestId("middle-div-switchSpring"));

    expect(mockHandleSwitch).not.toBeCalled();
  });

  it("switch spring should not have cursor-not-allowed class and have border-activeColor class when disabled prop is false", async () => {
    const mockHandleSwitch = jest.fn();
    const { getByTestId } = render(
      <SwitchSpring
        isActive
        icon={false}
        selected="test"
        handleSwitch={mockHandleSwitch}
        tooltip="test"
        margin="test"
        disabled={false}
      />,
    );

    expect(getByTestId("middle-div-switchSpring")).not.toHaveClass(
      "cursor-not-allowed",
    );

    expect(getByTestId("bottom-div-switchSpring")).toHaveClass(
      "border-activeColor",
    );
    await userEvent.click(getByTestId("middle-div-switchSpring"));

    expect(mockHandleSwitch).toBeCalled();
  });
});
