import { render, getByTestId } from "@testing-library/react";
import ImageViewer from "../ImageViewer";

describe("<ImageViewer /> component", () => {

  it("component should be defined", () => {
    const component = render(<ImageViewer imageId="testImageId"/>);
    expect(component).toBeDefined();
  });
});
