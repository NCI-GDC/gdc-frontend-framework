import "whatwg-fetch";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";

test("renders a search input", async () => {
  const { queryByPlaceholderText, unmount } = render(
    <ProteinPaintWrapper track="lolliplot" />,
  );
  await waitFor(
    () => expect(queryByPlaceholderText("Gene")).toBeInTheDocument(),
    { timeout: 2000 },
  );
  const input = queryByPlaceholderText("Gene");
  expect(input instanceof HTMLElement).toBe(true);
  /*
    inital render testing only, the embedded tool behavior
    is tested within the proteinpaint-client package/module

    TODO: may perform more tests here if the GDC portal
    updates an active Proteinpaint view
  */
  unmount();
});
