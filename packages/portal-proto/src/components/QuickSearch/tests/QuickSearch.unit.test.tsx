import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as router from "next/router";
import * as core from "@gff/core";
import { QuickSearch } from "../QuickSearch";

jest.spyOn(router, "useRouter").mockImplementation(
  () =>
    ({
      pathname: "",
      query: {},
    } as any),
);

describe("<QuickSearch />", () => {
  test("displays results", async () => {
    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: {
        searchList: [
          { id: btoa("Gene:111"), symbol: "TH" },
          { id: btoa("Project:222"), name: "Thymoma" },
        ],
        query: "th",
      },
    } as any);
    jest
      .spyOn(core, "useGetHistoryQuery")
      .mockReturnValue({ data: undefined } as any);

    const { getAllByTestId, getByLabelText } = render(<QuickSearch />);
    userEvent.click(getByLabelText("Quick Search Input"));
    userEvent.type(getByLabelText("Quick Search Input"), "th");

    await waitFor(
      () =>
        expect(getAllByTestId("text-search-result").length).toBeGreaterThan(0),
      { timeout: 3000 },
    );
    const results = getAllByTestId("text-search-result");
    expect(results[0].textContent).toEqual("THTH");
    expect(results[1].textContent).toEqual("222Thymoma");
  });

  test("displays superseded file", async () => {
    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: {
        searchList: [],
        query: "111-222",
      },
    } as any);
    jest.spyOn(core, "useGetHistoryQuery").mockReturnValue({
      data: [
        {
          uuid: "444-555",
          file_change: "released",
        },
        { uuid: "111-222", file_change: "superseded" },
      ],
    } as any);

    const { getAllByTestId, getByLabelText } = render(<QuickSearch />);
    userEvent.click(getByLabelText("Quick Search Input"));
    userEvent.type(getByLabelText("Quick Search Input"), "111-222");

    await waitFor(
      () =>
        expect(getAllByTestId("text-search-result").length).toBeGreaterThan(0),
      { timeout: 3000 },
    );
    const results = getAllByTestId("text-search-result");
    expect(results[0].textContent).toEqual(
      "444-555File 111-222 has been updated",
    );
  });
});
