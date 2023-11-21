import getConfig from "next/config";
import NextImage, { ImageProps } from "next/image";

/**
 * This is a wrapper around the next/image Image component. The only
 * difference is that this wrapper is aware of the basePath.  If the
 * basePath is set, then it prepends the basePath to the image source
 * path.
 */
export const Image = (props: ImageProps): JSX.Element => {
  const { src } = props;

  if (typeof src === "string") {
    const {
      publicRuntimeConfig: { basePath },
    } = getConfig();
    const newSrc = generateImageSource(src, basePath);

    return <NextImage {...{ ...props, src: newSrc }} />;
  }

  return <NextImage {...props} />;
};

export const generateImageSource = (src: string, basePath?: string): string => {
  if (basePath !== undefined && basePath !== null) {
    if (!src.startsWith("http")) {
      return `${basePath}${src}`;
    }
  }

  return src;
};
