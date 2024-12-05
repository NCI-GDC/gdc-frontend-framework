import { render } from "test-utils";
import * as router from "next/router";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import { selectCurrentCohortFilters, useGetSurvivalPlotQuery } from "@gff/core";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useGetSurvivalPlotQuery: jest.fn(),
  selectCurrentCohortFilters: jest.fn(),
  useCartSummaryQuery: jest.fn(),
  useFetchUserDetailsQuery: jest.fn(),
  useGetFilesQuery: jest.fn(),
}));

const mockSurvivalValue = {
  data: {
    overallStats: {
      pValue: 0,
    },
    survivalData: {},
  },
  isLoading: false,
  isError: false,
} as any;
let survivalQuerySpy;

describe("ClinicalSurvivalPlot", () => {
  beforeEach(() => {
    jest.spyOn(router, "useRouter").mockImplementation(
      () =>
        ({
          pathname: "",
          query: {},
        } as any),
    );
    survivalQuerySpy = jest
      .mocked(useGetSurvivalPlotQuery)
      .mockReturnValue(mockSurvivalValue);
  });

  it("creates filters for categorical data", () => {
    render(
      <ClinicalSurvivalPlot
        field={"demographic.gender"}
        continuous={false}
        customBinnedData={null}
        selectedSurvivalPlots={["male", "female"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "male",
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "female",
              },
            },
          ],
        },
      ],
    });
  });

  it("adds cohort filters", () => {
    jest.mocked(selectCurrentCohortFilters).mockImplementationOnce(() => ({
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: ["FM-AD"],
        },
      },
    }));

    const survivalQuerySpy = jest
      .mocked(useGetSurvivalPlotQuery)
      .mockReturnValue(mockSurvivalValue);

    render(
      <ClinicalSurvivalPlot
        field={"demographic.gender"}
        continuous={false}
        customBinnedData={null}
        selectedSurvivalPlots={["male", "female"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: "and",
              content: [
                {
                  op: "in",
                  content: {
                    value: ["FM-AD"],
                    field: "cases.project.project_id",
                  },
                },
              ],
            },
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "male",
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: "and",
              content: [
                {
                  op: "in",
                  content: {
                    value: ["FM-AD"],
                    field: "cases.project.project_id",
                  },
                },
              ],
            },
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "female",
              },
            },
          ],
        },
      ],
    });
  });

  it("adds demo filters", () => {
    jest.spyOn(router, "useRouter").mockImplementation(
      () =>
        ({
          pathname: "",
          query: { demoMode: "true" },
        } as any),
    );

    render(
      <ClinicalSurvivalPlot
        field={"demographic.gender"}
        continuous={false}
        customBinnedData={null}
        selectedSurvivalPlots={["male", "female"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: "and",
              content: [
                {
                  op: "in",
                  content: {
                    value: ["TCGA-LGG"],
                    field: "cases.project.project_id",
                  },
                },
              ],
            },
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "male",
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: "and",
              content: [
                {
                  op: "in",
                  content: {
                    value: ["TCGA-LGG"],
                    field: "cases.project.project_id",
                  },
                },
              ],
            },
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "female",
              },
            },
          ],
        },
      ],
    });
  });

  it("creates filters for custom binned data", () => {
    render(
      <ClinicalSurvivalPlot
        field={"demographic.gender"}
        continuous={false}
        customBinnedData={{ bucket1: { male: 20, female: 80 }, missing: 100 }}
        selectedSurvivalPlots={["bucket1", "missing"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: ["male", "female"],
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: "=",
              content: {
                field: "demographic.gender",
                value: "missing",
              },
            },
          ],
        },
      ],
    });
  });

  it("creates filters for named from to", () => {
    render(
      <ClinicalSurvivalPlot
        field={"demographic.days_to_death"}
        continuous
        customBinnedData={[
          { name: "bin a", from: 0, to: 10 },
          { name: "bin b", from: 10, to: 20 },
          { name: "bin c", from: 20, to: 30 },
        ]}
        selectedSurvivalPlots={["bin a", "bin c"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: ">=",
              content: {
                field: "demographic.days_to_death",
                value: [0],
              },
            },
            {
              op: "<",
              content: {
                field: "demographic.days_to_death",
                value: [10],
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: ">=",
              content: {
                field: "demographic.days_to_death",
                value: [20],
              },
            },
            {
              op: "<",
              content: {
                field: "demographic.days_to_death",
                value: [30],
              },
            },
          ],
        },
      ],
    });
  });

  it("parses selected negative values", () => {
    render(
      <ClinicalSurvivalPlot
        field={"demographic.days_to_death"}
        continuous
        customBinnedData={null}
        selectedSurvivalPlots={["-10.0-10.0", "10.0-20.0"]}
      />,
    );

    expect(survivalQuerySpy).toBeCalledWith({
      filters: [
        {
          op: "and",
          content: [
            {
              op: ">=",
              content: {
                field: "demographic.days_to_death",
                value: ["-10.0"],
              },
            },
            {
              op: "<",
              content: {
                field: "demographic.days_to_death",
                value: ["10.0"],
              },
            },
          ],
        },
        {
          op: "and",
          content: [
            {
              op: ">=",
              content: {
                field: "demographic.days_to_death",
                value: ["10.0"],
              },
            },
            {
              op: "<",
              content: {
                field: "demographic.days_to_death",
                value: ["20.0"],
              },
            },
          ],
        },
      ],
    });
  });
});
