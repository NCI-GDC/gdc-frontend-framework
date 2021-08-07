import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Image from "next/image";

const primaryColors = ["gray", "red", "blumine", "blue", "teal", "cyan"];
const secondaryColors = ["green", "violet", "purple", "orange", "yellow"];
const lightVariations = ["lightest", "lighter", "light"];
const darkVariations = ["dark", "darker", "darkest"];

interface ColorPaletteProps {
  readonly name: string;
  readonly colors: ReadonlyArray<string>;
}

const ColorPalette = ({ name, colors }: ColorPaletteProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="font-bold">{name}</div>
      <div className="grid grid-cols-11 w-3/5 gap-2">
        {colors.map((color) => (
          <>
            <div className="col-span-2">nci-{color}</div>
            <div></div>
            {lightVariations.map((variation) => (
              <div
                key={variation}
                className={`bg-nci-${color}-${variation} rounded-xl text-center`}
              ></div>
            ))}
            <div className={`col-span-2 bg-nci-${color} rounded-xl text-center`}></div>
            {darkVariations.map((variation) => (
              <div
                key={variation}
                className={`bg-nci-${color}-${variation} rounded-xl text-center`}
              ></div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

const ColorsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col gap-y-8">
        <ColorPalette name="NCI Primary Color Palette" colors={primaryColors} />
        <ColorPalette
          name="NCI Secondary Color Palette"
          colors={secondaryColors}
        />
        <div className="flex flex-col gap-y-2">
          <div className="font-bold">NCI Cheese Color Standards</div>
          <div>
            <Image src="/nci-color-standards.jpg" height="300" width="671" />
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default ColorsPage;
