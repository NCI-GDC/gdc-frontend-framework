import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import SaveCohortModal from "./SaveCohortModal";

describe("SaveCohortModal", () => {
  beforeEach(() => {
    jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("populates name field from initialName", () => {
    const { getByRole } = render(
      <SaveCohortModal
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
        initialName="cohort name"
      />,
    );

    const nameInput = getByRole("textbox", {
      name: "Name",
    }) as HTMLInputElement;
    expect(nameInput.value).toBe("cohort name");
  });

  test("save existing cohort handles switching out cohorts", async () => {
    jest
      .spyOn(core, "useLazyGetCohortByIdQuery")
      .mockReturnValue([jest.fn()] as any);
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "2",
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);
    const copyCohortMock = jest.spyOn(core, "copyToSavedCohort");
    const setCurrentCohortMock = jest.spyOn(core, "setCurrentCohortId");

    const { getByText } = render(
      <SaveCohortModal
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
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));
    expect(copyCohortMock).toBeCalledWith({
      sourceId: "1",
      destId: "2",
    });
    expect(setCurrentCohortMock).toBeCalledWith("2");
  });

  test("save as cohort discards unsaved changes from current cohort", async () => {
    const mockRetrieveFilters = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        filters: {
          op: "and",
          content: [
            {
              content: {
                field: "cases.primary_site",
                value: ["bronchus and lung"],
              },
              op: "in",
            },
          ],
        },
      }),
    });
    jest
      .spyOn(core, "useLazyGetCohortByIdQuery")
      .mockReturnValue([mockRetrieveFilters] as any);
    const mockDiscardChanges = jest.fn();
    jest
      .spyOn(core, "discardCohortChanges")
      .mockImplementation(mockDiscardChanges);
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "2",
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);

    const { getByText } = render(
      <SaveCohortModal
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
        saveAs
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));
    expect(mockDiscardChanges).toBeCalledWith({
      filters: {
        root: {
          "cases.primary_site": {
            field: "cases.primary_site",
            operands: ["bronchus and lung"],
            operator: "includes",
          },
        },
        mode: "and",
      },
      showMessage: false,
    });
    expect(mockMutation).toBeCalledWith({
      cohort: {
        name: "my new cohort",
        type: "dynamic",
        filters: {
          op: "and",
          content: [
            {
              content: {
                field: "projects.program.name",
                value: ["TCGA"],
              },
              op: "in",
            },
          ],
        },
      },
      delete_existing: false,
    });
  });

  test("replaces cohort with same name", async () => {
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({
        data: {
          message: "Bad Request: Name must be unique (case-insensitive)",
        },
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);
    jest
      .spyOn(core, "useLazyGetCohortByIdQuery")
      .mockReturnValue([jest.fn()] as any);

    const { getByText } = render(
      <SaveCohortModal
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

  test("save brand new cohort adds cohort to the store", async () => {
    jest
      .spyOn(core, "useLazyGetCohortByIdQuery")
      .mockReturnValue([jest.fn()] as any);
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "2",
        name: "my new cohort",
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);
    const setCurrentCohortMock = jest.spyOn(core, "setCurrentCohortId");
    const addCohortToStoreMock = jest.spyOn(core, "addNewSavedCohort");

    const { getByText } = render(
      <SaveCohortModal
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
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));

    expect(setCurrentCohortMock).not.toBeCalled;
    expect(addCohortToStoreMock).toBeCalledWith(
      expect.objectContaining({
        id: "2",
        name: "my new cohort",
        saved: true,
        modified: false,
      }),
    );
  });

  test("save new cohort and set as current", async () => {
    jest
      .spyOn(core, "useLazyGetCohortByIdQuery")
      .mockReturnValue([jest.fn()] as any);
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "2",
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);
    const setCurrentCohortMock = jest.spyOn(core, "setCurrentCohortId");

    const { getByText } = render(
      <SaveCohortModal
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
        setAsCurrent
      />,
    );

    await userEvent.type(getByText("Name"), "my new cohort");
    await userEvent.click(getByText("Save"));

    expect(setCurrentCohortMock).toBeCalledWith("2");
  });
});
