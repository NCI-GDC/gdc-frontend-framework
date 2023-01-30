import { Button, createStyles, Menu } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating/types";
import { ReactNode } from "react";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";

const useStyles = createStyles((theme) => ({
  item: {
    "&[data-hovered]": {
      // TODO: remove with theme color other than blue
      backgroundColor: theme.colors.blue[3],
      color: theme.white,
    },
  },
}));

export const DropdownWithIcon = ({
  disableTargetWidth,
  LeftIcon,
  RightIcon = <Dropdown size="1.25em" />,
  TargetButtonChildren,
  targetButtonDisabled,
  dropdownElements,
  menuLabelText,
  menuLabelCustomClass,
  customPosition,
}: {
  disableTargetWidth?: boolean;
  LeftIcon?: JSX.Element;
  RightIcon?: JSX.Element;
  TargetButtonChildren: ReactNode;
  targetButtonDisabled?: boolean;
  dropdownElements: Array<{
    title: string;
    onClick?: () => void;
  }>;
  menuLabelText?: string;
  menuLabelCustomClass?: string;
  customPosition?: FloatingPosition;
}): JSX.Element => {
  const { classes } = useStyles();

  return (
    <Menu
      width={!disableTargetWidth && "target"}
      classNames={classes}
      {...(customPosition && { position: customPosition })}
    >
      <Menu.Target>
        <Button
          variant="outline"
          color="primary"
          {...(LeftIcon && { leftIcon: LeftIcon })}
          rightIcon={RightIcon}
          disabled={targetButtonDisabled}
        >
          {TargetButtonChildren}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {menuLabelText && (
          <>
            <Menu.Label className={menuLabelCustomClass ?? "font-bold"}>
              {menuLabelText}
            </Menu.Label>
            <Menu.Divider />
          </>
        )}
        {dropdownElements.map(({ title, onClick }, idx) => (
          <Menu.Item
            onClick={() => {
              onClick && onClick();
            }}
            key={`title-${idx}`}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
