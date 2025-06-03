import React from "react";
import { render } from "test-utils";
import { CasesCohortButton } from "../CasesCohortButton";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreSelector: jest.fn().mockReturnValue([]),
  useCoreDispatch: jest.fn().mockImplementation(jest.fn()),
  useAddCohortMutation: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "2",
      }),
    }),
    { isLoading: false } as any,
  ]),
  useLazyGetCohortsByContextIdQuery: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({ unwrap: jest.fn() }),
    {
      isSuccess: true,
      isLoading: false,
    },
  ] as any),
  useLazyGetCohortByIdQuery: jest.fn().mockReturnValue([jest.fn()] as any),
  useCreateCaseSetFromFiltersMutation: jest
    .fn()
    .mockReturnValue([jest.fn()] as any),
}));

describe("CasesCohortButton", () => {
  it("displays loading message when cases are fetching", async () => {
    const { getByText } = render(
      <CasesCohortButton
        onCreateSet={() => {}}
        response={{ isSuccess: false, isError: false }}
        cases={["case 1"]}
        numCases={1}
        fetchingCases={true}
      />,
    );

    await userEvent.click(getByText("Save New Cohort"));
    await waitFor(() => expect(getByText("Loading...")).toBeDefined(), {
      timeout: 2000,
    });
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("disables target button when there are no cases", () => {
    const { getByRole } = render(
      <CasesCohortButton
        onCreateSet={() => {}}
        response={{ isSuccess: false, isError: false }}
        cases={[]}
        numCases={0}
      />,
    );

    const targetButton = getByRole("button", { name: "Save New Cohort" });
    expect(targetButton).toBeDisabled();
  });
});
