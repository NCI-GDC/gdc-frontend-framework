import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { Image } from "@/components/Image";
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
      <h2 className="text-lg">{name}</h2>
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
      <div className="flex flex-col gap-y-4 py-4">
        <div>
          <h1 className="text-2xl">Official NCI Colors</h1>
          The following colors are based on the NCI digital design guide.
        </div>
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
        <div>
          <h1 className="text-2xl">Accessible GDC Colors</h1>
          The following colors come from the USWDS. They are the close
          approximations to the NCI color palette. The{" "}
          <a
            target="_blank"
            href="https://designsystem.digital.gov/design-tokens/color/overview/"
            rel="noopener noreferrer"
            className="text-gdc-blue"
          >
            USWDS colors
          </a>{" "}
          are designed to meet the accessibility contrast requirements as
          defined by WCAG 2.0 AA. Each color has a magic number. Colors with the
          same magic number have the same luminence. To meet the accessibility
          contrast requirements, colors must be 50 points apart. The default
          variations of each color have a magic number of 50. This means that
          they can be used against pure white (magic number = 0) and pure black
          (magic number = 100) backgrounds.
        </div>
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
