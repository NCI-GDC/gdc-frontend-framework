import { MouseEventHandler } from "react";

export interface SummaryComponentProps {
  readonly title: string;
  readonly value: string;
  readonly buttonAction?: MouseEventHandler;
  readonly icon: JSX.Element;
}

/**
 * Summary Component for displaying summery data with icon and possible click event 
 */
const SummaryComponent = (
  props: SummaryComponentProps,
): JSX.Element => {
  const addLinkValue = () => {
    if (props.buttonAction) {
      return (<button 
          onClick={props.buttonAction}
          className="text-nci-blue underline"
        >
          {props.value}
        </button>);
    } else {
      return (props.value);
    }
  }
  return <div className="bg-white p-2 mb-4 flex items-center max-w-xs">
    <div className="flex-auto">
      <div className="uppercase tracking-tight">{props.title}</div>
      <div className="text-xl">
        {addLinkValue()}
      </div>
    </div>
    <div className="flex-none text-4xl" aria-hidden="true">
      {props.icon}
    </div>
  </div>;
};

export default SummaryComponent;