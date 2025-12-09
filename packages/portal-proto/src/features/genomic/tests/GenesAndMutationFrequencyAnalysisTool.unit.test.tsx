import GenesAndMutationFrequencyAnalysisTool from "../GenesAndMutationFrequencyAnalysisTool";
import * as core from "@gff/core";
import * as genomicReducer from "src/features/genomic/appApi";
import { useIsDemoApp, useIsDemoAppType } from "@/hooks/useIsDemoApp";
import { render } from "test-utils";

jest.mock("src/hooks/useIsDemoApp");
jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useCoreSelector: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("src/features/genomic/GeneAndSSMFilterPanel");
jest.mock("src/features/genomic/GenesPanel");
jest.mock("src/features/genomic/SSMSPanel");

beforeEach(() => {
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
    expect(
      getByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeDefined();
  });

  it("should NOT show demo text if it is demo mode", async () => {
    (useIsDemoApp as unknown as jest.Mock<useIsDemoAppType>).mockReturnValue(
      false as any,
    );
    jest.spyOn(core, "useCoreSelector").mockReturnValue({});
    const { queryByText } = render(<GenesAndMutationFrequencyAnalysisTool />);
    expect(
      queryByText(
        "Demo showing cases with low grade gliomas (TCGA-LGG project).",
      ),
    ).toBeNull();
  });
});
