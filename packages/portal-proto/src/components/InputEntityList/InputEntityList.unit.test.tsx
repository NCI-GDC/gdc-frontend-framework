import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import InputEntityList from "./InputEntityList";
import { UserInputContext } from "@/components/Modals/UserInputModal";
import UpdateCohortButton from "@/components/Modals/SetModals/UpdateFiltersButton";
import SaveSetButton from "../SaveSetButton";
import { render } from "test-utils";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useCoreSelector").mockReturnValue(jest.fn());
jest.spyOn(core, "fetchGdcEntities").mockResolvedValue({
  data: {
    hits: [
      { ssm_id: "7890-123", genomic_dna_change: "crg1:6" },
      { ssm_id: "6013-009", genomic_dna_change: "crg7:0" },
    ],
  },
} as any);

const createSet = jest.fn();
const createSetHook = jest.fn().mockReturnValue([createSet, {}]);

const renderInputEntityList = () => {
  return render(
    <UserInputContext.Provider value={[false, jest.fn()]}>
      <InputEntityList
        inputInstructions="do stuff to have stuff happen"
        identifierToolTip="ids"
        textInputPlaceholder="ex. TCGA"
        entityType="ssms"
        entityLabel="mutation"
        hooks={{
          updateFilters: jest.fn(),
          createSet: createSetHook,
          getExistingFilters: jest.fn(),
        }}
        LeftButton={SaveSetButton}
        RightButton={UpdateCohortButton}
      />
    </UserInputContext.Provider>,
  );
};

describe("<InputEntityList />", () => {
  it("create set with matched ids", async () => {
    const { getByRole, getByPlaceholderText, getByText } =
      renderInputEntityList();

    await userEvent.type(getByPlaceholderText("ex. TCGA"), "7890-123");
    await waitFor(
      () => expect(getByText("Summary Table")).toBeInTheDocument(),
      { timeout: 2000 },
    );
    const saveButton = getByRole("button", { name: "Save Set" });
    await waitFor(() => expect(saveButton).toBeEnabled());
    await userEvent.click(saveButton);
    await userEvent.type(getByPlaceholderText("New Set Name"), "my set");
    await userEvent.click(
      getByRole("button", { name: "Save button to add a set" }),
    );

    expect(createSet).toBeCalledWith({ values: ["7890-123"] });
  });

  it("Clear button should be disabled initially", () => {
    const { getByRole } = renderInputEntityList();
    const clearButton = getByRole("button", { name: "Clear" });
    expect(clearButton).toBeDisabled();
  });

  it("should reset state when Clear button is clicked", async () => {
    const { queryByText, getByPlaceholderText, getByRole } =
      renderInputEntityList();
    const inputTextarea = getByPlaceholderText("ex. TCGA");

    await userEvent.type(inputTextarea, "7890-123");
    const saveButton = getByRole("button", { name: "Save Set" });
    const clearButton = getByRole("button", { name: "Clear" });

    await waitFor(() => expect(clearButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
    await userEvent.click(clearButton);
    expect(inputTextarea).toHaveValue("");

    await waitFor(() => expect(queryByText("Summary Table")).toBeNull());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });
});
