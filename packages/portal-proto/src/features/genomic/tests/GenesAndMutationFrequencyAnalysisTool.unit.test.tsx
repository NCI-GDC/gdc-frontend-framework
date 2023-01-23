import { render } from "@testing-library/react";
import GenesAndMutationFrequencyAnalysisTool from "../GenesAndMutationFrequencyAnalysisTool";
import * as routerHook from "next/router";
import * as hook from "src/hooks/useIsDemoApp";
import * as core from "@gff/core";
import * as genomicReducer from "src/features/genomic/appApi";

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
  jest.spyOn(genomicReducer, "useAppDispatch").mockImplementation(jest.fn());
  jest.spyOn(genomicReducer, "useAppSelector").mockImplementation(jest.fn());
});

describe.skip("<GenesAndMutationFrequencyAnalysisTool />", () => {
  it("should show demo text if it is demo mode", () => {
    jest
      .spyOn(routerHook, "useRouter")
      .mockReturnValueOnce({ query: { demoMode: true } } as any);
    jest.spyOn(hook, "useIsDemoApp").mockReturnValueOnce(true);
    const { getByText } = render(<GenesAndMutationFrequencyAnalysisTool />);
    expect(
      getByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeDefined();
  });

  it("should NOT show demo text if it is demo mode", () => {
    jest
      .spyOn(routerHook, "useRouter")
      .mockReturnValueOnce({ query: { demoMode: false } } as any);
    jest.spyOn(hook, "useIsDemoApp").mockReturnValueOnce(false);
    const { queryByText } = render(<GenesAndMutationFrequencyAnalysisTool />);
    expect(
      queryByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeNull();
  });
});
