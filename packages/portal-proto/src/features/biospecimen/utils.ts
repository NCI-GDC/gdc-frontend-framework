import { formatDataForHorizontalTable } from "../files/utils";

interface IHumanifyParams {
  term: string;
  capitalize?: boolean;
  facetTerm?: boolean;
}

type THumanify = ({}: IHumanifyParams) => string;

export const capitalize = (original: string) =>
  original
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

export const humanify: THumanify = ({
  term,
  capitalize: cap = true,
  facetTerm = false,
}) => {
  let original;
  let humanified;
  if (facetTerm) {
    // Splits on capital letters f ollowed by lowercase letters to find
    // words squished together in a string.
    original = term.split(/(?=[A-Z][a-z])/).join(" ");
    humanified = term.replace(/\./g, " ").replace(/_/g, " ").trim();
  } else {
    const split = (original || term).split(".");
    humanified = split[split.length - 1].replace(/_/g, " ").trim();

    // Special case 'name' to include any parent nested for sake of
    // specificity in the UI
    if (humanified === "name" && split.length > 1) {
      humanified = `${split[split.length - 2]} ${humanified}`;
    }
  }
  return cap ? capitalize(humanified) : humanified;
};

export const idFields = [
  "sample_id",
  "portion_id",
  "analyte_id",
  "slide_id",
  "aliquot_id",
];

export const formatEntityInfo = (entity: any, foundType: any) => {
  const ids = {
    [`${foundType}_ID`]: entity.submitter_id,
    [`${foundType}_UUID`]: entity[idFields.find((id) => entity[id])],
  };
  const filtered = Object.entries(ids).concat(
    Object.entries(entity)
      .filter(
        ([key]) =>
          ![
            "submitter_id",
            "expanded",
            `${foundType}_id`,
            "__dataID__",
          ].includes(key),
      )
      .map(([key, value]) => [
        key,
        ["portions", "aliquots", "analytes", "slides"].includes(key)
          ? value.hits.total
          : value,
      ]),
  );

  const headersConfig = filtered.map(([key]) => ({
    field: key,
    name: humanify({ term: key }),
  }));

  const obj = { ...ids, ...Object.fromEntries(filtered) };

  return formatDataForHorizontalTable(obj, headersConfig);
};
