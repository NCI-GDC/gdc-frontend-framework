import { Tooltip } from "@mantine/core";

export const TypeIcon = ({
  toolTipLabel,
  iconText,
  changeOnHover,
}: {
  toolTipLabel?: string;
  iconText: string;
  changeOnHover?: boolean;
}): JSX.Element => {
  return (
    <>
      {toolTipLabel ? (
        <Tooltip label={toolTipLabel} withinPortal={true}>
          <span className="rounded-full aspect-square w-5 h-5 flex justify-center bg-primary text-base-max">
            {iconText}
          </span>
        </Tooltip>
      ) : (
        <span
          className={`w-10 h-10 shrink-0 grow-0 aspect-square uppercase rounded-full ${
            changeOnHover
              ? "bg-primary-contrast-darker text-primary-darker"
              : "bg-primary-darker text-primary-contrast-darker"
          } p-1 pt-2 align-text-center text-center mr-2 shadow-md whitespace-nowrap`}
        >
          {iconText}
        </span>
      )}
    </>
  );
};
