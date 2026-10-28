import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import AnalysisCard from "./AnalysisCard";
import { AppRegistrationEntry } from "./types";
import { DataFetchingResult } from "src/types";

const baseEntry: AppRegistrationEntry = {
  id: "SequenceReadApp",
  name: "Sequence Reads",
  tags: ["sequenceAnalysis"],
  icon: <></>,
  hasDemo: true,
  countsField: "sequenceReadCaseCount",
  description: "Visualize sequencing reads.",
  noDataTooltip:
    "Current cohort does not have available BAMs for visualization.",
};

const makeCountsHook =
  (result: Partial<DataFetchingResult<number>>) =>
  (): DataFetchingResult<number> =>
    ({
      data: 0,
      isFetching: false,
      isSuccess: true,
      ...result,
    }) as DataFetchingResult<number>;

const renderCard = (
  entry: AppRegistrationEntry,
  counts = makeCountsHook({ data: 100 }),
) =>
  render(
    <MantineProvider>
      <AnalysisCard
        entry={entry}
        descriptionVisible={false}
        setDescriptionVisible={jest.fn()}
        useApplicationDataCounts={counts}
      />
    </MantineProvider>,
  );

describe("<AnalysisCard />", () => {
  it("shows the case count and an enabled launch link when active", () => {
    renderCard(baseEntry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("100 Cases")).toBeInTheDocument();
    const launch = screen.getByRole("link", { name: "Sequence Reads" });
    expect(launch).toHaveAttribute("aria-disabled", "false");
    expect(launch).not.toHaveAttribute("tabindex", "-1");
  });

  it("renders the status label instead of the count and disables the launch link", () => {
    const entry: AppRegistrationEntry = {
      ...baseEntry,
      status: { label: "Not Available" },
    };
    // data is non-zero to prove the status (not the count) forces inactive
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("Not Available")).toBeInTheDocument();
    expect(screen.queryByText("100 Cases")).not.toBeInTheDocument();
    // status has its own test id and does not reuse the case-count one
    expect(screen.getByTestId("text-status-tool")).toBeInTheDocument();
    expect(
      screen.queryByTestId("text-case-count-tool"),
    ).not.toBeInTheDocument();

    const launch = screen.getByRole("link", { name: "Sequence Reads" });
    expect(launch).toHaveAttribute("aria-disabled", "true");
    expect(launch).toHaveAttribute("tabindex", "-1");
    // click / Enter activation should be prevented (returns false when the
    // default was prevented)
    expect(fireEvent.click(launch)).toBe(false);
  });

  it("hides the Demo link when a status is set", () => {
    const entry: AppRegistrationEntry = {
      ...baseEntry,
      status: { label: "Not Available" },
    };
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.queryByText("Demo")).not.toBeInTheDocument();
  });

  it("shows the Demo link when active", () => {
    renderCard(baseEntry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("renders status details as a focusable, labeled button", () => {
    const details = "This tool is temporarily unavailable.";
    const entry: AppRegistrationEntry = {
      ...baseEntry,
      status: { label: "Not Available", details },
    };
    renderCard(entry, makeCountsHook({ data: 100 }));

    // ActionIcon renders a focusable button; keyboard users can reach it
    const info = screen.getByRole("button", { name: details });
    expect(info).toBeInTheDocument();
    expect(info).not.toHaveAttribute("tabindex", "-1");
  });

  it("disables the launch link and shows the no-data info button when count is zero", () => {
    renderCard(baseEntry, makeCountsHook({ data: 0 }));

    const launch = screen.getByRole("link", { name: "Sequence Reads" });
    expect(launch).toHaveAttribute("aria-disabled", "true");
    expect(fireEvent.click(launch)).toBe(false);
    expect(
      screen.getByRole("button", { name: baseEntry.noDataTooltip }),
    ).toBeInTheDocument();
  });

  it("does not render an info button at zero count when noDataTooltip is absent", () => {
    const entry: AppRegistrationEntry = {
      ...baseEntry,
      noDataTooltip: undefined,
    };
    renderCard(entry, makeCountsHook({ data: 0 }));

    expect(screen.getByText("0 Cases")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "" })).not.toBeInTheDocument();
    // only the description-toggle button remains (named after the tool)
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders neither a count nor a status when hideCounts is set", () => {
    const entry: AppRegistrationEntry = { ...baseEntry, hideCounts: true };
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.queryByText("100 Cases")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-case-count-tool"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("text-status-tool")).not.toBeInTheDocument();
  });
});
