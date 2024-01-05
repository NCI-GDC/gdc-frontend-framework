import { PropsWithChildren, ReactNode } from "react";
import { Collapse, Tooltip } from "@mantine/core";
import {
  MdExpandLess as ExpandLessIcon,
  MdExpandMore as ExpandMoreIcon,
} from "react-icons/md";
import { FloatingPosition } from "@mantine/core/lib/Floating";

export interface CollapsibleContainerProps {
  readonly isCollapsed: boolean;
  readonly toggle: () => void;
  readonly Top: ReactNode;
  readonly onlyIcon?: boolean;
  readonly isContextBar?: boolean;
  readonly tooltipText?: string;
  readonly tooltipPosition?: FloatingPosition;
  /*
   * Children for the Button when onlyIcon is false
   */
  readonly TargetElement?: ReactNode;
  readonly ExtraControl?: ReactNode;
}

export const CollapsibleContainer = (
  props: PropsWithChildren<CollapsibleContainerProps>,
) => {
  const {
    Top,
    isCollapsed,
    toggle,
    children,
    onlyIcon = true,
    isContextBar = false,
    tooltipText = undefined,
    tooltipPosition = "top",
    TargetElement,
    ExtraControl,
  } = props;
  return (
    <div
      className={`flex flex-col ${
        isContextBar && "overflow-y-auto max-h-screen-90vh"
      }`}
    >
      <div className="flex flex-row">
        <div className="flex-grow">{Top}</div>
        <div className="flex items-center bg-primary pr-4 gap-4">
          <Tooltip label={tooltipText} position={tooltipPosition} withArrow>
            <span>
              <button
                data-testid="expandcollapseButton"
                className="bg-base-max text-primary p-2 hover:bg-primary-darkest hover:text-primary-contrast h-12 rounded-md"
                onClick={toggle}
                aria-expanded={!isCollapsed}
              >
                {!onlyIcon ? (
                  <div className="flex gap-1 items-center">
                    <>
                      {isCollapsed ? (
                        <ExpandMoreIcon size="1.75em" />
                      ) : (
                        <ExpandLessIcon size="1.75em" />
                      )}
                    </>

                    <>
                      {TargetElement !== undefined ? (
                        TargetElement
                      ) : (
                        <span>{isCollapsed ? "Expand" : "Collapse"}</span>
                      )}
                    </>
                  </div>
                ) : isCollapsed ? (
                  <ExpandMoreIcon size="1.75em" />
                ) : (
                  <ExpandLessIcon size="1.75em" />
                )}
              </button>
            </span>
          </Tooltip>
          {ExtraControl && <>{ExtraControl}</>}
        </div>
      </div>
      <Collapse
        in={!isCollapsed}
        transitionDuration={200}
        transitionTimingFunction="linear"
      >
        {children}
      </Collapse>
    </div>
  );
};
