import { render } from "@testing-library/react";
import * as core from "@gff/core";
import * as facetHooks from "../facets/hooks";
import CDaveCard from "./CDaveCard";

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
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
      />,
    );

    expect(
      getByRole("row", { name: "male 1,000 (66.67%)" }),
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
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
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
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
      />,
    );

    expect(
      getByRole("row", { name: "missing 1,000 (66.67%)" }),
    ).toBeInTheDocument();
  });
  it("categorical results sorted by count", () => {});

  it("continuous result with data", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue({
      field: "diagnosis.days_to_treatment_start",
      type: "long",
    });
    jest.spyOn(facetHooks, "useRangeFacet").mockReturnValue({
      data: { "7201.0-12255.8": 10, "12255.8-17310.6": 90 },
      isFetching: false,
    } as any);

    const { getByRole } = render(
      <CDaveCard
        data={{ stats: { count: 100 } } as any}
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
      />,
    );

    expect(
      getByRole("row", { name: "7201 to <12255.8 10 (10.00%)" }),
    ).toBeInTheDocument();
    expect(
      getByRole("row", { name: "12255.8 to <17310.6 90 (90.00%)" }),
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
    } as any);

    const { getByRole } = render(
      <CDaveCard
        data={{ stats: { count: 38 } } as any}
        field={""}
        updateFields={jest.fn()}
        initialDashboardRender
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
      />,
    );

    expect(getByText("No data for this property")).toBeInTheDocument();
  });
});
