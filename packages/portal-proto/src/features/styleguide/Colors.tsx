import React from "react";
import { Divider } from "@mantine/core";
import { divider_style } from "./style";

const nciPrimaryColors = {
  "gray": ["bg-nci-gray-lightest", "bg-nci-gray-lighter", "bg-nci-gray-light", "bg-nci-gray", "bg-nci-gray-dark", "bg-nci-gray-darker", "bg-nci-gray-darkest"],
  "red": ["bg-nci-red-lightest", "bg-nci-red-lighter", "bg-nci-red-light", "bg-nci-red", "bg-nci-red-dark", "bg-nci-red-darker", "bg-nci-red-darkest"],
  "blumine": ["bg-nci-blumine-lightest", "bg-nci-blumine-lighter", "bg-nci-blumine-light", "bg-nci-blumine", "bg-nci-blumine-dark", "bg-nci-blumine-darker", "bg-nci-blumine-darkest"],
  "blue": ["bg-nci-blue-lightest", "bg-nci-blue-lighter", "bg-nci-blue-light", "bg-nci-blue", "bg-nci-blue-dark", "bg-nci-blue-darker", "bg-nci-blue-darkest"],
  "teal": ["bg-nci-teal-lightest", "bg-nci-teal-lighter", "bg-nci-teal-light", "bg-nci-teal", "bg-nci-teal-dark", "bg-nci-teal-darker", "bg-nci-teal-darkest"],
  "cyan": ["bg-nci-cyan-lightest", "bg-nci-cyan-lighter", "bg-nci-cyan-light", "bg-nci-cyan", "bg-nci-cyan-dark", "bg-nci-cyan-darker", "bg-nci-cyan-darkest"],
};
const nciSecondaryColors = {
  "green": ["bg-nci-green-lightest", "bg-nci-green-lighter", "bg-nci-green-light", "bg-nci-green", "bg-nci-green-dark", "bg-nci-green-darker", "bg-nci-green-darkest"],
  "violet": ["bg-nci-violet-lightest", "bg-nci-violet-lighter", "bg-nci-violet-light", "bg-nci-violet", "bg-nci-violet-dark", "bg-nci-violet-darker", "bg-nci-violet-darkest"],
  "purple": ["bg-nci-purple-lightest", "bg-nci-gray-lighter", "bg-nci-gray-light", "bg-nci-gray", "bg-nci-gray-dark", "bg-nci-gray-darker", "bg-nci-gray-darkest"],
  "orange": ["bg-nci-orange-lightest", "bg-nci-orange-lighter", "bg-nci-orange-light", "bg-nci-orange", "bg-nci-orange-dark", "bg-nci-orange-darker", "bg-nci-orange-darkest"],
  "yellow": ["bg-nci-yellow-lightest", "bg-nci-yellow-lighter", "bg-nci-yellow-light", "bg-nci-yellow", "bg-nci-yellow-dark", "bg-nci-yellow-darker", "bg-nci-yellow-darkest"],
};

