export const isNotDefined = (x: unknown): x is undefined => {
  return x === undefined || x === null || x === void 0;
};

export const isObject = (x: unknown): x is Record<string, unknown> => {
  return typeof x === "object";
};

export const isArray = (x: unknown): x is ReadonlyArray<unknown> => {
  return Array.isArray(x);
};

export const isString = (x: unknown): x is string => {
  return typeof x === "string";
};
