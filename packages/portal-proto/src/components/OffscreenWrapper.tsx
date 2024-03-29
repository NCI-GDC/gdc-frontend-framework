import React, { PropsWithChildren } from "react";

/***
 * Render component offscreen and invisible to screen readers. Use for rendering charts for downloads.
 */
const OffscreenWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="h-64 absolute left-[-10000px]"
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
