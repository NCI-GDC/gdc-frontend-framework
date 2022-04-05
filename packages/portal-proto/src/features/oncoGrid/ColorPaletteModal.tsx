import { useEffect, useState } from "react";
import {
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
      target={
        <div>
          <Tooltip label={"Click to adjust color"} withArrow>
            <Button
              variant="outline"
              color="gray"
              onClick={() => setColorPickerOpen(true)}
            >
              <ColorSwatch color={color} />
              <div className="pl-1">{label}</div>
            </Button>
          </Tooltip>
        </div>
      }
    >
      <ColorPicker
        format="rgba"
        value={color}
        onChange={(newColor) => setColor(value, newColor)}
      />
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

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title="Choose Grid Colors"
      classNames={{
        body: "px-16",
      }}
      size={800}
    >
      Select the colors to display for each element on the OncoGrid. To change a
      color, click on the square and select the color of interest.
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
          <div className="flex my-auto" key={value}>
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
          <div className="flex my-auto" key={value}>
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
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          onClick={() => {
            localStorage.setItem(
              "oncogridActiveTheme",
              JSON.stringify({ mutation: mutationPalette, cnv: cnvPalette }),
            );
            setNewColorMap({ mutation: mutationPalette, cnv: cnvPalette });
            closeModal();
          }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default ColorPaletteModal;
