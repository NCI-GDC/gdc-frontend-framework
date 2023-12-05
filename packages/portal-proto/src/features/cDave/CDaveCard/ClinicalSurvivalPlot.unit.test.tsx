import { render } from "test-utils";
import * as router from "next/router";
import * as core from "@gff/core";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";

const mockSurvivalImplementation = () =>
  ({
    data: {
      overallStats: {
        pValue: 0,
      },
      survivalData: {},
    },
    isLoading: false,
    isError: false,
  } as any);

describe("ClinicalSurvivalPlot", () => {
  beforeEach(() => {
    jest.spyOn(router, "useRouter").mockImplementation(
      () =>
        ({
          pathname: "",
          query: {},
        } as any),
    );
  });

  it("creates filters for categorical data", () => {
    const survivalQuerySpy = jest
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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
    jest
      .spyOn(core, "selectCurrentCohortFilters")
      .mockImplementationOnce(() => ({
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
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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

    const survivalQuerySpy = jest
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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
    const survivalQuerySpy = jest
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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
    const survivalQuerySpy = jest
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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
    const survivalQuerySpy = jest
      .spyOn(core, "useGetSurvivalPlotQuery")
      .mockImplementation(mockSurvivalImplementation);

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
