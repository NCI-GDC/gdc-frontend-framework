import { render } from "test-utils";
import DateRangeFacet from "../DateRangeFacet";
import * as core from "@gff/core";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe("<DateRangeFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("render DataRangeFacet control", async () => {
    const { getByRole } = render(
      <DateRangeFacet
        field="files.analysis.input_files.created_datetime"
        width="w-1/3"
        hooks={
          {
            useGetFacetFilters: jest.fn(),
            useUpdateFacetFilters: jest.fn(),
            useClearFilter: jest.fn(),
          } as any
        }
      />,
    );

    expect(
      getByRole("textbox", {
        name: "Set the through value",
      }),
    ).toBeInTheDocument();

    expect(
      getByRole("textbox", {
        name: "Set the since value",
      }),
    ).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "open the date range picker",
      }),
    ).toBeInTheDocument();
  });
});
