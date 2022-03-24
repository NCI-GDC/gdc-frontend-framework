import { GdcFile } from "@gff/core";
import { render, getByTestId } from "@testing-library/react";
import ImageViewer from "../ImageViewer";

describe("<ImageViewer /> component", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ test: 100 }),
    }),
  ) as jest.Mock;

  it.skip("component should be defined", () => {
    const component = render(<ImageViewer imageId="testImageId" file={{} as GdcFile}/>);
    expect(component).toBeDefined();
  });
});
