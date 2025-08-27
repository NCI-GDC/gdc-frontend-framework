import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveCohortModal from "./SaveCohortModal";

const hooks = {
  useSelectCurrentCohort: jest.fn(),
  useSelectAvailableCohorts: jest.fn().mockReturnValue([]),
  useDeleteCohort: jest.fn(),
  useDiscardChanges: jest.fn(),
  useUpdateFilters: jest.fn(),
  useSetActiveCohort: jest.fn().mockReturnValue(jest.fn()),
  useAddUnsavedCohort: jest.fn(),
  useExportCohort: jest.fn(),
  useImportCohort: jest.fn(),
  useSaveCohort: jest
    .fn()
    .mockReturnValue(
      jest.fn().mockResolvedValue({ cohortAlreadyExists: true }),
    ),
  useReplaceCohort: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue({ newCohortId: "1" })),
};

describe("SaveCohortModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("populates name field from initialName", () => {
    const { getByRole } = render(
      <SaveCohortModal
        onClose={jest.fn()}
        opened
        filters={{
          root: {
            "projects.program.name": {
              field: "projects.program.name",
              operands: ["TCGA"],
              operator: "includes",
            },
          },
          mode: "and",
        }}
        cohortId="1"
        initialName="cohort name"
        hooks={hooks}
        invalidCohortNames={[]}
      />,
    );

    const nameInput = getByRole("textbox", {
      name: "Name",
    }) as HTMLInputElement;
    expect(nameInput.value).toBe("cohort name");
  });

  test("replaces cohort with same name", async () => {
    const { getByText } = render(
      <SaveCohortModal
        opened
        onClose={jest.fn()}
        filters={{
          root: {
            "projects.program.name": {
              field: "projects.program.name",
              operands: ["TCGA"],
              operator: "includes",
            },
          },
          mode: "and",
        }}
        cohortId="1"
        hooks={hooks}
        invalidCohortNames={[]}
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));
    expect(
      getByText(
        "A saved cohort with same name already exists. Are you sure you want to replace it?",
      ),
    ).toBeInTheDocument();
  });

  test("clears state when modal is closed", async () => {
    const { getByText, queryByText, rerender } = render(
      <SaveCohortModal
        opened
        onClose={jest.fn()}
        filters={{
          root: {
            "projects.program.name": {
              field: "projects.program.name",
              operands: ["TCGA"],
              operator: "includes",
            },
          },
          mode: "and",
        }}
        cohortId="1"
        hooks={hooks}
        invalidCohortNames={[]}
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));
    await userEvent.click(getByText("Replace"));

    // Modal is closed

    rerender(
      <SaveCohortModal
        opened
        onClose={jest.fn()}
        filters={{
          root: {
            "projects.program.name": {
              field: "projects.program.name",
              operands: ["TCGA"],
              operator: "includes",
            },
          },
          mode: "and",
        }}
        cohortId="1"
        hooks={hooks}
        invalidCohortNames={[]}
      />,
    );

    expect(queryByText("Replace Existing Cohort")).not.toBeInTheDocument();
  });
});
