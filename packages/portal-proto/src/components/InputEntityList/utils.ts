interface Match {
  readonly field: string;
  readonly value: string;
}

export interface MatchResults {
  readonly submittedIdentifiers: Match[];
  readonly mappedTo: Match[];
  readonly output: Match[];
}

/**
  Parses through the API response to figure out what fields our matched values correspond to
  @param data: API response for the matches
  @param mappedToFields: fields we mapped to
  @param submittedIdentifierFields: fields that we accept from the user
  @param outputField: field used for creating set
  @param tokens: the list of identifiers the user input
**/

export const getMatchedIdentifiers = (
  data: readonly Record<string, any>[],
  mappedToFields: string[],
  submittedIdentifierFields: string[],
  outputField: string,
  tokens: string[],
): MatchResults[] => {
  const matchedData = [];
  const caseInsensitiveTokens = new Set(tokens.map((t) => t.toLowerCase()));

  data.forEach((d) => {
    const matches: MatchResults = {
      submittedIdentifiers: [],
      mappedTo: [],
      output: [],
    };
    findAllIdentifiers(
      d,
      submittedIdentifierFields,
      mappedToFields,
      outputField,
      caseInsensitiveTokens,
      "",
      matches,
    );

    if (matches.submittedIdentifiers.length > 0) {
      matchedData.push(matches);
    }
  });

  return matchedData;
};

/**
 * Recursively looks through API response to match values input by user to their API fields
 * @param object: object we are recursively searching through
 * @param submittedIdentifierFields: fields that we accept from the user
 * @param mappedToFields: fields we mapped to
 * @param outputField: field used for creating set
 * @param tokens: the list of identifiers the user input
 * @param path: accumulator for the path we are currently searching on, i.e. "samples.sample_id"
 * @param results: object of matches we find
 */

const findAllIdentifiers = (
  object: Record<string, any> | string,
  submittedIdentifierFields: string[],
  mappedToFields: string[],
  outputField: string,
  tokens: Set<string>,
  path = "",
  results: MatchResults,
) => {
  if (object === undefined || object === null || typeof object === "string") {
    return;
  }

  Object.keys(object).forEach((k) => {
    const fullPath = path !== "" ? `${path}.${k}` : k;

    if (Array.isArray(object[k])) {
      object[k].forEach((v) => {
        if (
          submittedIdentifierFields.includes(fullPath) &&
          tokens.has(v.toLowerCase())
        ) {
          results.submittedIdentifiers.push({
            field: fullPath,
            value: v,
          });
        }

        if (mappedToFields.includes(fullPath)) {
          results.mappedTo.push({
            field: fullPath,
            value: v,
          });
        }

        if (outputField === fullPath) {
          results.output.push({
            field: fullPath,
            value: v,
          });
        }

        findAllIdentifiers(
          v,
          submittedIdentifierFields,
          mappedToFields,
          outputField,
          tokens,
          fullPath,
          results,
        );
      });
    } else {
      if (
        submittedIdentifierFields.includes(fullPath) &&
        tokens.has(object[k].toLowerCase())
      ) {
        results.submittedIdentifiers.push({
          field: fullPath,
          value: object[k],
        });
      }

      if (mappedToFields.includes(fullPath)) {
        results.mappedTo.push({
          field: fullPath,
          value: object[k],
        });
      }

      if (outputField === fullPath) {
        results.output.push({
          field: fullPath,
          value: object[k],
        });
      }

      findAllIdentifiers(
        object[k],
        submittedIdentifierFields,
        mappedToFields,
        outputField,
        tokens,
        fullPath,
        results,
      );
    }
  });
};
