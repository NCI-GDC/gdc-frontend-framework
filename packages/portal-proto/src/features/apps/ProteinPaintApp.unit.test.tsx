import "whatwg-fetch";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";
import { runproteinpaint } from "@stjude/proteinpaint-client";

let filter;

jest.mock("@gff/core", () => ({
  useCoreSelector: jest.fn().mockReturnValue({}),
  selectCurrentCohortFilterSet: jest.fn().mockReturnValue({}),
  buildCohortGqlOperator: jest.fn(() => filter),
}));

test("renders a search input", async () => {
  filter = {};

  const { queryByPlaceholderText, unmount, rerender } = render(
    <ProteinPaintWrapper track="lolliplot" />,
  );
  await waitFor(
    () => expect(queryByPlaceholderText("Gene")).toBeInTheDocument(),
    { timeout: 2000 },
  );
  const input = queryByPlaceholderText("Gene") as HTMLInputElement;
  expect(input instanceof HTMLElement).toBe(true);
  /* 
    Inital render testing only, the embedded tool behavior 
    is tested within the proteinpaint-client package/module.

    Also, jsdom breaks on svg element.style.baseval rendering 
    which is done within runproteinpaint.
  */
  unmount();
});

/* !!! 
  Not sure how to test the argument that gets passed to runproteinpaint().
  If buildCohortgqlOperator is mocked, then testing the returned argument
  depends on the substituted function, so it'll be a useless test.
  !!!
*/
/*test("constructs the correct runproteinpaint() argument", async () => {

});
*/
