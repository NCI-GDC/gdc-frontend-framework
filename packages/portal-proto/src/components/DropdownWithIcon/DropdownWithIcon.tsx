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

interface DropdownWithIconProps {
  /**
   *    if true, doesn't set width to be "target"
   */
  disableTargetWidth?: boolean;
  /**
   *   Left Icon for the taret button, can be undefined too
   */
  LeftIcon?: JSX.Element;
  /**
   *   Right Icon for the taret button, can be undefined too (default to dropdown icon)
   */
  RightIcon?: JSX.Element;
  /**
   *    Content for target button
   */
  TargetButtonChildren: ReactNode;
  /**
   *    disables the target button and menu
   */
  targetButtonDisabled?: boolean;
  /**
   *    array dropdown items. Need to pass title, onClick event handler is optional
   */
  dropdownElements: Array<{
    title: string;
    onClick?: () => void;
  }>;
  /**
   *    only provide menuLabelText if we want label for dropdown elements
   */
  menuLabelText?: string;
  /**
   *    custom class / stylings for menuLabelText
   */
  menuLabelCustomClass?: string;
  /**
   *    custom position for Menu
   */
  customPosition?: FloatingPosition;
}

export const DropdownWithIcon = ({
  disableTargetWidth,
  LeftIcon,
  RightIcon = <Dropdown size="1.25em" aria-label="dropdown icon" />,
  TargetButtonChildren,
  targetButtonDisabled,
  dropdownElements,
  menuLabelText,
  menuLabelCustomClass,
  customPosition,
}: DropdownWithIconProps): JSX.Element => {
  const { classes } = useStyles();

  return (
    <Menu
      width={!disableTargetWidth && "target"}
      classNames={classes}
      {...(customPosition && { position: customPosition })}
      data-testid="menu-elem"
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
            <Menu.Label
              className={menuLabelCustomClass ?? "font-bold"}
              data-testid="menu-label"
            >
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
            key={`${title}-${idx}`}
            data-testid={`${title}-${idx}`}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
