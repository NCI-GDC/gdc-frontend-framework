import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoricalBinningModal from "./CategoricalBinningModal";

describe("<CategoricalBinningModal />", () => {
  it("display field name", () => {
    const { getByText } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{}}
        customBins={{}}
        updateBins={jest.fn()}
      />,
    );
    expect(getByText("Create Custom Bins: Gender")).toBeInTheDocument();
  });

  it("shows results if no existing custom bins", () => {
    const { getByText } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={{}}
        updateBins={jest.fn()}
      />,
    );

    expect(getByText("female (10)")).toBeInTheDocument();
    expect(getByText("male (90)")).toBeInTheDocument();
  });

  it("shows existing custom bins", () => {
    const { queryByText } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={{ "custom bin": 100 }}
        updateBins={jest.fn()}
      />,
    );

    expect(queryByText("female (10)")).not.toBeInTheDocument();
    expect(queryByText("custom bin (100)")).toBeInTheDocument();
  });

  it("hide and show value", async () => {
    const { queryByText, queryByTestId } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={{}}
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
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90 }}
        customBins={{}}
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
      queryByText("selected value 1").contains(queryByText("female (10)")),
    ).toBeTruthy();
  });
  it("add to existing group", async () => {
    const { queryByText } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={{}}
        updateBins={jest.fn()}
      />,
    );

    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("male (90)"));

    const group = queryByText("Group");
    await userEvent.click(group);

    await userEvent.click(document.body);

    await userEvent.click(queryByText("selected value 1"));
    await userEvent.click(queryByText("missing (20)"));
    await userEvent.click(group);

    expect(
      queryByText("selected value 1").contains(queryByText("missing (20)")),
    ).toBeTruthy();
  });
  it("ungroup one value", () => {});

  it("ungroup whole group", () => {});

  it("hide group", () => {});

  it("edit group name", () => {});

  it("empty group name is validation failure", () => {});
  it("identical group name is validation failure", () => {});
  it("empty group name is validation failure", () => {});

  it("reset to starting values", () => {});

  it("default names given to groups", async () => {
    const { queryByText, queryByDisplayValue } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20, other: 10 }}
        customBins={{}}
        updateBins={jest.fn()}
      />,
    );

    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("male (90)"));

    const group = queryByText("Group");
    await userEvent.click(group);

    await userEvent.click(queryByText("missing (20)"));
    await userEvent.click(queryByText("other (10)"));
    await userEvent.click(group);

    expect(queryByDisplayValue("selected value 2")).toBeInTheDocument();
  });

  it("save new bins", async () => {
    const mockSave = jest.fn();
    const { queryByText, queryByRole } = render(
      <CategoricalBinningModal
        setModalOpen={jest.fn()}
        field={"Gender"}
        results={{ female: 10, male: 90, missing: 20 }}
        customBins={{}}
        updateBins={mockSave}
      />,
    );

    await userEvent.click(queryByText("female (10)"));
    await userEvent.click(queryByText("male (90)"));
    await userEvent.click(queryByText("Group"));
    await userEvent.click(document.body);

    await userEvent.click(queryByRole("button", { name: "Save Bins" }));

    expect(mockSave).toBeCalledWith({
      "selected value 1": { female: 10, male: 90 },
      missing: 20,
    });
  });
});
