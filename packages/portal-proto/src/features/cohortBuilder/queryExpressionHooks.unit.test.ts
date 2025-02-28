import { renderHook, waitFor } from "@testing-library/react";
import queryExpressionHooks from "./queryExpressionHooks";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useLazyGeneSetCountQuery: jest
    .fn()
    .mockImplementation(() => [
      jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue(2) }),
    ]),
  useLazySsmSetCountQuery: jest.fn().mockReturnValue([jest.fn()]),
  useLazyCaseSetCountQuery: jest.fn().mockReturnValue([jest.fn()]),
  useLazyGeneSymbolQuery: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({
      unwrap: jest
        .fn()
        .mockResolvedValue({ E10: "TCGA", E40: "FAT3", E60: "FAT4" }),
    }),
  ]),
  useCoreSelector: jest.fn(),
  selectAllSets: jest.fn().mockReturnValue({ genes: { 123: "my gene set" } }),
}));

describe("queryExpressionHooks - formatValue", () => {
  it("handles display of unnamed sets", async () => {
    const { result } = renderHook(async () => {
      const formatValue = queryExpressionHooks.useFormatValue();
      return formatValue("set_id:ABC", "genes.gene_id");
    });

    waitFor(() => expect(result.current).toEqual("2 input genes"));
  });

  it("handles display of sets", () => {
    const { result } = renderHook(async () => {
      const formatValue = queryExpressionHooks.useFormatValue();
      const result = await formatValue("set_id:123", "genes.gene_id");
      return result;
    });
    waitFor(() => expect(result.current).toEqual("my gene set"));
  });

  it("displays gene", () => {
    const { result } = renderHook(async () => {
      const formatValue = queryExpressionHooks.useFormatValue();
      const result = await formatValue("E60", "genes.gene_id");
      return result;
    });
    waitFor(() => expect(result.current).toEqual("FAT4"));
  });
});
