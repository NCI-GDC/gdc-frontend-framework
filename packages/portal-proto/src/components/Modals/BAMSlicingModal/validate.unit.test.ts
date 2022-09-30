import { validateBamInput } from "./validate";

describe("validateBamInput", () => {
  const expectedEmptyErrorMessage =
    "You have not entered any coordinates. Please try again.";

  const expectedInvalidErrorMessage =
    "You have entered invalid coordinates. Please try again.";

  it("should error out in empty value", () => {
    const error = validateBamInput("");
    expect(error).toBe(expectedEmptyErrorMessage);
  });

  it("should error out if user enters more than two starting and ending numbers", () => {
    const error = validateBamInput("chr1\t1\t2\t3\nchr2\nchr3:1");
    expect(error).toBe(expectedInvalidErrorMessage);
  });

  it("should not error out for valid user input", () => {
    const error = validateBamInput("chr1\t1\t2\nchr2\nchr3:1");
    expect(error).toBe(null);
  });

  it("should not error out for invalid user input starting number greater than ending number", () => {
    const error = validateBamInput("chr1\t2\t1\nchr2\nchr3:1");
    expect(error).toBe(expectedInvalidErrorMessage);
  });

  it("should not error out for invalid user input invalid characters", () => {
    const error = validateBamInput("chr1\t2/////\t1\nchr2\nchr3:1");
    expect(error).toBe(expectedInvalidErrorMessage);
  });
});
