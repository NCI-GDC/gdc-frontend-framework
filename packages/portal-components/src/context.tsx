import React from "react";
import { createContext } from "react";
import { MantineThemeOverride } from "@mantine/core";
import { ImageComponentType, LinkComponentType } from "./types";

interface AppContextType {
  readonly appName?: string;
  readonly path?: string;
  readonly theme?: MantineThemeOverride;
  readonly Image: ImageComponentType;
  readonly Link: LinkComponentType;
}

export const AppContext = createContext<AppContextType>({
  appName: undefined,
  path: undefined,
  theme: undefined,
  // eslint-disable-next-line
  Image: (props) => <img {...props} />,
  // eslint-disable-next-line
  Link: (props) => <a {...props} />,
});
