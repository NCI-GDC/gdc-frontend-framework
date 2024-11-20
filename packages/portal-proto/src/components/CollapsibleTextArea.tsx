import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@/utils/icons";

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
                  <CaretUpIcon className="mr-1 self-center" aria-hidden />
                  <span>less</span>
                </div>
              ) : (
                <div className="flex">
                  <CaretDownIcon className="mr-1 self-center" aria-hidden />
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
