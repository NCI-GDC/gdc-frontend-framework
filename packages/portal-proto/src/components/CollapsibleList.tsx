import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

export const CollapsibleList = ({
  data,
  limit = 2,
  collapseText = "less",
  expandText = `${data.length - limit} more`,
  customUlStyle,
  customLiStyle,
  customToggleTextStyle,
}: {
  data: Array<any>;
  limit?: number;
  collapseText?: string;
  expandText?: string;
  customUlStyle?: string;
  customLiStyle?: string;
  customToggleTextStyle?: string;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ul className={`list-none pl-0 mb-0 inline-block ${customUlStyle}`}>
      {data.slice(0, expanded ? data.length : limit).map((d) => (
        <li key={uuidv4()} className={customLiStyle}>
          {d}
        </li>
      ))}
      {data.length > limit && (
        <li className="float-right cursor-pointer">
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className={`text-nci-blue ${customToggleTextStyle || "italic"}`}
          >
            {expanded ? (
              <div className="flex">
                <AiFillCaretUp className="mr-1" title="show less icon" />
                <span>{collapseText}</span>
              </div>
            ) : (
              <div className="flex">
                <AiFillCaretDown className="mr-1" title="show more icon" />
                <span>{expandText}</span>
              </div>
            )}
          </button>
        </li>
      )}
    </ul>
  );
};
