import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, NextRouter } from "next/router";
import SearchInput from "./SearchInput";

jest.mock("@/features/cohortBuilder/dictionary", () => ({
  useFacetSearch: jest.fn().mockReturnValue({
    search: jest.fn().mockImplementation((s) =>
      s === "bioooooo"
        ? []
        : [
            {
              name: "BioThing",
              description: "blah blah",
              enum: ["biobio", "not anything"],
              terms: ["bio"],
              category: "General",
              categoryKey: "general",
              id: "1",
            },
            {
              name: "Biopsy",
              description: "",
              enum: [],
              terms: ["bio"],
              category: "Very General",
              categoryKey: "very-general",
              id: "2",
            },
          ],
    ),
  }),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("<SearchInput />", () => {
  it("display no results", async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchInput />);
    await userEvent.type(getByPlaceholderText("Search"), "bioooooo");
    expect(getByTestId("cohort-builder-search-no-results").textContent).toEqual(
      "No results for bioooooo",
    );
  });

  it("displays results", async () => {
    const { getByPlaceholderText, getByRole } = render(<SearchInput />);
    await userEvent.type(getByPlaceholderText("Search"), "bio");
    expect(
      getByRole("button", { name: "BioThing Category: General" }),
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Biopsy Category: Very General" }),
    ).toBeInTheDocument();
  });

  it("filters by category", async () => {
    const { getByPlaceholderText, queryByRole, getAllByText } = render(
      <SearchInput />,
    );
    await userEvent.type(getByPlaceholderText("Search"), "bio");
    await userEvent.click(getAllByText("Very General")[0]);
    expect(
      queryByRole("button", { name: "BioThing Category: General" }),
    ).not.toBeInTheDocument();
    expect(
      queryByRole("button", { name: "Biopsy Category: Very General" }),
    ).toBeInTheDocument();
  });

  it("hides tooltip if no relevant info", async () => {
    const { getByPlaceholderText, queryByRole, getByText, getByTestId } =
      render(<SearchInput />);
    await userEvent.type(getByPlaceholderText("Search"), "bio");

    await userEvent.hover(
      queryByRole("button", { name: "BioThing Category: General" }),
    );
    expect(queryByRole("tooltip")).toBeInTheDocument();
    expect(getByText("blah blah")).toBeInTheDocument();
    expect(
      getByTestId("cohort-builder-search-matching-values").textContent,
    ).toEqual("Values Matched: biobio");
    await userEvent.unhover(
      queryByRole("button", { name: "BioThing Category: General" }),
    );

    await userEvent.hover(
      queryByRole("button", { name: "Biopsy Category: Very General" }),
    );
    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("click navigates to tab", async () => {
    const routerSpy = jest.fn();
    (useRouter as jest.Mock<NextRouter>).mockReturnValue({
      push: routerSpy,
    } as any);

    const { getByPlaceholderText, getByRole } = render(<SearchInput />);
    await userEvent.type(getByPlaceholderText("Search"), "bio");
    await userEvent.click(
      getByRole("button", { name: "Biopsy Category: Very General" }),
    );

    expect(routerSpy).toBeCalledWith({
      query: { tab: "very-general" },
      hash: "2",
    });
  });

  it("clears out search", async () => {
    const { getByPlaceholderText, queryByRole, getByTestId } = render(
      <SearchInput />,
    );
    await userEvent.type(getByPlaceholderText("Search"), "bio");
    await userEvent.click(getByTestId("search-input-clear-search"));
    expect(
      queryByRole("button", { name: "BioThing Category: General" }),
    ).not.toBeInTheDocument();
  });
});
