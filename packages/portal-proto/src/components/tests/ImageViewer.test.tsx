import { GdcFile } from "@gff/core";
import { render, getByTestId } from "@testing-library/react";
import ImageViewer from "../ImageViewer";

describe("<ImageViewer /> component", () => {

  it.skip("component should be defined", () => {
    const component = render(<ImageViewer imageId="testImageId" file={{} as GdcFile}/>);
    expect(component).toBeDefined();
  });
});
