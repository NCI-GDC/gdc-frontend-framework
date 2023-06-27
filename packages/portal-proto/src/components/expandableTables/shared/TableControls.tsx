import React from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Group, Menu, Button, Text } from "@mantine/core";
import { CountsIcon } from "@/features/shared/tailwindComponents";

interface ControlOption {
  label: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface TableControlsProps {
  numSelected: number;
  label: string;
  options: ControlOption[];
  additionalControls?: React.ReactNode;
  total: number;
}

const TableControls: React.FC<TableControlsProps> = ({
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
    <div className="flex items-center mt-2 gap-2">
      <Menu shadow="md" width="target">
        <Menu.Target>
          <Button
            variant="outline"
            color="primary"
            className="bg-base-max border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary"
            rightIcon={<MdOutlineArrowDropDown size={20} />}
            leftIcon={
              numSelected > 0 ? (
                <CountsIcon $count={numSelected}>{numSelected}</CountsIcon>
              ) : null
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
          {options.map(
            ({ value, label, onClick, disabled = false }: ControlOption) => {
              if (value !== "placeholder") {
                return (
                  <Menu.Item key={label} onClick={onClick} disabled={disabled}>
                    {label}
                  </Menu.Item>
                );
              }
            },
          )}
        </Menu.Dropdown>
      </Menu>
      <Group>{additionalControls}</Group>
      <div>
        {
          <Text
            data-testid="text-total"
            className="font-heading font-bold text-md"
          >
            TOTAL OF {total.toLocaleString("en-US")}{" "}
            {total == 1 ? label.toUpperCase() : `${label.toUpperCase()}S`}
          </Text>
        }
      </div>
    </div>
  );
};

export default TableControls;
