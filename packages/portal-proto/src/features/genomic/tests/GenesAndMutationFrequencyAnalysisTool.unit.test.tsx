import GenesAndMutationFrequencyAnalysisTool from "../GenesAndMutationFrequencyAnalysisTool";
import * as genomicHook from "src/features/genomic/hooks";
import * as core from "@gff/core";
import * as genomicReducer from "src/features/genomic/appApi";
import { useIsDemoApp, useIsDemoAppType } from "@/hooks/useIsDemoApp";
import { render } from "test-utils";
import { waitFor } from "@testing-library/react";

jest.mock("src/hooks/useIsDemoApp");
jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useCoreSelector: jest.fn(),
  joinFilters: jest.fn().mockReturnValue({}),
  useGetSurvivalPlotQuery: jest.fn().mockReturnValue({
    data: {
      survivalData: [{ donors: [{ id: "1" }] }],
      overallStats: { pValue: 0.5 },
    },
    refetch: jest.fn(),
  }),
  useGeneFrequencyChartQuery: jest.fn().mockReturnValue({
    data: { casesTotal: 0, geneCounts: [] },
    isSuccess: true,
  }),
  useTopGeneQuery: jest.fn().mockReturnValue({}),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(genomicHook, "useGenesFacets").mockImplementation(jest.fn());
  jest
    .spyOn(genomicHook, "useTotalGenomicCounts")
    .mockImplementation(jest.fn());
  jest.spyOn(genomicReducer, "useAppDispatch").mockReturnValue(jest.fn());
  jest.spyOn(genomicReducer, "useAppSelector").mockImplementation(jest.fn());
  jest.clearAllMocks();
});

describe("<GenesAndMutationFrequencyAnalysisTool />", () => {
  it("should show demo text if it is demo mode", async () => {
    (useIsDemoApp as unknown as jest.Mock<useIsDemoAppType>).mockReturnValue(
      true as any,
    );
    jest.spyOn(core, "useCoreSelector").mockReturnValue({});
    const { getByText } = render(<GenesAndMutationFrequencyAnalysisTool />);
    await waitFor(() =>
      expect(
        getByText(
          "Demo showing cases with low grade gliomas (TCGA-LGG project).",
        ),
      ).toBeDefined(),
    );
  });

  it("should NOT show demo text if it is demo mode", async () => {
    (useIsDemoApp as unknown as jest.Mock<useIsDemoAppType>).mockReturnValue(
      false as any,
    );
    jest.spyOn(core, "useCoreSelector").mockReturnValue({});
    const { queryByText } = render(<GenesAndMutationFrequencyAnalysisTool />);
    await waitFor(() =>
      expect(
        queryByText(
          "Demo showing cases with low grade gliomas (TCGA-LGG project).",
        ),
      ).toBeNull(),
    );
  });
});
