import { Button, Menu } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating/types";
import { ReactNode, useState } from "react";
import { Tooltip } from "@mantine/core";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import { useFocusTrap } from "@mantine/hooks";

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
   *    whether the dropdown should fill the height of its parent
   */
  fullHeight?: boolean;
  /**
   *   custom z-index for Menu, defaults to undefined
   */
  zIndex?: number;
  /**
   * custom test id
   */
  customDataTestId?: string;

  /**
    tooltip
   */
  tooltip?: string;
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
  fullHeight,
  zIndex = undefined,
  customDataTestId = undefined,
  tooltip = undefined,
}: DropdownWithIconProps): JSX.Element => {
  const [trapped, setTrapped] = useState(false);
  const focusTrap = useFocusTrap(trapped);
  return (
    <Menu
      width={!disableTargetWidth && "target"}
      {...(customPosition && { position: customPosition })}
      data-testid={customDataTestId ?? "menu-elem"}
      zIndex={zIndex}
      returnFocus={true}
      onClose={() => setTrapped(false)}
      onOpen={() => setTrapped(true)}
    >
      <Menu.Target>
        <Button
          tabIndex={0}
          variant="outline"
          color="primary"
          className="bg-base-max border-primary focus:border-6 focus:border-double focus:border-rounded-md focus:border-focusColor data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
          {...(LeftIcon && { leftIcon: LeftIcon })}
          rightIcon={RightIcon}
          disabled={targetButtonDisabled}
          classNames={{
            rightIcon: "border-l pl-1 -mr-2",
            root: fullHeight ? "h-full" : undefined,
          }}
        >
          <div>
            {tooltip?.length && !targetButtonDisabled ? (
              <div>
                <Tooltip label={tooltip}>
                  <div>{TargetButtonChildren}</div>
                </Tooltip>
              </div>
            ) : (
              <div>{TargetButtonChildren}</div>
            )}
          </div>
        </Button>
      </Menu.Target>
      <Menu.Dropdown
        data-testid="dropdown-menu-options"
        className="border-1 border-secondary"
      >
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
          <span key={idx} ref={focusTrap}>
            <Menu.Item
              tabIndex={0}
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
          </span>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
