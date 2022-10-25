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
          <span className="rounded-full bg-primary-darker text-primary-contrast-darker p-1 align-text-bottom mr-2">
            {iconText}
          </span>
        </Tooltip>
      ) : (
        <span
          className={`rounded-full  ${
            changeOnHover
              ? "bg-primary-contrast-darker text-primary-darker"
              : "bg-primary-darker text-primary-contrast-darker"
          } p-1 align-text-bottom mr-2`}
        >
          {iconText}
        </span>
      )}
    </>
  );
};
