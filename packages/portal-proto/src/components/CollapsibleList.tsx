import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export const CollapsibleList = ({
  data,
  limit = 2,
  collapseText = "less",
  expandText = `${data.length - limit} more`,
}: {
  data: Array<any>;
  limit?: number;
  collapseText?: string;
  expandText?: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ul className="list-none pl-0 mb-0 inline-block">
      {data.slice(0, expanded ? data.length : limit).map((d, i) => (
        <li key={i}>{d}</li>
      ))}
      {data.length > limit && (
        <li className="float-right italic cursor-pointer">
          <a className="no-underline" onClick={() => setExpanded((e) => !e)}>
            {expanded ? (
              <div className="flex">
                <AiFillCaretUp className="mr-1" />
                <span>{collapseText}</span>
              </div>
            ) : (
              <div className="flex">
                <AiFillCaretDown className="mr-1" />
                <span>{expandText}</span>
              </div>
            )}
          </a>
        </li>
      )}
    </ul>
  );
};
