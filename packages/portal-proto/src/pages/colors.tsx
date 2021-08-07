import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Image from "next/image";

const nciPrimaryColors = ["gray", "red", "blumine", "blue", "teal", "cyan"];
const nciSecondaryColors = ["green", "violet", "purple", "orange", "yellow"];
const gdcPrimaryColors = [
  "grey",
  "red",
  "blue",
  "blue-warm",
  "cyan",
  "cyan-vivid",
];
const gdcSecondaryColors = ["green", "indigo", "violet", "orange", "yellow"];
const lightVariations = ["lightest", "lighter", "light"];
const darkVariations = ["dark", "darker", "darkest"];

const variationGrade = {
  lightest: 5,
  lighter: 10,
  light: 30,
  DEFAULT: 50,
  dark: 60,
  darker: 70,
  darkest: 80,
};
interface ColorPaletteProps {
  readonly org: string;
  readonly name: string;
  readonly colors: ReadonlyArray<string>;
  readonly grades?: Record<string, number>;
}

const ColorPalette = ({ org, name, colors, grades }: ColorPaletteProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="font-bold">{name}</div>
      <div className="grid grid-cols-11 w-4/5 gap-y-2">
        {colors.map((color) => (
          <>
            <div className="col-span-2">
              {org}-{color}
            </div>
            <div></div>
            {lightVariations.map((variation) => (
              <div
                key={variation}
                className={`bg-${org}-${color}-${variation} rounded-xl text-center mr-2`}
              >
                {grades && grades[variation]}
              </div>
            ))}
            <div className={`bg-${org}-${color} rounded-l-xl text-center`}>
              {grades && grades["DEFAULT"]}
            </div>
            <div
              className={`bg-${org}-${color} rounded-r-xl text-center text-white`}
            >
              {grades && grades["DEFAULT"]}
            </div>
            {darkVariations.map((variation) => (
              <div
                key={variation}
                className={`bg-${org}-${color}-${variation} rounded-xl text-center text-white ml-2`}
              >
                {grades && grades[variation]}
              </div>
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
        <ColorPalette
          org="nci"
          name="NCI Primary Color Palette"
          colors={nciPrimaryColors}
        />
        <ColorPalette
          org="nci"
          name="NCI Secondary Color Palette"
          colors={nciSecondaryColors}
        />
        <ColorPalette
          org="gdc"
          name="GDC Primary Color Palette"
          colors={gdcPrimaryColors}
          grades={variationGrade}
        />
        <ColorPalette
          org="gdc"
          name="GDC Secondary Color Palette"
          colors={gdcSecondaryColors}
          grades={variationGrade}
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
