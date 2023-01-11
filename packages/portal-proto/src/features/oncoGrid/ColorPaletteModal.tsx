import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Button,
  Tooltip,
  ColorSwatch,
  ColorPicker,
  Popover,
} from "@mantine/core";
import { consequenceTypes, cnvTypes, suggestedColorMap } from "./constants";
import { ColorMap } from "./types";

interface ColorPickerButtonProps {
  readonly label: string;
  readonly value: string;
  readonly color: string;
  readonly setColor: (value: string, color: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  label,
  value,
  color,
  setColor,
}: ColorPickerButtonProps) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  return (
    <Popover
      opened={colorPickerOpen}
      onClose={() => setColorPickerOpen(false)}
      position={"bottom"}
      withinPortal={false}
    >
      <Popover.Target>
        <Box>
          <Tooltip label={"Click to adjust color"} withArrow>
            <Button
              variant="outline"
              color="gray"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              classNames={{
                root: "min-w-[150px]",
              }}
            >
              <ColorSwatch color={color} />
              <div className="pl-1">{label}</div>
            </Button>
          </Tooltip>
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <ColorPicker
          format="rgba"
          value={color}
          onChange={(newColor) => setColor(value, newColor)}
        />
      </Popover.Dropdown>
    </Popover>
  );
};

interface ColorPaletteModalProps {
  readonly closeModal: () => void;
  readonly opened: boolean;
  readonly colorMap: ColorMap;
  readonly setNewColorMap: (colorMap) => void;
}

const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  closeModal,
  opened,
  colorMap,
  setNewColorMap,
}: ColorPaletteModalProps) => {
  const [mutationPalette, setMutationPalette] = useState(colorMap.mutation);
  const [cnvPalette, setCnvPalette] = useState(colorMap.cnv);

  useEffect(() => {
    setMutationPalette(colorMap.mutation);
    setCnvPalette(colorMap.cnv);
  }, [colorMap]);

  const savePalette = () => {
    localStorage.setItem(
      "oncogridActiveTheme",
      JSON.stringify({ mutation: mutationPalette, cnv: cnvPalette }),
    );
    setNewColorMap({ mutation: mutationPalette, cnv: cnvPalette });
    closeModal();
  };

  const closeWithSaving = () => {
    setMutationPalette(colorMap.mutation);
    setCnvPalette(colorMap.cnv);
    closeModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title="Choose Grid Colors"
      classNames={{
        body: "px-16",
      }}
      size={800}
      zIndex={400}
      withinPortal={false}
    >
      Select the colors to display for each element on the OncoGrid. Click on an
      element below to choose a color for that element, or apply a suggested
      theme.
      <h3 className="my-4">Customize Mutation Colors</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(consequenceTypes).map(([value, label]) => (
          <ColorPickerButton
            label={label}
            value={value}
            color={mutationPalette[value]}
            key={value}
            setColor={(value, color) =>
              setMutationPalette({ ...mutationPalette, [value]: color })
            }
          />
        ))}
      </div>
      <h3 className="my-4">Suggested Mutation Theme</h3>
      <div className="border rounded flex flex-wrap gap-4 p-3">
        {Object.entries(consequenceTypes).map(([value, label]) => (
          <div className="flex my-auto min-w-[150px]" key={value}>
            <ColorSwatch color={suggestedColorMap.mutation[value]} />
            <div className="pl-2">{label}</div>
          </div>
        ))}
        <Button
          classNames={{ root: "ml-auto" }}
          onClick={() => setMutationPalette(suggestedColorMap.mutation)}
          variant={"outline"}
        >
          Apply
        </Button>
      </div>
      <h3 className="my-4">Customize CNV Colors</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(cnvTypes).map(([value, label]) => (
          <ColorPickerButton
            label={label}
            value={value}
            color={cnvPalette[value]}
            key={value}
            setColor={(value, color) =>
              setCnvPalette({ ...cnvPalette, [value]: color })
            }
          />
        ))}
      </div>
      <h3 className="my-4">Suggested CNV Theme</h3>
      <div className="border rounded flex flex-wrap gap-4 p-3">
        {Object.entries(cnvTypes).map(([value, label]) => (
          <div className="flex my-auto min-w-[150px]" key={value}>
            <ColorSwatch color={suggestedColorMap.cnv[value]} />
            <div className="pl-2">{label}</div>
          </div>
        ))}
        <Button
          classNames={{ root: "ml-auto" }}
          onClick={() => setCnvPalette(suggestedColorMap.cnv)}
          variant={"outline"}
        >
          Apply
        </Button>
      </div>
      <hr className="m-4" />
      <div className="flex justify-end gap-x-2">
        <Button className="bg-primary" onClick={closeWithSaving}>
          Cancel
        </Button>
        <Button className="bg-primary" onClick={savePalette}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default ColorPaletteModal;
