import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import { Statistics } from "@gff/core";
import ContinuousBinningModal from "./ContinuousBinningModal";

describe("<ContinuousBinningModal />", () => {
  it("shows field name", () => {
    const { getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(
      getByText("Create Custom Bins: Age At Diagnoses"),
    ).toBeInTheDocument();
  });

  it("show available values and bin size", () => {
    const { getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(
      getByText("Available values from", { exact: false }).textContent.includes(
        "0 to < 2",
      ),
    ).toBeTruthy();
    expect(
      getByText("Bin size in quarters", { exact: false }).textContent.includes(
        "0.5",
      ),
    ).toBeTruthy();
  });

  it("populates interval values", () => {
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByTestId("textbox-set-interval-size")).toHaveDisplayValue("0.5");
    expect(getByTestId("textbox-set-interval-min")).toHaveDisplayValue("0");
    expect(getByTestId("textbox-set-interval-max")).toHaveDisplayValue("2");
  });

  it("shows custom interval if one already set", () => {
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={{ interval: 5, min: 0, max: 10 }}
      />,
    );

    expect(getByTestId("textbox-set-interval-size")).toHaveDisplayValue("5");
    expect(getByTestId("textbox-set-interval-min")).toHaveDisplayValue("0");
    expect(getByTestId("textbox-set-interval-max")).toHaveDisplayValue("10");
  });

  it("validates intervals", async () => {
    const { getByTestId, getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    const input = getByTestId("textbox-set-interval-size");
    await userEvent.clear(input);
    await userEvent.type(input, "mmm");
    expect(getByText("mmm is not a valid number")).toBeInTheDocument();
  });

  it("shows an empty range row to start", () => {
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByTestId("textbox-range-name")).toHaveDisplayValue("");
    expect(getByTestId("textbox-range-from")).toHaveDisplayValue("");
    expect(getByTestId("textbox-range-to")).toHaveDisplayValue("");
  });

  it("shows custom ranges to start if available", () => {
    const { getAllByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={[
          { name: "bin 1", from: 0, to: 10 },
          { name: "bin 2", from: 10, to: 20 },
        ]}
      />,
    );

    const rangeNames = getAllByTestId("textbox-range-name");
    expect(rangeNames[0]).toHaveDisplayValue("bin 1");
    expect(rangeNames[1]).toHaveDisplayValue("bin 2");

    const rangeFrom = getAllByTestId("textbox-range-from");
    expect(rangeFrom[0]).toHaveDisplayValue("0");
    expect(rangeFrom[1]).toHaveDisplayValue("10");

    const rangeTo = getAllByTestId("textbox-range-to");
    expect(rangeTo[0]).toHaveDisplayValue("10");
    expect(rangeTo[1]).toHaveDisplayValue("20");
  });

  it("validates row on add", async () => {
    const { getByTestId, getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    await userEvent.type(getByTestId("textbox-range-name"), "bin 1");
    await userEvent.type(getByTestId("textbox-range-from"), "10");

    expect(getByTestId("button-range-add")).toBeDisabled();

    await userEvent.type(getByTestId("textbox-range-to"), "5");
    await userEvent.click(getByTestId("button-range-add"));

    expect(getByText("Must be greater than 10")).toBeInTheDocument();
  });

  it("can delete row", async () => {
    const { getByTestId, getAllByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    await userEvent.type(getByTestId("textbox-range-name"), "bin 1");
    await userEvent.type(getByTestId("textbox-range-from"), "10");
    await userEvent.type(getByTestId("textbox-range-to"), "20");
    await userEvent.click(getByTestId("button-range-add"));

    expect(getAllByTestId("textbox-range-name")[0]).toHaveDisplayValue("bin 1");
    // New blank row added
    expect(getAllByTestId("textbox-range-name")[1]).toHaveDisplayValue("");
    await userEvent.click(getByTestId("button-range-delete"));
    expect(getAllByTestId("textbox-range-name")[0]).toHaveDisplayValue("");
  });

  it("can save custom interval", async () => {
    const mockSave = jest.fn();
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={mockSave}
        customBins={null}
      />,
    );

    const intervalInput = getByTestId("textbox-set-interval-size");
    const fromInput = getByTestId("textbox-set-interval-min");
    const toInput = getByTestId("textbox-set-interval-max");

    await userEvent.clear(intervalInput);
    await userEvent.type(intervalInput, "1");
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "5");
    await userEvent.clear(toInput);
    await userEvent.type(toInput, "10");

    await userEvent.click(getByTestId("button-custom-bins-save"));

    expect(mockSave).toBeCalledWith({ interval: 1, min: 5, max: 10 });
  });

  it("can save custom ranges", async () => {
    const mockSave = jest.fn();
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={mockSave}
        customBins={null}
      />,
    );
    await userEvent.type(getByTestId("textbox-range-name"), "bin 1");
    await userEvent.type(getByTestId("textbox-range-from"), "5");
    expect(getByTestId("button-custom-bins-save")).toBeDisabled();

    await userEvent.type(getByTestId("textbox-range-to"), "10");
    await userEvent.click(getByTestId("button-range-add"));

    await userEvent.click(getByTestId("button-custom-bins-save"));
    expect(mockSave).toBeCalledWith([{ name: "bin 1", from: 5, to: 10 }]);
  });

  it("reset to default values", async () => {
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByTestId("button-reset-bins")).toBeDisabled();
    const input = getByTestId("textbox-set-interval-size");
    await userEvent.clear(input);
    await userEvent.type(input, ".75");
    expect(input).toHaveDisplayValue(".75");

    await userEvent.click(getByTestId("button-reset-bins"));

    expect(input).toHaveDisplayValue("0.5");
  });

  it("reset button available when starting with custom bins", async () => {
    const { getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={{ interval: 5, min: 0, max: 10 }}
      />,
    );

    const input = getByTestId("textbox-set-interval-size");
    const resetButton = getByTestId("button-reset-bins");
    expect(resetButton).toBeEnabled();
    await userEvent.click(resetButton);

    expect(input).toHaveDisplayValue("0.5");
    expect(resetButton).toBeDisabled();
  });

  it("can save changes to custom bins", async () => {
    const saveBins = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={saveBins}
        customBins={[
          { name: "bin 1", from: 0, to: 10 },
          { name: "bin 2", from: 10, to: 20 },
        ]}
      />,
    );

    const rangeName = getAllByTestId("textbox-range-name")[0];
    await userEvent.clear(rangeName);
    await userEvent.type(rangeName, "bin 1000");
    await userEvent.click(getByTestId("button-custom-bins-save"));

    expect(saveBins).toHaveBeenCalledWith([
      { name: "bin 1000", from: 0, to: 10 },
      { name: "bin 2", from: 10, to: 20 },
    ]);
  });

  it("changes to range inputs validates overlapping bins", async () => {
    const { getAllByTestId, getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={[
          { name: "bin 1", from: 0, to: 10 },
          { name: "bin 2", from: 10, to: 20 },
        ]}
      />,
    );

    const rangeFrom = getAllByTestId("textbox-range-from")[1];
    await userEvent.clear(rangeFrom);
    await userEvent.type(rangeFrom, "5");
    await userEvent.click(document.body);

    expect(getByText("'bin 2' overlaps with 'bin 1'")).toBeInTheDocument();
  });
});
