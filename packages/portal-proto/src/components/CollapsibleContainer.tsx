import { PropsWithChildren } from "react";
import classNames from "classnames";
import { Button } from "../features/layout/UserFlowVariedPages";
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
  const childrenClassNames = classNames({
    hidden: isCollapsed,
    block: !isCollapsed,
  });
  return (
    <div className="flex flex-col p-1">
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div className="flex items-stretch">
          <Button stylingOff={true} className="bg-nci-blue-lighter hover:bg-nci-blue-darkest hover:text-nci-blue-lightest rounded-lg rounded-l-none rounded-b-none border-0 border-l-2  px-5 " onClick={toggle}>
            {isCollapsed ? <ExpandMoreIcon size="1.75em" /> : <ExpandLessIcon  size="1.75em" />}
          </Button>
        </div>
      </div>
      <div className={childrenClassNames}>{children}</div>
    </div>
  );
};
