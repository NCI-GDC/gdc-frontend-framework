import { Tooltip } from "@mantine/core";

export const TypeIcon = ({
  toolTipLabel,
  iconText,
}: {
  toolTipLabel?: string;
  iconText: string;
}): JSX.Element => {
  return (
    <>
      {toolTipLabel ? (
        <Tooltip label={toolTipLabel}>
          <span className="rounded-full bg-nci-blue-darker text-white p-1 align-text-bottom mr-2">
            {iconText}
          </span>
        </Tooltip>
      ) : (
        <span className="rounded-full bg-nci-blue-darker text-white p-1 align-text-bottom mr-2">
          {iconText}
        </span>
      )}
    </>
  );
};
