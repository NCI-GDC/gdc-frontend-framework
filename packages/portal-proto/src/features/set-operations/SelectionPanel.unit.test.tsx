import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import SelectionPanel from "./SelectionPanel";

jest.spyOn(core, "selectAvailableCohorts").mockReturnValue([
  { id: "1", name: "Cohort 1", caseCount: 10 },
  { id: "2", name: "Cohort 2", caseCount: 50 },
  { id: "3", name: "Cohort 3", caseCount: 50 },
  { id: "4", name: "Cohort 4", caseCount: 50 },
] as any);
jest
  .spyOn(core, "selectSetsByType")
  .mockImplementation((_, setType) =>
    setType === "genes"
      ? { 123: "all the genes" }
      : { 345: "all the mutations" },
  );
jest
  .spyOn(core, "useGeneSetCountQuery")
  .mockImplementation(() => ({ isSucess: true, data: 100 } as any));
jest
  .spyOn(core, "useSsmSetCountQuery")
  .mockImplementation(() => ({ isSucess: true, data: 100 } as any));

describe("<SelectionPanel />", () => {
  it("selecting one type of entity disables the others", async () => {
    const { getByLabelText } = render(
      <core.CoreProvider>
        <SelectionPanel app={{}} setOpen={jest.fn()} />
      </core.CoreProvider>,
    );
    await userEvent.click(getByLabelText("Cohort 1"));

    expect(getByLabelText("Cohort 2")).toBeEnabled;
    expect(getByLabelText("all the genes")).toBeDisabled;
    expect(getByLabelText("all the mutations")).toBeDisabled;
  });

  it("can only select up to three entities", async () => {
    const { getByLabelText } = render(
      <core.CoreProvider>
        <SelectionPanel app={{}} setOpen={jest.fn()} />
      </core.CoreProvider>,
    );
    await userEvent.click(getByLabelText("Cohort 1"));
    await userEvent.click(getByLabelText("Cohort 2"));
    await userEvent.click(getByLabelText("Cohort 3"));

    expect(getByLabelText("Cohort 4")).toBeDisabled;
  });

  it("can run app with 2 entites selected", async () => {
    const { getByLabelText, getByText } = render(
      <core.CoreProvider>
        <SelectionPanel app={{}} setOpen={jest.fn()} />
      </core.CoreProvider>,
    );

    expect(getByText("Run")).toBeDisabled;

    await userEvent.click(getByLabelText("Cohort 1"));
    await userEvent.click(getByLabelText("Cohort 2"));

    expect(getByText("Run")).toBeEnabled;
  });
});
