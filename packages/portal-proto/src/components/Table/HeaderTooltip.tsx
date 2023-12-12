import { Tooltip, Text } from "@mantine/core";

export const HeaderTooltip = ({
  title,
  tooltip,
}: {
  title: string;
  tooltip?: string;
}): JSX.Element => {
  return (
    <Tooltip
      disabled={!tooltip}
      label={<Text className="whitespace-pre-line text-left">{tooltip}</Text>}
      width={200}
      multiline
      withArrow
      transitionProps={{ duration: 200, transition: "fade" }}
      position="bottom-start"
    >
      <div className="font-heading text-left text-sm whitespace-pre-line">
        {title}
      </div>
    </Tooltip>
  );
};
