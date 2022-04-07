export interface Track {
  readonly fieldName: string;
  readonly name: string;
  readonly sort: (field: string) => void;
  readonly group: string;
  readonly collapsed?: boolean;
  readonly type?: string;
}

export interface FillMap {
  [key: string]: string | Record<string, string>;
}

export const sortInt = (field: string): ((a: Record<string, any>, b: Record<string, any>) => void) => {
  return (a, b) => {
    if (b[field] !== a[field]) {
      return (b[field] || 0) - (a[field] || 0);
    } else {
      return defaultSort(a, b);
    }
  };
};

export const sortBool = (field: string): ((a: Record<string, any>, b: Record<string, any>) => void) => {
  return (a, b) => {
    if (a[field] && !b[field]) {
      return -1;
    } else if (!a[field] && b[field]) {
      return 1;
    } else {
      return defaultSort(a, b);
    }
  };
};

export const sortByString = (field: string): ((a: Record<string, any>, b: Record<string, any>) => void) => {
  return (a, b) => {
    if (a[field] > b[field]) {
      return 1;
    } else if (a[field] < b[field]) {
      return -1;
    } else {
      return defaultSort(a, b);
    }
  };
};

const defaultSort = sortByString("id");

const colorPalette = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export const getFillColorMap = (
  raceValues: string[],
  ethnicityValues: string[],
): FillMap => ({
  age: "#638f56",
  totalDonors: "#9370db",
  cgc: "#006400",
  "Transcriptome Profiling": " #3cb371",
  "Copy Number Variation": "#e9967a",
  "Simple Nucleotide Variation": "#bdb76b",
  Clinical: "#bdb76b",
  Biospecimen: "#2f4f4f",
  "Sequencing Reads": "#00FFFF",
  gender: {
    male: "#420692",
    female: "#DC609C",
  },
  vitalStatus: {
    alive: "#1693c0",
    dead: "#8b0000",
  },
  daysToDeath: "#0000FF",
  race: { ...getColorsForValues(raceValues) },
  ethnicity: { ...getColorsForValues(ethnicityValues) },
});

const getColorsForValues = (values: string[]): Record<string, string> => {
  const colorMap = {};
  values.sort().forEach((value, idx) => {
    colorMap[value] = colorPalette[idx];
  });

  return colorMap;
};

export const clinicalTracks: Track[] = [
  {
    name: "Gender",
    fieldName: "gender",
    sort: sortByString,
    group: "Clinical",
    collapsed: true,
  },
  {
    name: "Race",
    fieldName: "race",
    sort: sortByString,
    group: "Clinical",
  },
  {
    name: "Ethnicity",
    fieldName: "ethnicity",
    sort: sortByString,
    group: "Clinical",
    collapsed: true,
  },
  {
    name: "Age at Diagnosis",
    fieldName: "age",
    sort: sortInt,
    group: "Clinical",
    type: "continuous",
  },
  {
    name: "Vital Status",
    fieldName: "vitalStatus",
    sort: sortByString,
    group: "Clinical",
  },
  {
    name: "Days To Death",
    fieldName: "daysToDeath",
    sort: sortInt,
    group: "Clinical",
    type: "continuous",
  },
];

export const dataTypesTrack: Track[] = [
  {
    name: "Clinical",
    fieldName: "Clinical",
    sort: sortInt,
    group: "Data Types",
  },
  {
    name: "Biospecimen",
    fieldName: "Biospecimen",
    sort: sortInt,
    group: "Data Types",
  },
  {
    name: "Sequencing Reads",
    fieldName: "Sequencing Reads",
    sort: sortInt,
    group: "Data Types",
  },
  {
    name: "Simple Nucleotide Variation",
    fieldName: "Simple Nucleotide Variation",
    sort: sortInt,
    group: "Data Types",
  },
  {
    name: "Copy Number Variation",
    fieldName: "Copy Number Variation",
    sort: sortInt,
    group: "Data Types",
  },
  {
    name: "Transcriptome Profiling",
    fieldName: "Transcriptome Profiling",
    sort: sortInt,
    group: "Data Types",
  },
];

export const donorTracks = [...clinicalTracks, ...dataTypesTrack];

export const geneTracks: Track[] = [
  {
    name: "# Cases affected",
    fieldName: "totalDonors",
    sort: sortInt,
    group: "GDC",
  },
  {
    name: "Cancer Gene Census",
    fieldName: "cgc",
    sort: sortBool,
    group: "Gene Sets",
  },
];
