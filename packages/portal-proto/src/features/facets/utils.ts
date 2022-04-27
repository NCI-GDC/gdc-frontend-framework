const capitalize = (s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "");

export const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};
