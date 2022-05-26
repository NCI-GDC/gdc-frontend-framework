import { PropsWithChildren } from "react";
//import { Button } from "../features/layout/UserFlowVariedPages";
import { Button, Collapse } from "@mantine/core";
import {
  MdChevronRight as ExpandMoreIcon,
  MdExpandMore as ExpandLessIcon,
} from "react-icons/md";

export interface CollapsibleContainerProps {
  readonly isCollapsed: boolean;
  readonly toggle: () => void;
  readonly Top: React.FC<unknown>;
}

export const CollapsibleContainer: React.FC<CollapsibleContainerProps> = (
  props: PropsWithChildren<CollapsibleContainerProps>,
) => {
  const { Top, isCollapsed, toggle, children } = props;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div className="flex flex-row items-center bg-nci-blue-darkest pr-4">
          <Button
            className="bg-white text-nci-blue-darkest p-2"
            onClick={toggle}
          >
            {isCollapsed ? (
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
        {children}
      </Collapse>
    </div>
  );
};
