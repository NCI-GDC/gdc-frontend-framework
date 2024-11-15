import { MantineThemeOverride } from "@mantine/core";
import React from "react";
import { createContext } from "react";
import { ImageComponentType, LinkComponentType } from "./types";

interface AppContextType {
  readonly path?: string;
  readonly theme?: MantineThemeOverride;
  readonly ImageComponent: ImageComponentType;
  readonly Link: LinkComponentType;
}

export const AppContext = createContext<AppContextType>({
  path: undefined,
  theme: undefined,
  ImageComponent: (props) => <img {...props} />,
  Link: (props) => <a {...props} />,
});
