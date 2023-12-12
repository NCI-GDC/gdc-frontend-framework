/**
 * A registry for the GDC Apps.
 *
 * These references to React components cannot live in the redux store
 * because they are complex objects. This registry is a workaround.
 */
export const REGISTRY: Record<string, () => React.JSX.Element> = {};

export const registerGdcApp = (
  id: string,
  gdcApp: () => React.JSX.Element,
): void => {
  REGISTRY[id] = gdcApp;
};

export const lookupGdcApp = (id: string): (() => React.JSX.Element) => {
  return REGISTRY[id];
};
