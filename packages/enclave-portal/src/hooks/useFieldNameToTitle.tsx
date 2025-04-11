export const useFieldNameToTitle = () => (field: string) =>
  field
    .split(".")
    .slice(-1)
    .map((s) => s.split("_"))
    .flat()
    .map((s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : ""))
    .join(" ");
