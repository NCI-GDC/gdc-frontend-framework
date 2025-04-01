import React from "react";
import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import DateRangeFacet from "../DateRangeFacet";

describe("<DateRangeFacet />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render DataRangeFacet control", async () => {
    const { getByRole } = render(
      <MantineProvider>
        <DateRangeFacet
          field="files.analysis.input_files.created_datetime"
          hooks={{
            useGetFacetFilters: jest.fn(),
            useUpdateFacetFilters: jest.fn(),
            useClearFilter: jest.fn(),
            useTotalCounts: jest.fn(),
            useFieldNameToTitle: jest.fn().mockReturnValue(jest.fn()),
          }}
          facetName="Created Datetime"
        />
        ,
      </MantineProvider>,
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
