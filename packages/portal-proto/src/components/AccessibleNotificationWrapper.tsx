import React, { PropsWithChildren, useEffect, useRef } from "react";

/**
 * Wrapper for Notifications to move focus to them and return focus to the triggering element to improve
 * accessibility
 */
const AccessibleNotificationWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>();
  const lastFocusedElement = useRef<HTMLElement>();

  const returnFocus = () => {
    lastFocusedElement?.current?.focus();
  };

  useEffect(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement;
    const childButton = ref?.current?.querySelector("button");
    if (childButton) {
      childButton.focus();
    }

    return () => {
      window.setTimeout(returnFocus, 10);
    };
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div aria-live="assertive" ref={ref}>
      {children}
    </div>
  );
};

export default AccessibleNotificationWrapper;
