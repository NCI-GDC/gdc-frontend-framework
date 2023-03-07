import rtlPlugin from "stylis-plugin-rtl";
import { createEmotionCache, EmotionCache } from "@mantine/core";

const createCache = (): EmotionCache => {
  // Insert mantine styles after global styles
  const insertionPoint =
    typeof document !== "undefined"
      ? document.querySelectorAll<HTMLElement>(
          'style[data-emotion="css-global"]',
        )?.[-1]
      : undefined;

  return createEmotionCache({
    key: "mantine-rtl",
    insertionPoint,
    stylisPlugins: [rtlPlugin],
  });
};

export const rtlCache = createCache();
