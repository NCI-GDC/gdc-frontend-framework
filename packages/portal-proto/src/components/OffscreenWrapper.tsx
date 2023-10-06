import React from "react";

/***
 * Render component offscreen and invisible to screen readers. Use for rendering charts for downloads.
 */
const OffscreenWrapper: React.FC = ({ children }) => {
  return (
    <div
      className="h-64 absolute left-[-1000px]"
      aria-hidden="true"
      // Makes component and children non-interactable by keyboard
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore https://github.com/facebook/react/pull/24730 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
      inert=""
    >
      {children}
    </div>
  );
};

export default OffscreenWrapper;
