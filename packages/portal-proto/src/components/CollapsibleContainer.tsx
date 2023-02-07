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
}

export const CollapsibleContainer: React.FC<CollapsibleContainerProps> = (
  props: PropsWithChildren<CollapsibleContainerProps>,
) => {
  const { Top, isCollapsed, toggle, children, onlyIcon = true } = props;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div className="flex flex-row items-center bg-primary-darkest pr-4">
          <Button
            className="bg-base-lightest text-base-contrast-lightest p-2 hover:bg-primary hover:text-primary-contrast"
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
