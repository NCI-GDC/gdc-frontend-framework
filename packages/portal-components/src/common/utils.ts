export const customCapitalize = (original: string): string => {
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
 *
 * @param param0
 * @returns
 */
export const humanify = (term: string): string => {
  const split = term.split(".");
  const humanified = split[split.length - 1]?.replace(/_/g, " ").trim();
  return customCapitalize(humanified);
};
