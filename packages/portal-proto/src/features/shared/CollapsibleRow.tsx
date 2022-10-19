import React, { useState } from "react";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowUp as UpIcon,
} from "react-icons/md";
import { createKeyboardAccessibleFunction } from "src/utils";

const CollapsibleRow = ({
  value,
  label,
}: {
  value: string[];
  label: string;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);

  if (value.length === 1) {
    return <>{value[0]}</>;
  } else {
    return (
      <>
        {collapsed ? (
          <span
            onClick={() => setCollapsed(false)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              setCollapsed(false),
            )}
            role="button"
            tabIndex={0}
            className="text-primary cursor-pointer flex items-center"
          >
            <DownIcon /> {value.length} {label}
          </span>
        ) : (
          <>
            <ul className="list-disc">
              {value.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <span
              onClick={() => setCollapsed(true)}
              onKeyDown={createKeyboardAccessibleFunction(() =>
                setCollapsed(true),
              )}
              role="button"
              tabIndex={0}
              className="text-primary cursor-pointer flex items-center"
            >
              <UpIcon /> collapse
            </span>
          </>
        )}
      </>
    );
  }
};

export default CollapsibleRow;
