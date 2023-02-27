import React from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Box, Group, Menu, Button, Text } from "@mantine/core";

interface ControlOption {
  label: string;
  value: string;
}

interface TableControlsProps {
  numSelected: number;
  label: string;
  options: ControlOption[];
  additionalControls?: React.ReactNode;
  total: number;
}

const TableControlsMantine: React.FC<TableControlsProps> = ({
  numSelected,
  label,
  options,
  additionalControls,
  total,
}: TableControlsProps) => {
  const buttonLabel = options.filter(
    ({ value }: ControlOption) => value === "placeholder",
  );
  return (
    <div className="flex flex-row items-center mt-3">
      <Menu shadow="md">
        <Menu.Target>
          <Button
            variant="outline"
            color="primary"
            className="bg-base-max border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
            rightIcon={<MdOutlineArrowDropDown />}
            leftIcon={
              <Box className="bg-accent text-base-max w-7 h-7 rounded-md flex justify-center items-center">
                {numSelected}
              </Box>
            }
          >
            {buttonLabel[0].label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown className="border-1 border-primary">
          <Menu.Label className="bg-base-max text-primary font-heading font-bold border-primary border-b-1">
            {numSelected === 0
              ? `${total.toLocaleString()} ${label}s`
              : numSelected === 1
              ? `1 ${label}`
              : `${numSelected.toLocaleString()} ${label}s`}
          </Menu.Label>
          {options.map(({ value, label }: ControlOption) => {
            if (value !== "placeholder") {
              return (
                <Menu.Item
                  key={label}
                  className="data-hovered:bg-accent-lightest data-hovered:text-accent-contrast-lightest"
                >
                  {label}
                </Menu.Item>
              );
            }
          })}
        </Menu.Dropdown>
      </Menu>
      <Group className="mx-2">{additionalControls}</Group>
      <div>
        {
          <Text className="font-heading font-bold text-md">
            TOTAL OF {total.toLocaleString("en-US")}{" "}
            {total == 1 ? label.toUpperCase() : `${label.toUpperCase()}S`}
          </Text>
        }
      </div>
    </div>
  );
};

export default TableControlsMantine;
