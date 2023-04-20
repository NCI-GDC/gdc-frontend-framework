import { render } from "@testing-library/react";
import * as core from "@gff/core";
import SelectionPanel from "./SelectionPanel";

jest.spyOn(core, "selectSetsByType").mockImplementation((_, setType) =>
  setType === "genes"
    ? { 123: "all the genes" }
    : {
        "1": "Mutation Set 1",
        "2": "Mutation Set 2",
        "3": "Mutation Set 3",
        "4": "Mutation Set 4",
      },
);
jest
  .spyOn(core, "useGeneSetCountsQuery")
  .mockImplementation(() => ({ isSuccess: true, data: { 123: 10 } } as any));
jest
  .spyOn(core, "useSsmSetCountsQuery")
  .mockImplementation(
    () =>
      ({ isSuccess: true, data: { 1: 100, 2: 200, 3: 100, 4: 100 } } as any),
  );

describe("<SelectionPanel />", () => {
  it("selecting one type of entity disables the others", () => {
    const { getByLabelText } = render(
      <core.CoreProvider>
        <SelectionPanel
          app={""}
          setOpen={jest.fn()}
          selectedEntities={[{ name: "Mutation Set 1", id: "1" }]}
          setSelectedEntities={jest.fn()}
          selectedEntityType="mutations"
          setSelectedEntityType={jest.fn()}
        />
      </core.CoreProvider>,
    );

    expect(getByLabelText("all the genes")).toBeDisabled();
    expect(getByLabelText("Mutation Set 1")).toBeEnabled();
  });

  it("can only select up to three entities", () => {
    const { getByLabelText } = render(
      <core.CoreProvider>
        <SelectionPanel
          app={""}
          setOpen={jest.fn()}
          selectedEntities={[
            { name: "Mutation Set 1", id: "1" },
            { name: "Mutation Set 2", id: "2" },
            { name: "Mutation Set 3", id: "3" },
          ]}
          setSelectedEntities={jest.fn()}
          selectedEntityType="mutations"
          setSelectedEntityType={jest.fn()}
        />
      </core.CoreProvider>,
    );

    expect(getByLabelText("Mutation Set 1")).toBeEnabled();
    expect(getByLabelText("Mutation Set 4")).toBeDisabled();
  });

  it("can run app with 2 entities selected", () => {
    const { getByText, rerender } = render(
      <core.CoreProvider>
        <SelectionPanel
          app={""}
          setOpen={jest.fn()}
          selectedEntities={[]}
          setSelectedEntities={jest.fn()}
          selectedEntityType="mutations"
          setSelectedEntityType={jest.fn()}
        />
      </core.CoreProvider>,
    );

    expect(getByText("Run").closest("button")).toBeDisabled();

    rerender(
      <core.CoreProvider>
        <SelectionPanel
          app={""}
          setOpen={jest.fn()}
          selectedEntities={[
            { name: "Mutation Set 1", id: "1" },
            { name: "Mutation Set 2", id: "2" },
          ]}
          setSelectedEntities={jest.fn()}
          selectedEntityType="mutations"
          setSelectedEntityType={jest.fn()}
        />
      </core.CoreProvider>,
    );

    expect(getByText("Run").closest("button")).toBeEnabled();
  });
});
