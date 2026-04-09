declare module "*.svg" {
  import { FC, SVGProps } from "react";
  import { ImageProps } from "next/image";
  const content: FC<SVGProps<SVGElement> & Pick<ImageProps, "layout">>;
  export default content;
}
