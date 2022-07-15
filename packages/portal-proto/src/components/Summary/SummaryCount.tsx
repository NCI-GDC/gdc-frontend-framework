import { MouseEventHandler } from "react";
import { IconType } from "react-icons";

export interface SummaryCountProps {
  readonly title: string;
  readonly count: string;
  readonly buttonAction?: MouseEventHandler;
  readonly Icon: IconType;
}

/**
 * Summary Component for displaying summery data with icon and possible click event
 */
const SummaryCount = ({
  buttonAction,
  title,
  count,
  Icon,
}: SummaryCountProps): JSX.Element => {
  const addLinkValue = () => {
    if (buttonAction) {
      return (
        <button onClick={buttonAction} className="text-nci-blue underline">
          {count}
        </button>
      );
    } else {
      return count;
    }
  };
  return (
    <div className="bg-white p-2 mb-4 flex items-center max-w-xs">
      <div className="flex-auto">
        <div className="uppercase tracking-tight text-xs">{title}</div>
        <div className="text-xl">{addLinkValue()}</div>
      </div>
      <div className="flex-none text-4xl" aria-hidden="true">
        <Icon color="gray" />
      </div>
    </div>
  );
};

export default SummaryCount;
