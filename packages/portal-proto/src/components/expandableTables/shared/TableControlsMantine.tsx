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
            rightIcon={<MdOutlineArrowDropDown />}
            leftIcon={
              <Box className="bg-primary-dark text-primary-dark-contrast w-7 h-7 rounded-md flex justify-center items-center">
                {numSelected}
              </Box>
            }
          >
            {buttonLabel[0].label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label className="bg-primary text-primary-contrast font-heading font-bold">
            {numSelected === 0
              ? `${total.toLocaleString()} ${label}s`
              : numSelected === 1
              ? `1 ${label}`
              : `${numSelected.toLocaleString()} ${label}s`}
          </Menu.Label>
          {options.map(({ value, label }: ControlOption) => {
            if (value !== "placeholder") {
              return <Menu.Item key={label}>{label}</Menu.Item>;
            }
          })}
        </Menu.Dropdown>
      </Menu>
      <Group className="mx-2">{additionalControls}</Group>
      <div>
        {total !== 0 && (
          <Text className="font-heading font-bold text-md">
            TOTAL OF {total.toLocaleString("en-US")}{" "}
            {total == 1 ? label.toUpperCase() : `${label.toUpperCase()}S`}
          </Text>
        )}
      </div>
    </div>
  );
};

export default TableControlsMantine;
