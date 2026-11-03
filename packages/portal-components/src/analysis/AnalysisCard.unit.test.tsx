import React from "react";
import { render, screen } from "@testing-library/react";
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
  });

  it("renders Not Available instead of the count and disables the launch link when unavailable", () => {
    const entry: AppRegistrationEntry = { ...baseEntry, unavailable: true };
    // data is non-zero to prove unavailable (not the count) disables the card
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("Not Available")).toBeInTheDocument();
    expect(screen.queryByText("100 Cases")).not.toBeInTheDocument();
    // the unavailable text has its own test id and does not reuse the case-count one
    expect(screen.getByTestId("text-status-tool")).toBeInTheDocument();
    expect(
      screen.queryByTestId("text-case-count-tool"),
    ).not.toBeInTheDocument();

    const launch = screen.getByRole("link", { name: "Sequence Reads" });
    expect(launch).toHaveAttribute("aria-disabled", "true");
  });

  it("shows a disabled Demo link when unavailable", () => {
    const entry: AppRegistrationEntry = { ...baseEntry, unavailable: true };
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("Demo")).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps the Demo link enabled when the current cohort has no cases", () => {
    renderCard(baseEntry, makeCountsHook({ data: 0 }));

    expect(screen.getByText("Demo")).toHaveAttribute("aria-disabled", "false");
  });

  it("shows an enabled Demo link when active", () => {
    renderCard(baseEntry, makeCountsHook({ data: 100 }));

    expect(screen.getByText("Demo")).toHaveAttribute("aria-disabled", "false");
  });

  it("disables the launch link but not the card status when count is zero", () => {
    renderCard(baseEntry, makeCountsHook({ data: 0 }));

    const launch = screen.getByRole("link", { name: "Sequence Reads" });
    expect(launch).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("0 Cases")).toBeInTheDocument();
    expect(screen.queryByText("Not Available")).not.toBeInTheDocument();
  });

  it("renders neither a count nor Not Available when hideCounts is set", () => {
    const entry: AppRegistrationEntry = { ...baseEntry, hideCounts: true };
    renderCard(entry, makeCountsHook({ data: 100 }));

    expect(screen.queryByText("100 Cases")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-case-count-tool"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("text-status-tool")).not.toBeInTheDocument();
  });
});
