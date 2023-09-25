import * as core from "@gff/core";
import * as facetHooks from "../../facets/hooks";
import * as router from "next/router";
import { render } from "test-utils";
import CDaveCard from "./CDaveCard";

jest.spyOn(router, "useRouter").mockImplementation(
  () =>
    ({
      pathname: "",
      query: {},
    } as any),
);

describe("CDaveCard", () => {
  it("enum result with data", () => {
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValue({ field: "demographic.gender", type: "keyword" });

    const data = {
      buckets: [
        { doc_count: 1000, key: "male" },
        { doc_count: 500, key: "female" },
      ],
    };

    const { getByRole } = render(
      <CDaveCard
        data={data}
        field={"demographic.gender"}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(
      getByRole("row", { name: "Select male 1,000 (66.67%)" }),
    ).toBeInTheDocument();
  });

  it("enum result with only missing values", () => {
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValue({ field: "demographic.gender", type: "keyword" });

    const data = {
      buckets: [{ doc_count: 1000, key: "_missing" }],
    };

    const { getByText } = render(
      <CDaveCard
        data={data}
        field={"demographic.gender"}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(getByText("No data for this property")).toBeInTheDocument();
  });

  it("enum results with a missing value", () => {
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValue({ field: "demographic.gender", type: "keyword" });

    const data = {
      buckets: [
        { doc_count: 1000, key: "_missing" },
        { doc_count: 500, key: "female" },
      ],
    };

    const { getByRole } = render(
      <CDaveCard
        data={data}
        field={"demographic.gender"}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(
      getByRole("row", { name: "Select missing 1,000 (66.67%)" }),
    ).toBeInTheDocument();
  });

  it("categorical results sorted by count", () => {
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValue({ field: "demographic.gender", type: "keyword" });

    const data = {
      buckets: [
        { doc_count: 500, key: "female" },
        { doc_count: 1000, key: "_missing" },
      ],
    };

    const { getAllByRole } = render(
      <CDaveCard
        data={data}
        field={"demographic.gender"}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(getAllByRole("row")[1]).toHaveTextContent("missing");
    expect(getAllByRole("row")[2]).toHaveTextContent("female");
  });

  it("continuous result with data", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      field: "diagnosis.days_to_treatment_start",
      type: "long",
    });
    jest.spyOn(facetHooks, "useRangeFacet").mockReturnValue({
      data: { "7201.0-12255.8": 10, "12255.8-17310.6": 90 },
      isFetching: false,
      isSuccess: true,
    } as any);
    jest.spyOn(core, "useGetContinuousDataStatsQuery").mockReturnValue({
      isFetching: false,
      isSuccess: true,
    } as any);

    const { getByRole } = render(
      <CDaveCard
        data={{ stats: { count: 100 } } as any}
        field={"diagnosis.days_to_treatment_start"}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(
      getByRole("row", { name: "Select 7201 to <12255.8 10 (10.00%)" }),
    ).toBeInTheDocument();
    expect(
      getByRole("row", { name: "Select 12255.8 to <17310.6 90 (90.00%)" }),
    ).toBeInTheDocument();
  });

  it("continuous result with negative bucket", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      field: "diagnosis.days_to_treatment_start",
      type: "long",
    });
    jest.spyOn(facetHooks, "useRangeFacet").mockReturnValue({
      data: { "-28.0-166.8000001": 38 },
      isFetching: false,
      isSuccess: true,
    } as any);
    jest.spyOn(core, "useGetContinuousDataStatsQuery").mockReturnValue({
      isFetching: false,
      isSuccess: true,
    } as any);

    const { getByRole } = render(
      <CDaveCard
        data={{ stats: { count: 38 } } as any}
        field="diagnosis.days_to_treatment_start"
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(getByRole("cell", { name: "-28 to <166.8" })).toBeInTheDocument();
  });

  it("continuous result with no data", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      field: "diagnosis.days_to_treatment_start",
      type: "long",
    });
    jest
      .spyOn(facetHooks, "useRangeFacet")
      .mockReturnValue({ data: {}, isFetching: false } as any);

    const stats = {
      stats: {
        count: 0,
        min: null,
        max: null,
        avg: null,
        sum: null,
      },
    };

    const { getByText } = render(
      <CDaveCard
        data={stats}
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
        cohortFilters={undefined}
      />,
    );

    expect(getByText("No data for this property")).toBeInTheDocument();
  });
});
