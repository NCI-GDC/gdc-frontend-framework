import { render } from "@testing-library/react";
import { CaseSummary } from "./CaseSummary";
import * as func from "@gff/core";

jest.mock("src/pages/_app", () => ({
  URLContext: {},
}));

describe("<CaseSummary />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("should show Loading Overlay when fetching", () => {
    const loadingResponse = {
      data: undefined,
      isError: false,
      isFetching: true,
      isSuccess: true,
      isUninitialized: false,
    };

    jest.spyOn(func, "useCaseSummary").mockReturnValue(loadingResponse);
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

    jest.spyOn(func, "useCaseSummary").mockReturnValue(loadingResponse);
    jest
      .spyOn(func, "useGetAnnotationsQuery")
      .mockReturnValue(loadingResponse as any);
    const { getByText } = render(<CaseSummary case_id="testId" bio_id="" />);

    expect(getByText("Case Not Found")).toBeInTheDocument();
  });
});
