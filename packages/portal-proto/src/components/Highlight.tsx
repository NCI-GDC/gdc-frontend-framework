// credit to https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/uikit/Highlight.js

import React from "react";

export const internalHighlight = (
  query: string,
  foundText: string,
  background: boolean,
): JSX.Element => {
  const index = (foundText || "").toLocaleLowerCase().indexOf(query);
  if (foundText && index !== -1) {
    const seg1 = foundText.substring(0, index);
    const foundQuery = foundText.substring(index, index + query.length);
    const seg2 = foundText.substring(index + query.length);
    return (
      <span>
        {seg1}
        <mark className={background ? "bg-yellow" : "font-bold bg-transparent"}>
          {foundQuery}
        </mark>
        {seg2}
      </span>
    );
  }
  return <span>{foundText}</span>;
};

interface HighlightProps {
  search: string;
  text: string;
  background?: boolean;
}
const Highlight = ({
  search,
  text,
  background = false,
}: HighlightProps): JSX.Element => (
  <span>{internalHighlight(search, text, background)}</span>
);

export default Highlight;
