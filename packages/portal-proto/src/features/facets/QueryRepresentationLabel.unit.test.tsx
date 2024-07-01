import { render } from "test-utils";
import * as core from "@gff/core";
import QueryRepresentationLabel from "./QueryRepresentationLabel";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useGeneSymbol").mockReturnValue({
  isSuccess: true,
  data: { E10: "TCGA", E40: "FAT3", E60: "FAT4" },
  isError: false,
  isFetching: false,
  isUninitialized: false,
  error: "",
});

describe("<QueryRepresentationLabel />", () => {
  it("handles display of groups", () => {
    const { getByText } = render(
      <QueryRepresentationLabel
        field={"genes.gene_id"}
        value="set_id:ABC"
        geneSymbolDict={{ E10: "TCGA", E40: "FAT3", E60: "FAT4" }}
        geneSymbolSuccess
        useCountHook={jest
          .fn()
          .mockImplementation(() => ({ isSuccess: true, data: 2 }))}
      />,
    );
    expect(getByText("2 input genes")).toBeInTheDocument();
  });

  it("handles display of sets", () => {
    jest.spyOn(core, "selectSetsByType").mockImplementation(() => ({
      123: "my gene set",
    }));

    const { getByText } = render(
      <QueryRepresentationLabel
        field={"genes.gene_id"}
        value="set_id:123"
        geneSymbolDict={{ E10: "TCGA", E40: "FAT3", E60: "FAT4" }}
        geneSymbolSuccess
        useCountHook={jest
          .fn()
          .mockImplementation(() => ({ isSuccess: true, data: 2 }))}
      />,
    );
    expect(getByText("my gene set")).toBeInTheDocument();
  });

  it("displays gene", () => {
    const { getByText } = render(
      <QueryRepresentationLabel
        field={"genes.gene_id"}
        value="E60"
        geneSymbolDict={{ E10: "TCGA", E40: "FAT3", E60: "FAT4" }}
        geneSymbolSuccess
        useCountHook={jest
          .fn()
          .mockImplementation(() => ({ isSuccess: true, data: 2 }))}
      />,
    );
    expect(getByText("FAT4")).toBeInTheDocument();
  });
});
