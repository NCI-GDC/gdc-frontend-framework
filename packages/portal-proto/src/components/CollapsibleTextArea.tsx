import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export const CollapsibleTextArea = ({
  text,
}: {
  text: string;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {text ? (
        <div>
          <div>
            {expanded || text.length <= 250
              ? text
              : `${text.substring(0, 250)}\u2026`}
          </div>
          {text.length > 250 && (
            <button
              className="float-right italic"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? (
                <div className="flex">
                  <AiFillCaretUp className="mr-1" title="show less icon" />
                  <span>less</span>
                </div>
              ) : (
                <div className="flex">
                  <AiFillCaretDown className="mr-1" title="show more icon" />
                  <span>more</span>
                </div>
              )}
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};
