import GenesAndMutationFrequencyAnalysisTool from "../GenesAndMutationFrequencyAnalysisTool";
import * as genomicHook from "src/features/genomic/hooks";
import * as core from "@gff/core";
import * as genomicReducer from "src/features/genomic/appApi";
import { useIsDemoApp, useIsDemoAppType } from "@/hooks/useIsDemoApp";
import { render, waitFor } from "test-utils";

jest.mock("src/hooks/useIsDemoApp");

beforeEach(() => {
  jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());
  jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  jest.spyOn(core, "joinFilters").mockReturnValue({} as core.FilterSet);
  jest.spyOn(core, "useGetSurvivalPlotQuery").mockReturnValue({
    data: {
      survivalData: [{ donors: [{ id: "1" }] }],
      overallStats: { pValue: 0.5 },
    },
    refetch: jest.fn(),
  });
  jest.spyOn(genomicHook, "useGenesFacets").mockImplementation(jest.fn());
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
