import { render, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";
import CategoricalBinningModal from "./CategoricalBinningModal";

const createGroup = async (queryByText) => {
  await userEvent.click(queryByText("female (10)"));
  await userEvent.click(queryByText("male (90)"));
  await userEvent.click(queryByText("Group"));
  await userEvent.click(document.body);
};

describe("<CategoricalBinningModal />", () => {
  it("display field name", () => {
    const { getByText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{}}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );
    expect(getByText("Create Custom Bins: Gender")).toBeInTheDocument();
  });

  it("shows results if no existing custom bins", () => {
    const { getByText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    expect(getByText("female (10)")).toBeInTheDocument();
    expect(getByText("male (90)")).toBeInTheDocument();
  });

  it("shows existing custom bins", () => {
    const { queryByText, queryByTestId } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 200 }}
        customBins={{ "custom bin": { female: 10, male: 100 } }}
        updateBins={jest.fn()}
      />,
    );

    expect(queryByText("custom bin")).toBeInTheDocument();
    expect(
      queryByText("custom bin")
        .closest("li")
        .contains(queryByText("female (10)")),
    ).toBeTruthy();
    expect(
      queryByTestId("cat-bin-modal-hidden-values").contains(
        queryByText("missing (200)"),
      ),
    ).toBeTruthy();
  });

  it("hide and show value", async () => {
    const { queryByText, queryByTestId } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await userEvent.click(queryByText("female (10)"));

    await userEvent.click(queryByText("Hide"));

    expect(
      queryByTestId("cat-bin-modal-values").contains(
        queryByText("female (10)"),
      ),
    ).toBeFalsy();
    expect(
      queryByTestId("cat-bin-modal-values").contains(queryByText("male (90)")),
    ).toBeTruthy();
    expect(
      queryByTestId("cat-bin-modal-hidden-values").contains(
        queryByText("female (10)"),
      ),
    ).toBeTruthy();

    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("Show"));

    expect(
      queryByTestId("cat-bin-modal-values").contains(
        queryByText("female (10)"),
      ),
    ).toBeTruthy();
    expect(
      queryByTestId("cat-bin-modal-hidden-values").contains(
        queryByText("female (10)"),
      ),
    ).toBeFalsy();
  });

  it("group two values", async () => {
    const { queryByText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await userEvent.click(queryByText("female (10)"));

    const group = queryByText("Group");
    expect(group.closest("button")).toBeDisabled();

    await userEvent.click(queryByText("male (90)"));
    await userEvent.click(group);

    expect(queryByDisplayValue("selected value 1")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(
      queryByText("selected value 1")
        .closest("li")
        .contains(queryByText("female (10)")),
    ).toBeTruthy();
  });

  it("add to existing group", async () => {
    const { queryByText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByText("selected value 1"));
    await userEvent.click(queryByText("missing (20)"));
    await userEvent.click(queryByText("Group"));

    expect(
      queryByText("selected value 1")
        .closest("li")
        .contains(queryByText("missing (20)")),
    ).toBeTruthy();
  });

  it("ungroup one value", async () => {
    const { queryByText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    expect(queryByText("Ungroup").closest("button")).toBeDisabled();

    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("Ungroup"));

    expect(
      queryByText("selected value 1")
        .closest("li")
        .contains(queryByText("female (10)")),
    ).toBeFalsy();
  });

  it("ungroup whole group", async () => {
    const { queryByText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByText("selected value 1"));
    await userEvent.click(queryByText("Ungroup"));

    expect(queryByText("selected value 1")).not.toBeInTheDocument();
    expect(queryByText("female (10)")).toBeInTheDocument();
  });

  it("hide group", async () => {
    const { queryByText, queryByTestId } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByText("selected value 1"));
    await userEvent.click(queryByText("Hide"));

    expect(
      queryByTestId("cat-bin-modal-hidden-values").contains(
        queryByText("female (10)"),
      ),
    ).toBeTruthy();

    expect(queryByText("selected values 1")).not.toBeInTheDocument();
  });

  it("edit group name", async () => {
    const { queryByText, queryByLabelText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByLabelText("edit group name"));
    const input = queryByDisplayValue("selected value 1");
    await userEvent.clear(input);
    await userEvent.type(input, "new group");
    await userEvent.click(document.body);

    expect(queryByText("new group")).toBeInTheDocument();
  });

  it("empty group name is validation failure", async () => {
    const { queryByText, queryByLabelText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByLabelText("edit group name"));
    await userEvent.clear(queryByDisplayValue("selected value 1"));
    await userEvent.click(document.body);
    expect(queryByText("Required field")).toBeInTheDocument();
  });

  it("identical group name is validation failure", async () => {
    const { queryByText, queryByLabelText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByLabelText("edit group name"));
    const input = queryByDisplayValue("selected value 1");
    await userEvent.clear(input);
    await userEvent.type(input, "missing");
    await userEvent.click(document.body);

    expect(queryByText('"missing" already exists')).toBeInTheDocument();
  });

  it("group name same as values is validation failure", async () => {
    const { queryByText, queryByLabelText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByLabelText("edit group name"));
    const input = queryByDisplayValue("selected value 1");
    await userEvent.clear(input);
    await userEvent.type(input, "female");
    await userEvent.click(document.body);

    expect(
      queryByText("The group name cannot be the same as the name of a value"),
    ).toBeInTheDocument();
  });

  it("reset to starting values", async () => {
    const { queryByText, queryByLabelText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    expect(queryByLabelText("reset groups")).toBeDisabled();
    await createGroup(queryByText);

    expect(queryByText("selected value 1")).toBeInTheDocument();
    await userEvent.click(queryByLabelText("reset groups"));

    expect(queryByText("selected value 1")).not.toBeInTheDocument();
  });

  it("reset button available when starting with custom groups", async () => {
    const { queryByLabelText } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={{ female: 10 }}
        updateBins={jest.fn()}
      />,
    );

    const resetButton = queryByLabelText("reset groups");
    expect(resetButton).toBeEnabled();
    await userEvent.click(resetButton);

    expect(resetButton).toBeDisabled();
  });

  it("default names given to groups", async () => {
    const { queryByText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20, other: 10 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByText("missing (20)"));
    await userEvent.click(queryByText("other (10)"));
    await userEvent.click(queryByText("Group"));

    expect(queryByDisplayValue("selected value 2")).toBeInTheDocument();
  });

  it("save new bins", async () => {
    const mockSave = jest.fn();
    const { queryByText, queryByRole } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={mockSave}
      />,
    );

    await createGroup(queryByText);

    await userEvent.click(queryByRole("button", { name: "Save Bins" }));

    expect(mockSave).toBeCalledWith({
      "selected value 1": { female: 10, male: 90 },
      missing: 20,
    });
  });

  it("resets modal state when opened after unsaved changes", async () => {
    const { rerender, queryByText } = render(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    // Make changes but don't save
    await createGroup(queryByText);
    expect(queryByText("selected value 1")).toBeInTheDocument();

    // Close modal
    rerender(
      <CategoricalBinningModal
        opened={false}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    // Reopen modal - should show original state
    rerender(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    // Should not have the unsaved group
    expect(queryByText("selected value 1")).not.toBeInTheDocument();
    expect(queryByText("female (10)")).toBeInTheDocument();
    expect(queryByText("male (90)")).toBeInTheDocument();
  });

  it("show button disabled when no hidden values selected after reset", async () => {
    const { queryByText, queryByLabelText, queryByRole } = render(
      <CategoricalBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    // Hide a value
    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("Hide"));

    // Select the hidden value
    await userEvent.click(queryByText("female (10)"));
    expect(queryByRole("button", { name: "Show" })).not.toBeDisabled();

    // Reset - should clear selections and disable Show button
    await userEvent.click(queryByLabelText("reset groups"));

    // Show button should now be disabled
    expect(queryByRole("button", { name: "Show" })).toBeDisabled();
  });

  it("resets modal when customBins prop changes externally", async () => {
    const { rerender, queryByText } = render(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={{ "existing group": { female: 10, male: 90 } }}
        updateBins={jest.fn()}
      />,
    );

    // Should show existing custom bins
    expect(queryByText("existing group")).toBeInTheDocument();

    // Make some changes in the modal (hide the missing value)
    await userEvent.click(queryByText("missing (20)"));
    await userEvent.click(queryByText("Hide"));

    // External reset - customBins becomes null
    rerender(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={null}
        updateBins={jest.fn()}
      />,
    );

    await waitFor(() => {
      // Should show default state, not the modified state
      expect(queryByText("existing group")).not.toBeInTheDocument();
      expect(queryByText("female (10)")).toBeInTheDocument();
      expect(queryByText("male (90)")).toBeInTheDocument();
      expect(queryByText("missing (20)")).toBeInTheDocument();
    });
  });

  it("maintains state correctly when reopened with same customBins", async () => {
    const customBins = { "saved group": { female: 10, male: 90 } };

    const { rerender, queryByText } = render(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={customBins}
        updateBins={jest.fn()}
      />,
    );

    // Should show existing custom bins
    expect(queryByText("saved group")).toBeInTheDocument();

    // Close modal
    rerender(
      <CategoricalBinningModal
        opened={false}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={customBins}
        updateBins={jest.fn()}
      />,
    );

    // Reopen with same customBins - should maintain the saved state
    rerender(
      <CategoricalBinningModal
        opened={true}
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={customBins}
        updateBins={jest.fn()}
      />,
    );

    expect(queryByText("saved group")).toBeInTheDocument();
  });
});
