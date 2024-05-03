import React from "react";
import { render } from "@testing-library/react";
import { CasesCohortButton } from "../CasesCohortButton";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";

const mockMutation = jest.fn().mockReturnValue({
  unwrap: jest.fn().mockResolvedValue({
    id: "2",
  }),
});
beforeEach(() => {
  jest.spyOn(core, "useCoreSelector").mockReturnValue([]);
  jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  jest
    .spyOn(core, "useAddCohortMutation")
    .mockReturnValue([mockMutation, { isLoading: false } as any]);
  jest
    .spyOn(core, "useGetCohortsByContextIdQuery")
    .mockReturnValue({ data: {}, refetch: jest.fn() });
  jest
    .spyOn(core, "useLazyGetCohortByIdQuery")
    .mockReturnValue([jest.fn()] as any);
  jest
    .spyOn(core, "useCreateCaseSetFromFiltersMutation")
    .mockReturnValue([jest.fn()] as any);
});

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
