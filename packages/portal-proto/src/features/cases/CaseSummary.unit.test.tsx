import { render } from "test-utils";
import { CaseSummary } from "./CaseSummary";
import * as func from "@gff/core";

// Mock the entire module
jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreSelector: jest.fn(),
  useCoreDispatch: jest.fn(),
  useGetCasesQuery: jest.fn(),
  useGetAnnotationsQuery: jest.fn(),
}));

jest.mock("src/pages/_app", () => ({
  URLContext: {},
}));

describe("<CaseSummary />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show Loading Overlay when fetching", () => {
    const loadingResponse = {
      data: undefined,
      isError: false,
      isFetching: true,
      isSuccess: true,
      isUninitialized: false,
    };

    jest
      .spyOn(func, "useGetCasesQuery")
      .mockReturnValue(loadingResponse as any);
    jest
      .spyOn(func, "useGetAnnotationsQuery")
      .mockReturnValue(loadingResponse as any);
    const { getByTestId } = render(<CaseSummary case_id="testId" bio_id="" />);

    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should show case not found error when wrong case id has been entered i.e, data is undefined", () => {
    const loadingResponse = {
      data: undefined,
      isError: false,
      isFetching: false,
      isSuccess: true,
      isUninitialized: false,
    };

    jest
      .spyOn(func, "useGetCasesQuery")
      .mockReturnValue(loadingResponse as any);
    jest
      .spyOn(func, "useGetAnnotationsQuery")
      .mockReturnValue(loadingResponse as any);
    const { getByText } = render(<CaseSummary case_id="testId" bio_id="" />);

    expect(getByText("Case Not Found")).toBeInTheDocument();
  });
});
