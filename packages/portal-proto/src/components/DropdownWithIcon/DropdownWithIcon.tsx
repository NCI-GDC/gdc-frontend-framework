import { Button, Menu } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating/types";
import { ReactNode } from "react";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";

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
   *    array dropdown items. Need to pass title, onClick and icon event handler is optional
   */
  dropdownElements: Array<{
    title: string;
    onClick?: () => void;
    icon?: JSX.Element;
    disabled?: boolean; // if true, disables the menu item
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

  /**
   *   custom z-index for Menu, defaults to undefined
   */
  zIndex?: number;
  /**
   * custom test id
   */
  customDataTestId?: string;
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
  zIndex = undefined,
  customDataTestId = undefined,
}: DropdownWithIconProps): JSX.Element => {
  return (
    <Menu
      width={!disableTargetWidth && "target"}
      {...(customPosition && { position: customPosition })}
      data-testid={customDataTestId ?? "menu-elem"}
      zIndex={zIndex}
    >
      <Menu.Target>
        <Button
          variant="outline"
          color="primary"
          className="bg-base-max border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
          {...(LeftIcon && { leftIcon: LeftIcon })}
          rightIcon={RightIcon}
          disabled={targetButtonDisabled}
          classNames={{
            rightIcon: "border-l pl-1 -mr-2",
          }}
        >
          {TargetButtonChildren}
        </Button>
      </Menu.Target>
      <Menu.Dropdown className="border-1 border-secondary">
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
        {dropdownElements.map(({ title, onClick, icon, disabled }, idx) => (
          <Menu.Item
            onClick={() => {
              onClick && onClick();
            }}
            key={`${title}-${idx}`}
            data-testid={`${title}-${idx}`}
            icon={icon && icon}
            disabled={disabled}
          >
            {title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
