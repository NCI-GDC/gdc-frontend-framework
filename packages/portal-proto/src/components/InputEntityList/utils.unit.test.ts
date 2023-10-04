import { getMatchedIdentifiers } from "./utils";

describe("getMatchedIdentifiers", () => {
  it("match deeply nested items", () => {
    const data = [
      {
        case_id: "3a3fc890-1985-4353-861b-dc3abfb364b1",
        samples: [
          {
            sample_id: "68819a2d-5f7f-4fda-b15a-27a0b22cf17b",
            submitter_id: "TCGA-06-5416-01A",
            portions: [
              {
                portion_id: "f0acac67-8f4f-4f06-83b0-a0f64f3e8f94",
                analytes: [
                  {
                    analyte_id: "179cd58b-255c-4107-b7db-7c2b98f77d01",
                    aliquots: [
                      {
                        aliquot_id: "0cf65810-5e7c-41df-90ea-bc371a4f19f0",
                        submitter_id: "TCGA-06-5416-01A-01D-1486-08",
                      },
                      {
                        aliquot_id: "41943bc4-697f-41d7-8da0-0904b36306da",
                        submitter_id: "TCGA-06-5416-01A-01D-1480-02",
                      },
                    ],
                    submitter_id: "TCGA-06-5416-01A-01D",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const mappedToFields = ["case_id"];
    const submittedIdentifierFields = [
      "samples.submitter_id",
      "samples.portions.analytes.aliquots.submitter_id",
    ];
    const tokens = [
      "TCGA-06-5416-01A",
      "TCGA-06-5416-01A-01D-1480-02",
      "NOT-A-MATCH",
    ];
    const outputField = "case_id";

    expect(
      getMatchedIdentifiers(
        data,
        mappedToFields,
        submittedIdentifierFields,
        outputField,
        tokens,
      ),
    ).toEqual([
      {
        mappedTo: [
          { field: "case_id", value: "3a3fc890-1985-4353-861b-dc3abfb364b1" },
        ],
        submittedIdentifiers: [
          { field: "samples.submitter_id", value: "TCGA-06-5416-01A" },
          {
            field: "samples.portions.analytes.aliquots.submitter_id",
            value: "TCGA-06-5416-01A-01D-1480-02",
          },
        ],
        output: [
          { field: "case_id", value: "3a3fc890-1985-4353-861b-dc3abfb364b1" },
        ],
      },
    ]);
  });

  it("discard results with no matches", () => {
    const data = [
      {
        symbol: "NBR1",
        gene_id: "ENSG00000188554",
      },
      {
        symbol: "MUC16",
        gene_id: "ENSG00000181143",
      },
    ];

    const mappedToFields = ["symbol"];
    const submittedIdentifierFields = ["gene_id"];
    const tokens = ["ENSG00000181143"];
    const outputField = "gene_id";

    expect(
      getMatchedIdentifiers(
        data,
        mappedToFields,
        submittedIdentifierFields,
        outputField,
        tokens,
      ),
    ).toEqual([
      {
        mappedTo: [{ field: "symbol", value: "MUC16" }],
        submittedIdentifiers: [{ field: "gene_id", value: "ENSG00000181143" }],
        output: [{ field: "gene_id", value: "ENSG00000181143" }],
      },
    ]);
  });

  it("match when result is in an array", () => {
    const data = [
      {
        id: "ENSG00000181143",
        symbol: "MUC16",
        external_db_ids: {
          hgnc: ["HGNC:15582"],
          uniprotkb_swissprot: [],
        },
        gene_id: "ENSG00000181143",
      },
      {
        id: "ENSG00000141510",
        symbol: "TP53",
        external_db_ids: {
          hgnc: ["HGNC:11998"],
          uniprotkb_swissprot: ["P04637"],
        },
        gene_id: "ENSG00000141510",
      },
    ];

    const mappedToFields = ["gene_id", "symbol"];
    const matchAgainstIdentifiers = [
      "external_db_ids.hgnc",
      "external_db_ids.uniprotkb_swissprot",
    ];

    const tokens = ["HGNC:15582", "P04637"];
    const outputField = "id";

    expect(
      getMatchedIdentifiers(
        data,
        mappedToFields,
        matchAgainstIdentifiers,
        outputField,
        tokens,
      ),
    ).toEqual([
      {
        mappedTo: [
          { field: "symbol", value: "MUC16" },
          { field: "gene_id", value: "ENSG00000181143" },
        ],
        submittedIdentifiers: [
          { field: "external_db_ids.hgnc", value: "HGNC:15582" },
        ],
        output: [{ field: "id", value: "ENSG00000181143" }],
      },
      {
        mappedTo: [
          { field: "symbol", value: "TP53" },
          { field: "gene_id", value: "ENSG00000141510" },
        ],
        submittedIdentifiers: [
          { field: "external_db_ids.uniprotkb_swissprot", value: "P04637" },
        ],
        output: [{ field: "id", value: "ENSG00000141510" }],
      },
    ]);
  });

  it("match ignores case", () => {
    const data = [
      {
        symbol: "MUC16",
        gene_id: "ENSG00000181143",
      },
      {
        symbol: "TP53",
        gene_id: "ENSG00000141510",
      },
    ];

    const mappedToFields = ["gene_id"];
    const matchAgainstIdentifiers = ["symbol"];

    const tokens = ["muc16"];
    const outputField = "symbol";

    expect(
      getMatchedIdentifiers(
        data,
        mappedToFields,
        matchAgainstIdentifiers,
        outputField,
        tokens,
      ),
    ).toEqual([
      {
        mappedTo: [{ field: "gene_id", value: "ENSG00000181143" }],
        submittedIdentifiers: [{ field: "symbol", value: "MUC16" }],
        output: [{ field: "symbol", value: "MUC16" }],
      },
    ]);
  });
});
