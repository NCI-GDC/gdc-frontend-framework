// credit to https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/uikit/Highlight.js
// This is only used in BioTree

import React from "react";

export const internalHighlight = (
  query: string,
  foundText: string,
): JSX.Element => {
  const index = (foundText || "").toLocaleLowerCase().indexOf(query);
  if (foundText && index !== -1) {
    const seg1 = foundText.substring(0, index);
    const foundQuery = foundText.substring(index, index + query.length);
    const seg2 = foundText.substring(index + query.length);
    return (
      <span>
        {seg1}
        <mark className="font-bold bg-accent-warm italic">{foundQuery}</mark>
        {seg2}
      </span>
    );
  }
  return <span>{foundText}</span>;
};

interface HighlightProps {
  search: string;
  text: string;
}

/**
 * Highlight text in a string using color bg-accent-warm
 * @param search - the text to search for
 * @param text - the text to highlight
 */
const Highlight = ({ search, text }: HighlightProps): JSX.Element => (
  <span>{internalHighlight(search, text)}</span>
);

export default Highlight;
