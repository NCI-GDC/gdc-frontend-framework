import { PropsWithChildren } from "react";
import classNames from "classnames";
import { Button } from "../features/layout/UserFlowVariedPages";
import {
  MdExpandMore as ExpandMoreIcon,
  MdExpandLess as ExpandLessIcon,
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
    <div className="flex flex-col border border-gray-400 p-4">
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div className="flex items-stretch">
          <Button onClick={toggle}>
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </Button>
        </div>
      </div>
      <div className={childrenClassNames}>{children}</div>
    </div>
  );
};
