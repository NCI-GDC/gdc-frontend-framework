import { render } from "@testing-library/react";
import * as core from "@gff/core";
import { CoreProvider } from "@gff/core";
import { QueryExpressionsExpandedContext } from "../QueryExpressionSection";
import { convertFilterToComponent } from "../QueryRepresentation";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useGeneSymbol").mockReturnValue({
  isSuccess: true,
  data: { E10: "TCGA", E40: "FAT3", E60: "FAT4" },
  isError: false,
  isFetching: false,
  isUninitialized: false,
  error: "",
});

describe("<QueryRepresentation />", () => {
  it("handles display of groups", () => {
    jest
      .spyOn(core, "selectCurrentCohortGroupsByField")
      .mockImplementation(() => [
        { ids: ["E10", "E40"], field: "genes.gene_id", setId: "123" },
      ]);

    const { getByText } = render(
      <CoreProvider>
        <QueryExpressionsExpandedContext.Provider value={[{}, jest.fn()]}>
          {convertFilterToComponent({
            operator: "includes",
            operands: ["E10", "E40", "E60"],
            field: "genes.gene_id",
          })}
        </QueryExpressionsExpandedContext.Provider>
      </CoreProvider>,
    );
    expect(getByText("2 input genes")).toBeInTheDocument();
    expect(getByText("FAT4")).toBeInTheDocument();
  });

  it("handles display of sets", () => {
    jest
      .spyOn(core, "selectCurrentCohortGroupsByField")
      .mockImplementation(() => [
        {
          ids: ["E10", "E40"],
          field: "genes.gene_id",
          setId: "123",
          setType: "genes",
        },
      ]);
    jest.spyOn(core, "selectAllSets").mockImplementation(() => ({
      genes: { 123: "my gene set" },
      cases: {},
      ssms: {},
    }));

    const { getByText } = render(
      <CoreProvider>
        <QueryExpressionsExpandedContext.Provider value={[{}, jest.fn()]}>
          {convertFilterToComponent({
            operator: "includes",
            operands: ["E10", "E40", "E60"],
            field: "genes.gene_id",
          })}
        </QueryExpressionsExpandedContext.Provider>
      </CoreProvider>,
    );
    expect(getByText("my gene set")).toBeInTheDocument();
    expect(getByText("FAT4")).toBeInTheDocument();
  });
});
