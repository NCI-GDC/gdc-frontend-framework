export const ssmsKeys = [
  "DNAChange",
  "type",
  "survival",
  "consequences",
  "affectedCasesInCohort",
  "affectedCasesAcrossTheGDC",
  "impact",
];
export const customSsmsKeys = ["impact", "survival"];

export const filterMutationType = (typeText: string): string => {
  const splitStr = typeText.split(" ");
  const operation = splitStr[splitStr.length - 1];
  return operation.charAt(0).toUpperCase() + operation.slice(1);
};

export const truncateAfterMarker = (
  term: string,
  markers: string[],
  omission: string,
): string => {
  const markersByIndex = markers.reduce(
    (acc, marker) => {
      const index = term.indexOf(marker);
      if (index !== -1) {
        return { index, marker };
      }
      return acc;
    },
    { index: -1, marker: "" },
  );
  const { index, marker } = markersByIndex;
  if (index !== -1 && term.length > index + marker.length + 8) {
    return `${term.substring(0, index + marker.length + 8)}${omission}`;
  }
  return term;
};

export const handleVep = (vepImpact: string): string => {
  switch (vepImpact) {
    case "HIGH":
      return "HI-red";
    case "MODERATE":
      return "MO-gray";
    case "LOW":
      return "MO-green";
    case "MODIFIER":
      return "MR-gray";
    default:
      return "-";
  }
};

export const handleSift = (siftImpact: string): string => {
  switch (siftImpact) {
    case "deleterious":
      return "DH-red";
    case "deleterious_low_confidence":
      return "DL-gray";
    case "tolerated":
      return "TO-gray";
    case "tolerated_low_confidence":
      return "TL-green";
    default:
      return "-";
  }
};

export const handlePoly = (polyImpact: string): string => {
  switch (polyImpact) {
    case "benign":
      return "BE-green";
    case "possibly_damaging":
      return "PO-gray";
    case "probably_damaging":
      return "PR-red";
    case "unknown":
      return "UN-gray";
    default:
      return "-";
  }
};

interface Annotation {
  polyphen_impact: string;
  polyphen_score: number;
  sift_impact: string;
  sift_score: number;
  vep_impact: string;
}

export const formatImpact = (annotation: Annotation): any => {
  // * tailwind styles must be declared somewhere to be applied dynamically
  const tailwindRed = `bg-red-400`; // eslint-disable-line @typescript-eslint/no-unused-vars
  const tailwindGreen = `bg-green-400`; // eslint-disable-line @typescript-eslint/no-unused-vars
  const tailwindGray = `bg-gray-400`; // eslint-disable-line @typescript-eslint/no-unused-vars
  const {
    vep_impact,
    sift_impact,
    sift_score,
    polyphen_impact,
    polyphen_score,
  } = annotation;
  const vepIcon = handleVep(vep_impact);
  const [vepText, vepColor] = vepIcon.split("-");
  const siftIcon = handleSift(sift_impact);
  const [siftText, siftColor] = siftIcon.split("-");
  const polyIcon = handlePoly(polyphen_impact);
  const [polyText, polyColor] = polyIcon.split("-");

  return {
    vepImpact: vep_impact,
    vepText: vepText,
    vepColor: `bg-${vepColor}-400`,
    siftScore: sift_score,
    siftText: siftText,
    siftColor: `bg-${siftColor}-400`,
    siftImpact: sift_impact,
    polyScore: polyphen_score,
    polyText: polyText,
    polyColor: `bg-${polyColor}-400`,
    polyImpact: polyphen_impact,
  };
};
