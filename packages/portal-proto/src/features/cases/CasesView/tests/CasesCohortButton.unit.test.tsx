import React from "react";
import { render } from "@testing-library/react";
import { CasesCohortButton } from "../CasesCohortButton";
import userEvent from "@testing-library/user-event";

jest.mock("@gff/core", () => ({
  useCoreDispatch: jest.fn(() => () => null),
  addNewCohortWithFilterAndMessage: jest.fn(),
}));

describe("CasesCohortButton", () => {
  it("displays loading message when cases are fetching", async () => {
    const { getByText } = render(
      <CasesCohortButton
        onCreateSet={() => {}}
        response={{ isSuccess: false }}
        cases={["case 1"]}
        numCases={1}
        fetchingCases={true}
      />,
    );

    await userEvent.click(getByText("Save New Cohort"));
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("disables target button when there are no cases", () => {
    const { getByTestId } = render(
      <CasesCohortButton
        onCreateSet={() => {}}
        response={{ isSuccess: false }}
        cases={[]}
        numCases={0}
      />,
    );

    const targetButton = getByTestId("menu-elem");
    expect(targetButton).toBeDisabled();
  });
});
