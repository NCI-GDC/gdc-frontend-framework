import { generateImageSource } from "@/components/Image";

describe("Image", () => {
  describe("generateImageSource", () => {
    describe("when basePath exists", () => {
      test("should return new source", () => {
        const src = "/original";
        const basePath = "/prefix";
        const imageSource = generateImageSource(src, basePath);
        expect(imageSource).toBe("/prefix/original");
      });

      test("should return same source when it is a url", () => {
        const src = "https://example.com/image.png";
        const basePath = "/prefix";
        const imageSource = generateImageSource(src, basePath);
        expect(imageSource).toBe(src);
      });
    });

    describe("when basePath does not exist", () => {
      test("should return source", () => {
        const src = "/original";
        const imageSource = generateImageSource(src, undefined);
        expect(imageSource).toBe("/original");
      });
    });
  });
});
