export const isNotDefined = (x: unknown): x is undefined => {
  return x === undefined || x === null || x === void 0;
};

export const isObject = (x: unknown): x is Record<string, unknown> => {
  return typeof x === "object";
};
