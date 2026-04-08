import React, { JSX, ReactNode, useRef } from "react";
import { Button, Menu, MenuProps, Tooltip } from "@mantine/core";
import { focusStyles } from "src/utils";
import { DropdownIcon } from "@/utils/icons";
import { ADDITIONAL_DOWNLOAD_MESSAGE } from "@/utils/constants";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

interface DropdownWithIconProps {
  /**
   *    if true, doesn't set width to be "target"
   */
  disableTargetWidth?: boolean;
  /**
   *   Left Section for the target button, can be undefined too
   */
  LeftSection?: JSX.Element;
  /**
   *   Right Section for the target button, can be undefined too (default to dropdown icon)
   */
  RightSection?: JSX.Element;
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
    isLoading?: boolean; // if true, shows loading tooltip
    loadingTooltip?: string; // custom loading tooltip text
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
  customPosition?: MenuProps["position"];
  /**
   *    whether the dropdown should fill the height of its parent
   */
  fullHeight?: boolean;
  /**
   * custom target button's test id
   */
  customTargetButtonDataTestId?: string;

  /**
    target button's tooltip
   */
  targetButtonTooltip?: string;

  /**
   * aria-label for the button
   */
  buttonAriaLabel?: string;
  /**
   * Determines whether Menu should be closed when item is clicked
   */
  closeOnItemClick?: boolean;
}

export const DropdownWithIcon = ({
  disableTargetWidth,
  LeftSection,
  RightSection = (
    <div className="border-l pl-1 -mr-2">
      <DropdownIcon
        size="1.25em"
        aria-hidden="true"
        data-testid="dropdown-icon"
      />
    </div>
  ),
  TargetButtonChildren,
  targetButtonDisabled,
  dropdownElements,
  menuLabelText,
  menuLabelCustomClass,
  customPosition,
  fullHeight,
  customTargetButtonDataTestId = undefined,
  targetButtonTooltip = undefined,
  buttonAriaLabel = undefined,
  closeOnItemClick = true,
}: DropdownWithIconProps): JSX.Element => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);

  const targetRef = useRef<HTMLButtonElement>(null);

  return (
    <Menu
      opened={opened}
      onOpen={open}
      onClose={close}
      width={!disableTargetWidth && "target"}
      {...(customPosition && { position: customPosition })}
      zIndex={9000} //dropdown should be on top of everything when open
      closeOnItemClick={closeOnItemClick}
    >
      <Menu.Target>
        <Tooltip label={targetButtonTooltip} disabled={!targetButtonTooltip}>
          <Button
            variant="outline"
            color="primary"
            className={`flex items-center bg-base-max border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary ${focusStyles}`}
            {...(LeftSection && !isMobile && { leftSection: LeftSection })}
            rightSection={RightSection}
            disabled={targetButtonDisabled}
            classNames={{
              root: `${fullHeight ? "h-full" : undefined}`,
            }}
            ref={targetRef}
            aria-label={buttonAriaLabel}
            aria-expanded={opened}
            data-testid={customTargetButtonDataTestId ?? "menu-elem"}
          >
            {TargetButtonChildren}
          </Button>
        </Tooltip>
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
        {dropdownElements.map(
          (
            { title, onClick, icon, disabled, isLoading, loadingTooltip },
            idx,
          ) => {
            const menuItem = (
              <Menu.Item
                onClick={() => {
                  if (onClick) {
                    onClick();
                  }
                  // This is done inorder to set the last focused element as the menu target element
                  // This is done to return focus to the target element if the modal is closed with ESC
                  if (targetRef?.current) {
                    targetRef?.current?.focus();
                  }
                }}
                key={`${title}-${idx}`}
                data-testid={`${title}-${idx}`}
                leftSection={icon && icon}
                disabled={disabled}
              >
                {title}
              </Menu.Item>
            );

            if (isLoading) {
              return (
                <Tooltip
                  key={`${title}-${idx}`}
                  label={loadingTooltip || ADDITIONAL_DOWNLOAD_MESSAGE}
                  position="right"
                  withArrow
                  multiline
                  w={400}
                >
                  <div>{menuItem}</div>
                </Tooltip>
              );
            }

            return menuItem;
          },
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
