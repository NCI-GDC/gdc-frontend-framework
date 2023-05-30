import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import AdditionalCohortSelection from "./AdditionalCohortSelection";

jest.spyOn(core, "selectAvailableCohorts").mockImplementation(
  () =>
    [
      { id: "1", name: "Lung", caseCount: 100 },
      { id: "2", name: "Brain", caseCount: 0 },
      { id: "3", name: "Lung", caseCount: 100 },
      { id: "4", name: "Skin", caseCount: 1000 },
    ] as any,
);

describe("<AdditionalCohortSelection />", () => {
  it("Correctly excludes current cohort from list", () => {
    jest
      .spyOn(core, "selectCurrentCohort")
      .mockImplementation(() => ({ id: "3", name: "Lung" } as any));

    const { getByLabelText } = render(
      <AdditionalCohortSelection
        app={""}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    // We are including the correct cohort with the name "Lung"
    expect(getByLabelText("Lung").getAttribute("id")).toEqual("1");
    expect(getByLabelText("Brain")).toBeInTheDocument();
    expect(getByLabelText("Skin")).toBeInTheDocument();
  });

  it("Correctly selects cohort when multiple of the same name", async () => {
    jest
      .spyOn(core, "selectCurrentCohort")
      .mockImplementation(() => ({ id: "2", name: "Brain" } as any));

    const { getAllByLabelText } = render(
      <AdditionalCohortSelection
        app={""}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    await userEvent.click(getAllByLabelText("Lung")[0]);
    expect(getAllByLabelText("Lung")[0]).toBeChecked();
    expect(getAllByLabelText("Lung")[1]).not.toBeChecked();
  });

  it("Disables 0 count cohort input", () => {
    jest
      .spyOn(core, "selectCurrentCohort")
      .mockImplementation(() => ({ id: "3", name: "Lung" } as any));

    const { getByLabelText } = render(
      <AdditionalCohortSelection
        app={""}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    expect(getByLabelText("Brain")).toBeDisabled();
  });
});
