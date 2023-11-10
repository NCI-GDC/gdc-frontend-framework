import React from "react";
import { render } from "@testing-library/react";
import { CasesCohortButton } from "../CasesCohortButton";
import { MantineProvider } from "@mantine/core";
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

    await userEvent.click(getByText("Create New Cohort"));
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

  it('calls onCreateSet when there is 1 case or more and "Only Selected Cases" is clicked', async () => {
    const onCreateSetMock = jest.fn();
    const { getByText, getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <CasesCohortButton
          onCreateSet={onCreateSetMock}
          response={{ isSuccess: false }}
          cases={["case1"]}
          numCases={1}
        />
      </MantineProvider>,
    );

    await userEvent.click(getByText("Create New Cohort"));
    await userEvent.click(getByText("Only Selected Cases"));
    const cohortNameInput = getByTestId("input-field");
    await userEvent.type(cohortNameInput, "New Cohort");
    await userEvent.click(getByTestId("action-button"));

    expect(onCreateSetMock).toHaveBeenCalled();
  });
});
