// credit to https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/uikit/Highlight.js

import React from "react";

export const internalHighlight = (
  query: string,
  foundText: string,
  highlightStyle: React.CSSProperties = { fontWeight: "bold" },
): JSX.Element => {
  const index = (foundText || "").toLocaleLowerCase().indexOf(query);
  if (foundText && index !== -1) {
    const seg1 = foundText.substring(0, index);
    const foundQuery = foundText.substring(index, index + query.length);
    const seg2 = foundText.substring(index + query.length);
    return (
      <span>
        {seg1}
        <span style={highlightStyle}>{foundQuery}</span>
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
const Highlight = ({ search, text }: HighlightProps): JSX.Element => (
  <span>{internalHighlight(search, text)}</span>
);

export default Highlight;
