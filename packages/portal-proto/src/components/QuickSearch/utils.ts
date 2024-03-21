import { isObject } from "lodash";

export const extractEntityPath = (item: Record<string, any>): string => {
  if (item.id) {
    const entity = `${atob(item.id).split(":")[0].toLocaleLowerCase()}s`;
    return `/${entity}/${atob(item.id).split(":")[1]}`;
  } else {
    return `/files/${item.uuid}`;
  }
};

// Following the logic of v1 as mentioned in the ticket (PEAR-254) for similar search results for now
// https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/components/QuickSearch/QuickSearchResults.js#L79
export const findMatchingToken = (
  item: Record<string, any>,
  query: string,
  value = "",
): string => {
  const keys = Object.keys(item);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    // continue if the keys are keys OR __dataID__
    if (k === "keys" || k === "__dataID__") continue;
    const terms = [].concat(item[k]);
    for (let j = 0; j < terms.length; j++) {
      const term = terms[j];
      if (isObject(term)) {
        if ((term as any).hits) {
          const edges = (term as any).hits.edges || [];
          for (let k = 0; k < edges; k++) {
            const nextValue = findMatchingToken(edges[k].node, query, value);
            if (!(value && value.length < nextValue.length)) {
              value = nextValue;
            }
          }
        }
        const nextValue = findMatchingToken(term, query, value);
        if (!(value && nextValue && value.length < nextValue.length)) {
          value = nextValue;
        }
        continue;
      }
      if (
        (typeof term === "string" ? term : "")
          .toLocaleLowerCase()
          .replace(/[()]/g, "")
          .indexOf(query) !== -1
      ) {
        value = term;
      }
    }
  }
  return value;
};
