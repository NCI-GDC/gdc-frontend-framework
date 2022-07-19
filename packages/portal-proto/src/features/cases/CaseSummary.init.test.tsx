import { render } from "@testing-library/react";
import { CaseSummary } from "./CaseSummary";
import * as func from "@gff/core";

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
    jest.spyOn(func, "useAnnotations").mockReturnValue(loadingResponse);
    const { getByTestId } = render(<CaseSummary case_id="testId" bio_id="" />);

    expect(getByTestId("loading")).toBeInTheDocument();
  });
});
