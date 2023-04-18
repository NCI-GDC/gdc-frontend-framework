import { PropsWithChildren } from "react";
import { Button, Collapse } from "@mantine/core";
import {
  MdExpandLess as ExpandLessIcon,
  MdExpandMore as ExpandMoreIcon,
} from "react-icons/md";

export interface CollapsibleContainerProps {
  readonly isCollapsed: boolean;
  readonly toggle: () => void;
  readonly Top: React.FC<unknown>;
  readonly onlyIcon?: boolean;
  readonly isContextBar?: boolean;
}

export const CollapsibleContainer: React.FC<CollapsibleContainerProps> = (
  props: PropsWithChildren<CollapsibleContainerProps>,
) => {
  const {
    Top,
    isCollapsed,
    toggle,
    children,
    onlyIcon = true,
    isContextBar = false,
  } = props;
  return (
    <div
      className={`flex flex-col ${
        isContextBar && "overflow-y-auto max-h-screen-90vh"
      }`}
    >
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div className="flex flex-row items-center bg-primary pr-4 pb-2">
          <Button
            className="bg-base-max text-primary p-2 hover:bg-primary-darkest hover:text-primary-contrast"
            onClick={toggle}
            classNames={{ leftIcon: `${!onlyIcon && "mr-0"} ` }}
            aria-expanded={!isCollapsed}
            aria-label="expand/collapse container"
            leftIcon={
              !onlyIcon ? (
                isCollapsed ? (
                  <ExpandMoreIcon size="1.75em" />
                ) : (
                  <ExpandLessIcon size="1.75em" />
                )
              ) : null
            }
          >
            {!onlyIcon ? (
              isCollapsed ? (
                "Expand"
              ) : (
                "Collapse"
              )
            ) : isCollapsed ? (
              <ExpandMoreIcon size="1.75em" />
            ) : (
              <ExpandLessIcon size="1.75em" />
            )}
          </Button>
        </div>
      </div>
      <Collapse
        in={!isCollapsed}
        transitionDuration={200}
        transitionTimingFunction="linear"
      >
        {!isCollapsed ? children : null}
      </Collapse>
    </div>
  );
};
