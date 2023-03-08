import { render } from "@testing-library/react";
import { ArraySeparatedSpan } from "../ArraySeparatedSpan";

describe("<ArraySeparatedSpan />", () => {
  it("there should not be a comma after a last element of the array", () => {
    const mockArray = ["apple", "cat", "ball", "elephant", "dog"];
    const { getAllByTestId } = render(<ArraySeparatedSpan data={mockArray} />);
    const itemSpans = getAllByTestId("item-span");
    //first element
    expect(itemSpans[0].innerHTML).toEqual("apple, ");
    //last element
    expect(itemSpans[mockArray.length - 1].innerHTML).toEqual("elephant");
  });
});
