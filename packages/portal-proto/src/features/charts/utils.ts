
export const processJSONData = (facetData: Record<string, any>) => {
  return Object.entries(facetData).map(e => ({ label: e[0], value: e[1] }));
};