const gdcPrimaryColors = {
  "grey": ["bg-gdc-grey-lightest", "bg-gdc-grey-lighter", "bg-gdc-grey-light", "bg-gdc-grey", "bg-gdc-grey-dark", "bg-gdc-grey-darker", "bg-gdc-grey-darkest"],
  "red": ["bg-gdc-red-lightest", "bg-gdc-red-lighter", "bg-gdc-red-light", "bg-gdc-red", "bg-gdc-red-dark", "bg-gdc-red-darker", "bg-gdc-red-darkest"],
  "blue": ["bg-gdc-blue-lightest", "bg-gdc-blue-lighter", "bg-gdc-blue-light", "bg-gdc-blue", "bg-gdc-blue-dark", "bg-gdc-blue-darker", "bg-gdc-blue-darkest"],
  "blue-warm": ["bg-gdc-blue-warm-lightest", "bg-gdc-blue-warm-lighter", "bg-gdc-blue-warm-light", "bg-gdc-blue-warm", "bg-gdc-blue-warm-dark", "bg-gdc-blue-warm-darker", "bg-gdc-blue-warm-darkest"],
  "cyan": ["bg-gdc-cyan-lightest", "bg-gdc-cyan-lighter", "bg-gdc-cyan-light", "bg-gdc-cyan", "bg-gdc-cyan-dark", "bg-gdc-cyan-darker", "bg-gdc-cyan-darkest"],
  "cyan-vivid": ["bg-gdc-cyan-vivid-lightest", "bg-gdc-cyan-vivid-lighter", "bg-gdc-cyan-vivid-light", "bg-gdc-cyan-vivid", "bg-gdc-cyan-vivid-dark", "bg-gdc-cyan-vivid-darker", "bg-gdc-cyan-vivid-darkest"],
};
const gdcSecondaryColors = {
  "green": ["bg-gdc-green-lightest", "bg-gdc-green-lighter", "bg-gdc-green-light", "bg-gdc-green", "bg-gdc-green-dark", "bg-gdc-green-darker", "bg-gdc-green-darkest"],
  "indigo": ["bg-gdc-indigo-lightest", "bg-gdc-indigo-lighter", "bg-gdc-indigo-light", "bg-gdc-indigo", "bg-gdc-indigo-dark", "bg-gdc-indigo-darker", "bg-gdc-indigo-darkest"],
  "violet": ["bg-gdc-violet-lightest", "bg-gdc-violet-lighter", "bg-gdc-violet-light", "bg-gdc-violet", "bg-gdc-violet-dark", "bg-gdc-violet-darker", "bg-gdc-violet-darkest"],
  "orange": ["bg-gdc-orange-lightest", "bg-gdc-orange-lighter", "bg-gdc-orange-light", "bg-gdc-orange", "bg-gdc-orange-dark", "bg-gdc-orange-darker", "bg-gdc-orange-darkest"],
  "yellow": ["bg-gdc-yellow-lightest", "bg-gdc-yellow-lighter", "bg-gdc-yellow-light", "bg-gdc-yellow", "bg-gdc-yellow-dark", "bg-gdc-yellow-darker", "bg-gdc-yellow-darkest"],
};


interface ColorStylePalletProps {
  readonly name: string;
  readonly colors: ReadonlyArray<string>;
}

const ColorPalletLine = ({ name, colors }: ColorStylePalletProps) => {
  return (
    <div className="flex flex-row items-center font-montserrat">
      <div className="grid gap-12 grid-cols-11 grid-rows-1 my-1">
        <p className="col-span-3 font-medium w-24">{name}</p>
        {colors.map((x) => <div key={x} className={`${x} p-4 px-8 mx-2 rounded`} />)}
      </div>
    </div>
  );

};


const Colors: React.FC<void> = () => {
  return (
    <article className="prose font-montserrat text-nci-gray md:prose-md">
      <p className="prose font-semibold text-2xl">Color Pallets</p>
      <div className="flex flex-col">
        <div>
          <p className="prose font-medium text-xl">Official NCI Colors</p>
          The following colors are based on the NCI digital design guide.
        </div>
        <Divider label="NCI Primary Colors"  classNames={divider_style} />

        {Object.keys(nciPrimaryColors).map((name: string) => <ColorPalletLine key={`${name}-pallet`} name={name}
                                                                              colors={nciPrimaryColors[name]} />)}
        <Divider label="NCI Secondary Colors"  classNames={divider_style}/>
        {Object.keys(nciSecondaryColors).map((name: string) => <ColorPalletLine key={`${name}-pallet`} name={name}
                                                                                colors={nciSecondaryColors[name]} />)}
        <div>
          <p className="text-xl">Accessible GDC Colors</p>
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
        <Divider label="GDC Primary Colors"  classNames={divider_style}/>
        {Object.keys(gdcPrimaryColors).map((name: string) => <ColorPalletLine key={`${name}-pallet`} name={name}
                                                                                colors={gdcPrimaryColors[name]} />)}
        <Divider label="GDC Secondary Colors" classNames={divider_style} />
        {Object.keys(gdcSecondaryColors).map((name: string) => <ColorPalletLine key={`${name}-pallet`} name={name}
                                                                                colors={gdcSecondaryColors[name]} />)}
      </div>
    </article>
  );
};


export default Colors;
