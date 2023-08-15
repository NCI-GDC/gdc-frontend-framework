import { render } from "test-utils";
import ConsequenceTable, { ConsequenceTableProps } from "../ConsequenceTable";
import { sortByNestedFieldWithPriority } from "../utils";

const mockData: ConsequenceTableProps = {
  status: "fulfilled",
  tableData: [
    {
      gene: "BRAF",
      gene_id: "ENSG00000157764",
      aa_change: "V640E",
      DNAChange: "c.1919T>A",
      consequences: "missense_variant",
      transcript_id: "ENST00000644969",
      is_canonical: true,
      gene_strand: -1,
      impact: {
        polyphenImpact: "probably_damaging",
        polyphenScore: 0.955,
        siftImpact: "deleterious",
        siftScore: 0,
        vepImpact: "MODERATE",
      },
      subRows: " ",
    },
    {
      gene: "BRAF",
      gene_id: "ENSG00000157764",
      aa_change: "V157E",
      DNAChange: "c.470T>A",
      consequences: "missense_variant",
      transcript_id: "ENST00000479537",
      is_canonical: false,
      gene_strand: -1,
      impact: {
        polyphenImpact: "probably_damaging",
        polyphenScore: 0.999,
        siftImpact: "deleterious",
        siftScore: 0,
        vepImpact: "MODERATE",
      },
      subRows: " ",
    },
    {
      gene: "BRAF",
      gene_id: "ENSG00000157764",
      aa_change: "V299E",
      DNAChange: "c.896T>A",
      consequences: "missense_variant",
      transcript_id: "ENST00000644650",
      is_canonical: false,
      gene_strand: -1,
      impact: {
        polyphenImpact: "probably_damaging",
        polyphenScore: 0.924,
        siftImpact: "deleterious",
        siftScore: 0,
        vepImpact: "MODERATE",
      },
      subRows: " ",
    },
  ],
  columnListOrder: [
    {
      id: "gene",
      columnName: "Gene",
      visible: true,
    },
    {
      id: "aa_change",
      columnName: "AA Change",
      visible: true,
    },
    {
      id: "consequences",
      columnName: "Consequences",
      visible: true,
    },
    {
      id: "DNAChange",
      columnName: "Coding DNA Change",
      visible: true,
    },
    {
      id: "impact",
      columnName: "Impact",
      visible: true,
    },
    {
      id: "gene_strand",
      columnName: "Gene Strand",
      visible: true,
    },
    {
      id: "transcript_id",
      columnName: "Transcript",
      visible: true,
    },
  ],
  visibleColumns: [
    {
      id: "gene",
      columnName: "Gene",
      visible: true,
    },
    {
      id: "aa_change",
      columnName: "AA Change",
      visible: true,
    },
    {
      id: "consequences",
      columnName: "Consequences",
      visible: true,
    },
    {
      id: "DNAChange",
      columnName: "Coding DNA Change",
      visible: true,
    },
    {
      id: "impact",
      columnName: "Impact",
      visible: true,
    },
    {
      id: "gene_strand",
      columnName: "Gene Strand",
      visible: true,
    },
    {
      id: "transcript_id",
      columnName: "Transcript",
      visible: true,
    },
  ],
};

describe("<ConsequenceTable />", () => {
  it("Coding DNA Change should not be link and clickable", () => {
    const { getByText } = render(<ConsequenceTable {...mockData} />);

    expect(getByText("c.1919T>A")).toBeInTheDocument();
    expect(getByText("c.1919T>A")).not.toHaveAttribute("href");
    expect(getByText("c.1919T>A")).not.toHaveAttribute("onClick");
  });
});

describe("sortByNestedFieldWithPriority", () => {
  it("should objects where `nestField.boolean` is true", () => {
    const a = { nestField: { boolean: true } };
    const b = { nestField: { boolean: false } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBe(-1);
  });

  it("should deprioritize objects where `nestField.boolean` is false", () => {
    const a = { nestField: { boolean: false } };
    const b = { nestField: { boolean: true } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBe(1);
  });

  it("should prioritize objects with null `nestField.string` over non-null", () => {
    const a = { nestField: { boolean: true, string: null } };
    const b = { nestField: { boolean: true, string: "someValue" } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBe(1);
  });

  it("should prioritize non-null `nestField.string` over null", () => {
    const a = { nestField: { boolean: true, string: "someValue" } };
    const b = { nestField: { boolean: true, string: null } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBe(-1);
  });

  it("should sort objects by `nestField.string` in ascending order", () => {
    const a = { nestField: { boolean: true, string: "abc" } };
    const b = { nestField: { boolean: true, string: "def" } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBeLessThan(0);
  });

  it("should handle case-insensitive sorting of `nestField.string`", () => {
    const a = { nestField: { boolean: true, string: "AbC" } };
    const b = { nestField: { boolean: true, string: "aBc" } };
    const result = sortByNestedFieldWithPriority(
      a,
      b,
      "nestField",
      "boolean",
      "string",
    );
    expect(result).toBe(0);
  });
});
