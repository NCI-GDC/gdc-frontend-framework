interface Match {
  readonly field: string;
  readonly value: string;
}

/**
  Parses through the API response to figure out what fields our matched values correspond to
  @param data: API response for the matches
  @param mappedToFields: fields we mapped to, will be used to create set
  @param givenIdentifierFields: fields that we accept from the user
  @param tokens: the list of identifiers the user input
**/

export const getMatchedIdentifiers = (
  data: readonly Record<string, any>[],
  mappedToFields: string[],
  givenIdentifierFields: string[],
  tokens: string[],
): { mappedTo: Match[]; givenIdentifiers: Match[] }[] => {
  const matchedData = [];
  data.forEach((d) => {
    const mappedTo: Match[] = [];
    // fields we are mapping to don't need to be compared to user input
    findAllIdentifiers(d, mappedToFields, undefined, "", mappedTo);

    const givenIdentifiers: Match[] = [];
    findAllIdentifiers(d, givenIdentifierFields, tokens, "", givenIdentifiers);

    if (givenIdentifiers.length > 0) {
      matchedData.push({
        mappedTo,
        givenIdentifiers,
      });
    }
  });

  return matchedData;
};

/**
 * Recursively looks through API response to match values input by user to their API fields
 * @param object: object we are recursively searching through
 * @param searchFields: list of fields we are matching against
 * @param tokens: the list of identifiers the user input, if undefined don't compare against user input
 * @param path: accumulator for the path we are currently searching on, i.e. "samples.sample_id"
 * @param results: array of matches we find
 */

const findAllIdentifiers = (
  object: Record<string, any> | string,
  searchFields: string[],
  tokens: string[],
  path = "",
  results = [],
) => {
  if (object === undefined || object === null || typeof object === "string") {
    return;
  }

  Object.keys(object).forEach((k) => {
    const fullPath = path !== "" ? `${path}.${k}` : k;

    if (Array.isArray(object[k])) {
      object[k].forEach((v) => {
        if (
          searchFields.includes(fullPath) &&
          (tokens === undefined ||
            tokens.map((t) => t.toLowerCase()).includes(v.toLowerCase()))
        ) {
          results.push({
            field: fullPath,
            value: v,
          });
        }

        findAllIdentifiers(v, searchFields, tokens, fullPath, results);
      });
    } else {
      if (
        searchFields.includes(fullPath) &&
        (tokens === undefined ||
          tokens.map((t) => t.toLowerCase()).includes(object[k].toLowerCase()))
      ) {
        results.push({
          field: fullPath,
          value: object[k],
        });
      }

      findAllIdentifiers(object[k], searchFields, tokens, fullPath, results);
    }
  });
};
