import { MantineThemeOverride } from "@mantine/core";
import React from "react";
import { createContext } from "react";
import { ImageComponentType, LinkComponentType } from "./types";

interface AppContextType {
  readonly path?: string;
  readonly theme?: MantineThemeOverride;
  readonly ImageComponent: ImageComponentType;
  readonly LinkComponent: LinkComponentType;
}

export const AppContext = createContext<AppContextType>({
  path: undefined,
  theme: undefined,
  // eslint-disable-next-line
  ImageComponent: (props) => <img {...props} />,
  // eslint-disable-next-line
  LinkComponent: (props) => <a {...props} />,
});
