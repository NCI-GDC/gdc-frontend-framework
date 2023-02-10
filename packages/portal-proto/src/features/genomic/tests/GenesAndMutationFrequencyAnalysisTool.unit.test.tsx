import { render } from "@testing-library/react";
import { CoreProvider } from "@gff/core";
import GenesAndMutationFrequencyAnalysisTool from "../GenesAndMutationFrequencyAnalysisTool";
import * as genomicHook from "src/features/genomic/hooks";
import * as core from "@gff/core";
import * as genomicReducer from "src/features/genomic/appApi";
import { useIsDemoApp, useIsDemoAppType } from "@/hooks/useIsDemoApp";
import { SummaryModalContext } from "src/pages/_app";

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
  it("should show demo text if it is demo mode", () => {
    (useIsDemoApp as unknown as jest.Mock<useIsDemoAppType>).mockReturnValue(
      true as any,
    );
    const { getByText } = render(
      <CoreProvider>
        <SummaryModalContext.Provider
          value={{
            entityMetadata: {
              entity_type: null,
              entity_id: null,
              entity_name: null,
            },
            setEntityMetadata: jest.fn(),
          }}
        >
          <GenesAndMutationFrequencyAnalysisTool />
        </SummaryModalContext.Provider>
      </CoreProvider>,
    );

    expect(
      getByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeDefined();
  });

  it("should NOT show demo text if it is demo mode", () => {
    (useIsDemoApp as unknown as jest.Mock<useIsDemoAppType>).mockReturnValue(
      false as any,
    );
    const { queryByText } = render(
      <CoreProvider>
        <SummaryModalContext.Provider
          value={{
            entityMetadata: {
              entity_type: null,
              entity_id: null,
              entity_name: null,
            },
            setEntityMetadata: jest.fn(),
          }}
        >
          <GenesAndMutationFrequencyAnalysisTool />
        </SummaryModalContext.Provider>
      </CoreProvider>,
    );
    expect(
      queryByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeNull();
  });
});
