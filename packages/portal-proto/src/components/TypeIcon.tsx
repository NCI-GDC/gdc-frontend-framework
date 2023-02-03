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
        <Tooltip label={toolTipLabel}>
          <span className="aspect-square rounded-full bg-primary-darker text-primary-contrast-darker p-1 align-text-bottom mr-2">
            {iconText}
          </span>
        </Tooltip>
      ) : (
        <span
          className={`w-9 h-9 shrink-0 grow-0 aspect-square uppercase rounded-full ${
            changeOnHover
              ? "bg-primary-contrast-darker text-primary-darker"
              : "bg-primary-darker text-primary-contrast-darker"
          } p-1 pt-1.5 align-text-center text-center mr-2 shadow-md`}
        >
          {iconText}
        </span>
      )}
    </>
  );
};
