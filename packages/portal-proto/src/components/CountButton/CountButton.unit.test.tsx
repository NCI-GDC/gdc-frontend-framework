import { render } from "@testing-library/react";
import { CountButton } from "./CountButton";
import userEvent from "@testing-library/user-event";

describe("<CountButton />", () => {
  it("button should be disabled", () => {
    const { getByRole } = render(
      <CountButton
        disabled={true}
        tooltipLabel=""
        handleOnClick={() => null}
        count={0}
      />,
    );

    expect(getByRole("button")).toBeDisabled();
  });

  it("button should NOT be disabled", () => {
    const { getByRole } = render(
      <CountButton
        disabled={false}
        tooltipLabel=""
        handleOnClick={() => null}
        count={0}
      />,
    );

    expect(getByRole("button")).not.toBeDisabled();
  });

  it("button should call its callback when clicked ", async () => {
    const mockFuncion = jest.fn();
    const { getByRole } = render(
      <CountButton
        disabled={false}
        tooltipLabel=""
        handleOnClick={mockFuncion}
        count={0}
      />,
    );

    await userEvent.click(getByRole("button"));
    expect(mockFuncion).toBeCalled();
  });

  it("button should NOT call its callback when clicked during disabled state", async () => {
    const mockFuncion = jest.fn();
    const { getByRole } = render(
      <CountButton
        disabled={true}
        tooltipLabel=""
        handleOnClick={mockFuncion}
        count={0}
      />,
    );

    await userEvent.click(getByRole("button"));
    expect(mockFuncion).not.toBeCalled();
  });
});
