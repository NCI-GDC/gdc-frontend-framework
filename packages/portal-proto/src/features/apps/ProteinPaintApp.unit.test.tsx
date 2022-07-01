import "whatwg-fetch";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("renders a search input", async () => {
  act(() => {
    render(<ProteinPaintWrapper track="lolliplot" />, container);
  });
  await sleep(1500);
  const input = container.querySelector("input");
  console.log(30, typeof input);
  expect(input instanceof HTMLElement).toBe(true);
  // !!! jsdom breaks with getBBox() as used in proteinpaint, cannot render tracks to test !!!
  /*if (input) {
    input.value = 'MYC'
    input.dispatchEvent(new KeyboardEvent('keyup', {code: 'C'}))
    await sleep(1000)
    input.dispatchEvent(new KeyboardEvent('keyup', {code: 'Enter'}))
    await sleep(2900)
    expect(container.querySelectorAll('.sja_aa_discg').length).toBeGreaterThan(10);
  }*/
});
