const fieldNameOverrides: Record<string, string> = {
  "cases.project.program.name": "Program",
  "cases.project.project_id": "Project",
  "genes.gene_id": "Mutated Gene",
};

const COMMON_PREPOSITIONS = [
  "a",
  "an",
  "and",
  "at",
  "but",
  "by",
  "for",
  "in",
  "is",
  "nor",
  "of",
  "on",
  "or",
  "out",
  "so",
  "the",
  "to",
  "up",
  "yet",
];

export const capitalize = (original: string): string => {
  const customCapitalizations: Record<string, string> = {
    id: "ID",
    uuid: "UUID",
    dna: "DNA",
    dbsnp: "dbSNP",
    cosmic: "COSMIC",
    civic: "CIViC",
    dbgap: "dbGaP",
    ecog: "ECOG",
    bmi: "BMI",
    gdc: "GDC",
    cnv: "CNV",
    ssm: "SSM",
    aa: "AA",
  };

  return original
    .split(" ")
    .map(
      (word) =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
};

/**
 * Converts a GDC filter name to a title,
 * For example files.input.experimental_strategy will get converted to Experimental Strategy
 * if sections == 2 then the output would be Input Experimental Strategy
 * @param fieldName - input filter expected to be: string.firstpart_secondpart
 * @param sections - number of "sections" string.string.string to got back from the end of the field
 */

export const fieldNameToTitle = (fieldName: string, sections = 1): string => {
  if (fieldName in fieldNameOverrides) {
    return fieldNameOverrides[fieldName];
  }
  return fieldName
    .split(".")
    .slice(-sections)
    .map((s) => s.split("_"))
    .flat()
    .map((word) =>
      COMMON_PREPOSITIONS.includes(word) ? word : capitalize(word),
    )
    .join(" ");
};
