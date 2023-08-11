// used in SMS Consequence Table JSON Download to sort giving priority based off nested fields (ex. json = { transcript : { is_canonical, aa_change, ...otherFields } } )
// {boolean} (ex. is_canonical) always appear first in sorting order if true
// {string} (ex. aa_change) sort in ascending order based off the string order and null values sorting last;

export const sortByNestedFieldWithPriority = (
  a,
  b,
  nestField,
  boolean,
  string,
) => {
  if (a[nestField][boolean] && !b[nestField][boolean]) {
    return -1;
  } else if (!a[nestField][boolean] && b[nestField][boolean]) {
    return 1;
  } else {
    if (a[nestField][string] === null && b[nestField][string] !== null) {
      return 1;
    }
    if (a[nestField][string] !== null && b[nestField][string] === null) {
      return -1;
    }
    if (a[nestField][string] !== null && b[nestField][string] !== null) {
      return a[nestField][string].localeCompare(
        b[nestField][string],
        undefined,
        { sensitivity: "base" },
      );
    }
  }
};
