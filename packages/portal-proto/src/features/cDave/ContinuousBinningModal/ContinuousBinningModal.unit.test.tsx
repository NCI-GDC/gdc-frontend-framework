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
    const { getByLabelText, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByLabelText("Bin size")).toHaveDisplayValue("0.5");
    expect(getAllByLabelText("From")[0]).toHaveDisplayValue("0");
    expect(getAllByLabelText("To less than")[0]).toHaveDisplayValue("2");
  });

  it("shows custom interval if one already set", () => {
    const { getByLabelText, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"Gender"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={{ interval: 5, min: 0, max: 10 }}
      />,
    );

    expect(getByLabelText("Bin size")).toHaveDisplayValue("5");
    expect(getAllByLabelText("From")[0]).toHaveDisplayValue("0");
    expect(getAllByLabelText("To less than")[0]).toHaveDisplayValue("10");
  });

  it("validates intervals", async () => {
    const { getByLabelText, getByText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    const input = getByLabelText("Bin size");
    await userEvent.clear(input);
    await userEvent.type(input, "mmm");
    expect(getByText("mmm is not a valid number")).toBeInTheDocument();
  });

  it("shows an empty range row to start", () => {
    const { getByLabelText, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByLabelText("Bin name")).toHaveDisplayValue("");
    expect(getAllByLabelText("From")[1]).toHaveDisplayValue("");
    expect(getAllByLabelText("To less than")[1]).toHaveDisplayValue("");
  });

  it("shows custom ranges to start if available", () => {
    const { getAllByLabelText } = render(
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

    const rangeNames = getAllByLabelText("Bin name");
    expect(rangeNames[0]).toHaveDisplayValue("bin 1");
    expect(rangeNames[1]).toHaveDisplayValue("bin 2");

    const rangeFrom = getAllByLabelText("From");
    expect(rangeFrom[1]).toHaveDisplayValue("0");
    expect(rangeFrom[2]).toHaveDisplayValue("10");

    const rangeTo = getAllByLabelText("To less than");
    expect(rangeTo[1]).toHaveDisplayValue("10");
    expect(rangeTo[2]).toHaveDisplayValue("20");
  });

  it("validates row on add", async () => {
    const { getByLabelText, getByText, getByRole, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    await userEvent.type(getByLabelText("Bin name"), "bin 1");
    await userEvent.type(getAllByLabelText("From")[1], "10");

    expect(getByRole("button", { name: "Add range" })).toBeDisabled();

    await userEvent.type(getAllByLabelText("To less than")[1], "5");
    await userEvent.click(getByRole("button", { name: "Add range" }));

    expect(getByText("Must be greater than 10")).toBeInTheDocument();
  });

  it("can delete row", async () => {
    const { getByLabelText, getAllByLabelText, getByRole } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    await userEvent.type(getByLabelText("Bin name"), "bin 1");
    await userEvent.type(getAllByLabelText("From")[1], "10");
    await userEvent.type(getAllByLabelText("To less than")[1], "20");
    await userEvent.click(getByRole("button", { name: "Add range" }));

    expect(getAllByLabelText("Bin name")[0]).toHaveDisplayValue("bin 1");
    // New blank row added
    expect(getAllByLabelText("Bin name")[1]).toHaveDisplayValue("");
    await userEvent.click(getByRole("button", { name: "delete row" }));
    expect(getAllByLabelText("Bin name")[0]).toHaveDisplayValue("");
  });

  it("can save custom interval", async () => {
    const mockSave = jest.fn();
    const { getByLabelText, getByRole, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={mockSave}
        customBins={null}
      />,
    );

    const intervalInput = getByLabelText("Bin size");
    const fromInput = getAllByLabelText("From")[0];
    const toInput = getAllByLabelText("To less than")[0];

    await userEvent.clear(intervalInput);
    await userEvent.type(intervalInput, "1");
    await userEvent.clear(fromInput);
    await userEvent.type(fromInput, "5");
    await userEvent.clear(toInput);
    await userEvent.type(toInput, "10");

    await userEvent.click(getByRole("button", { name: "Save Bins" }));

    expect(mockSave).toBeCalledWith({ interval: 1, min: 5, max: 10 });
  });

  it("can save custom ranges", async () => {
    const mockSave = jest.fn();
    const { getByLabelText, getByRole, getAllByLabelText } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={mockSave}
        customBins={null}
      />,
    );
    await userEvent.type(getByLabelText("Bin name"), "bin 1");
    await userEvent.type(getAllByLabelText("From")[1], "5");
    expect(getByRole("button", { name: "Save Bins" })).toBeDisabled();

    await userEvent.type(getAllByLabelText("To less than")[1], "10");
    await userEvent.click(getByRole("button", { name: "Add range" }));

    await userEvent.click(getByRole("button", { name: "Save Bins" }));
    expect(mockSave).toBeCalledWith([{ name: "bin 1", from: 5, to: 10 }]);
  });

  it("reset to default values", async () => {
    const { getByLabelText, getByRole } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={null}
      />,
    );

    expect(getByRole("button", { name: "reset bins" })).toBeDisabled();
    const input = getByLabelText("Bin size");
    await userEvent.clear(input);
    await userEvent.type(input, ".75");
    expect(input).toHaveDisplayValue(".75");

    await userEvent.click(getByRole("button", { name: "reset bins" }));

    expect(input).toHaveDisplayValue("0.5");
  });

  it("reset button available when starting with custom bins", async () => {
    const { getByLabelText, getByRole } = render(
      <ContinuousBinningModal
        opened
        setModalOpen={jest.fn()}
        field={"diagnoses.age_at_diagnoses"}
        stats={{ min: 0, max: 1 } as Statistics}
        updateBins={jest.fn()}
        customBins={{ interval: 5, min: 0, max: 10 }}
      />,
    );

    const input = getByLabelText("Bin size");
    const resetButton = getByRole("button", { name: "reset bins" });
    expect(resetButton).toBeEnabled();
    await userEvent.click(resetButton);

    expect(input).toHaveDisplayValue("0.5");
    expect(resetButton).toBeDisabled();
  });

  it("can save changes to custom bins", async () => {
    const saveBins = jest.fn();
    const { getAllByLabelText, getByRole } = render(
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

    const rangeName = getAllByLabelText("Bin name")[0];
    await userEvent.clear(rangeName);
    await userEvent.type(rangeName, "bin 1000");
    await userEvent.click(getByRole("button", { name: "Save Bins" }));

    expect(saveBins).toHaveBeenCalledWith([
      { name: "bin 1000", from: 0, to: 10 },
      { name: "bin 2", from: 10, to: 20 },
    ]);
  });

  it("changes to range inputs validates overlapping bins", async () => {
    const { getAllByLabelText, getByText } = render(
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

    const rangeFrom = getAllByLabelText("From")[2];
    await userEvent.clear(rangeFrom);
    await userEvent.type(rangeFrom, "5");
    await userEvent.click(document.body);

    expect(getByText("'bin 2' overlaps with 'bin 1'")).toBeInTheDocument();
  });
});
