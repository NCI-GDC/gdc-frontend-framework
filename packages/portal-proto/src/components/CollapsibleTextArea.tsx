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
              aria-expanded={expanded}
            >
              {expanded ? (
                <div className="flex">
                  <AiFillCaretUp className="mr-1 self-center" aria-hidden />
                  <span>less</span>
                </div>
              ) : (
                <div className="flex">
                  <AiFillCaretDown className="mr-1 self-center" aria-hidden />
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
