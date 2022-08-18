import React from "react";
import { Divider, Text } from "@mantine/core";
import { divider_style } from "./style";

const portalV2contrastColors = {
  "base-contrast": [
    "text-base-contrast-max",
    "text-base-contrast-lightest",
    "text-base-contrast-lighter",
    "text-base-contrast-light",
    "text-base-contrast",
    "text-base-contrast-vivid",
    "text-base-contrast-dark",
    "text-base-contrast-darker",
    "text-base-contrast-darkest",
    "text-base-contrast-min",
  ],
  "primary-contrast": [
    "text-primary-contrast-max",
    "text-primary-contrast-lightest",
    "text-primary-contrast-lighter",
    "text-primary-contrast-light",
    "text-primary-contrast",
    "text-primary-contrast-vivid",
    "text-primary-contrast-dark",
    "text-primary-contrast-darker",
    "text-primary-contrast-darkest",
    "text-primary-contrast-min",
  ],
  "secondary-contrast": [
    "text-secondary-contrast-max",
    "text-secondary-contrast-lightest",
    "text-secondary-contrast-lighter",
    "text-secondary-contrast-light",
    "text-secondary-contrast",
    "text-secondary-contrast-vivid",
    "text-secondary-contrast-dark",
    "text-secondary-contrast-darker",
    "text-secondary-contrast-darkest",
    "text-secondary-contrast-min",
  ],
  "accent-contrast": [
    "text-accent-contrast-max",
    "text-accent-contrast-lightest",
    "text-accent-contrast-lighter",
    "text-accent-contrast-light",
    "text-accent-contrast",
    "text-accent-contrast-vivid",
    "text-accent-contrast-dark",
    "text-accent-contrast-darker",
    "text-accent-contrast-darkest",
    "text-accent-contrast-min",
  ],
  "accent-warm-contrast": [
    "text-accent-warm-contrast-max",
    "text-accent-warm-contrast-lightest",
    "text-accent-warm-contrast-lighter",
    "text-accent-warm-contrast-light",
    "text-accent-warm-contrast",
    "text-accent-warm-contrast-vivid",
    "text-accent-warm-contrast-dark",
    "text-accent-warm-contrast-darker",
    "text-accent-warm-contrast-darkest",
    "text-accent-warm-contrast-min",
  ],
  "accent-cool-contrast": [
    "text-accent-cool-contrast-max",
    "text-accent-cool-contrast-lightest",
    "text-accent-cool-contrast-lighter",
    "text-accent-cool-contrast-light",
    "text-accent-cool-contrast",
    "text-accent-cool-contrast-vivid",
    "text-accent-cool-contrast-dark",
    "text-accent-cool-contrast-darker",
    "text-accent-cool-contrast-darkest",
    "text-accent-cool-contrast-min",
  ],
  "chart-contrast": [
    "text-chart-contrast-max",
    "text-chart-contrast-lightest",
    "text-chart-contrast-lighter",
    "text-chart-contrast-light",
    "text-chart-contrast",
    "text-chart-contrast-vivid",
    "text-chart-contrast-dark",
    "text-chart-contrast-darker",
    "text-chart-contrast-darkest",
    "text-chart-contrast-min",
  ],
  "utility-contrast": [
    "text-utility-contrast-link",
    "text-utility-contrast-success",
    "text-utility-contrast-warning",
    "text-utility-contrast-error",
    "text-utility-contrast-emergency",
    "text-utility-contrast-info",
    "text-utility-contrast-category1",
    "text-utility-contrast-category2",
    "text-utility-contrast-category3",
    "text-utility-contrast-category4",
  ],
};

const portalV2Colors = {
  base: [
    "bg-base-max",
    "bg-base-lightest",
    "bg-base-lighter",
    "bg-base-light",
    "bg-base",
    "bg-base-dark",
    "bg-base-darker",
    "bg-base-darkest",
    "bg-base-ink",
    "bg-base-min",
  ],
  primary: [
    "bg-primary-max",
    "bg-primary-lightest",
    "bg-primary-lighter",
    "bg-primary-light",
    "bg-primary",
    "bg-primary-vivid",
    "bg-primary-dark",
    "bg-primary-darker",
    "bg-primary-darkest",
    "bg-primary-min",
  ],

  secondary: [
    "bg-secondary-max",
    "bg-secondary-lightest",
    "bg-secondary-lighter",
    "bg-secondary-light",
    "bg-secondary",
    "bg-secondary-vivid",
    "bg-secondary-dark",
    "bg-secondary-darker",
    "bg-secondary-darkest",
    "bg-secondary-min",
  ],

  accent: [
    "bg-accent-max",
    "bg-accent-lightest",
    "bg-accent-lighter",
    "bg-accent-light",
    "bg-accent",
    "bg-accent-vivid",
    "bg-accent-dark",
    "bg-accent-darker",
    "bg-accent-darkest",
    "bg-accent-min",
  ],

  "accent-warm": [
    "bg-accent-warm-max",
    "bg-accent-warm-lightest",
    "bg-accent-warm-lighter",
    "bg-accent-warm-light",
    "bg-accent-warm",
    "bg-accent-warm-vivid",
    "bg-accent-warm-dark",
    "bg-accent-warm-darker",
    "bg-accent-warm-darkest",
    "bg-accent-warm-min",
  ],
  "accent-cool": [
    "bg-accent-cool-max",
    "bg-accent-cool-lightest",
    "bg-accent-cool-lighter",
    "bg-accent-cool-light",
    "bg-accent-cool",
    "bg-accent-cool-vivid",
    "bg-accent-cool-dark",
    "bg-accent-cool-darker",
    "bg-accent-cool-darkest",
    "bg-accent-cool-min",
  ],

  chart: [
    "bg-chart-max",
    "bg-chart-lightest",
    "bg-chart-lighter",
    "bg-chart-light",
    "bg-chart",
    "bg-chart-vivid",
    "bg-chart-dark",
    "bg-chart-darker",
    "bg-chart-darkest",
    "bg-chart-min",
  ],
  utility: [
    "bg-utility-link",
    "bg-utility-success",
    "bg-utility-warning",
    "bg-utility-error",
    "bg-utility-emergency",
    "bg-utility-info",
    "bg-utility-category1",
    "bg-utility-category2",
    "bg-utility-category3",
    "bg-utility-category4",
  ],
};

// TODO Decide if we still need these
/* ----
const nciPrimaryColors = {
  gray: [
    "bg-base-lightest",
    "bg-base-lighter",
    "bg-base-light",
    "bg-base",
    "bg-base-dark",
    "bg-base-darker",
    "bg-base-darkest",
  ],
  red: [
    "bg-nci-red-lightest",
    "bg-nci-red-lighter",
    "bg-nci-red-light",
    "bg-nci-red",
    "bg-nci-red-dark",
    "bg-nci-red-darker",
    "bg-nci-red-darkest",
  ],
  blumine: [
    "bg-accent-cool-lightest",
    "bg-accent-cool-lighter",
    "bg-accent-cool-light",
    "bg-accent-cool",
    "bg-accent-cool-dark",
    "bg-accent-cool-darker",
    "bg-accent-cool-darkest",
  ],
  blue: [
    "bg-primary-lightest",
    "bg-primary-lighter",
    "bg-primary-light",
    "bg-primary",
    "bg-primary-dark",
    "bg-primary-darker",
    "bg-primary-darkest",
  ],
  teal: [
    "bg-accent-cool-lightest",
    "bg-accent-cool-lighter",
    "bg-accent-cool-light",
    "bg-accent-cool",
    "bg-accent-cool-dark",
    "bg-accent-cool-darker",
    "bg-accent-cool-darkest",
  ],
  cyan: [
    "bg-accent-cool-lightest",
    "bg-accent-cool-lighter",
    "bg-accent-cool-light",
    "bg-accent-cool",
    "bg-accent-cool-dark",
    "bg-accent-cool-darker",
    "bg-accent-cool-darkest",
  ],
};
const nciSecondaryColors = {
  green: [
    "bg-nci-green-lightest",
    "bg-nci-green-lighter",
    "bg-nci-green-light",
    "bg-nci-green",
    "bg-nci-green-dark",
    "bg-nci-green-darker",
    "bg-nci-green-darkest",
  ],
  violet: [
    "bg-nci-violet-lightest",
    "bg-nci-violet-lighter",
    "bg-nci-violet-light",
    "bg-nci-violet",
    "bg-nci-violet-dark",
    "bg-nci-violet-darker",
    "bg-nci-violet-darkest",
  ],
  purple: [
    "bg-nci-purple-lightest",
    "bg-base-lighter",
    "bg-base-light",
    "bg-base",
    "bg-base-dark",
    "bg-base-darker",
    "bg-base-darkest",
  ],
  orange: [
    "bg-nci-orange-lightest",
    "bg-nci-orange-lighter",
    "bg-nci-orange-light",
    "bg-nci-orange",
    "bg-nci-orange-dark",
    "bg-nci-orange-darker",
    "bg-nci-orange-darkest",
  ],
  yellow: [
    "bg-nci-yellow-lightest",
    "bg-nci-yellow-lighter",
    "bg-nci-yellow-light",
    "bg-nci-yellow",
    "bg-nci-yellow-dark",
    "bg-nci-yellow-darker",
    "bg-nci-yellow-darkest",
  ],
};
const gdcPrimaryColors = {
  grey: [
    "bg-gdc-grey-lightest",
    "bg-gdc-grey-lighter",
    "bg-gdc-grey-light",
    "bg-gdc-grey",
    "bg-gdc-grey-dark",
    "bg-gdc-grey-darker",
    "bg-gdc-grey-darkest",
  ],
  red: [
    "bg-gdc-red-lightest",
    "bg-gdc-red-lighter",
    "bg-gdc-red-light",
    "bg-gdc-red",
    "bg-gdc-red-dark",
    "bg-gdc-red-darker",
    "bg-gdc-red-darkest",
  ],
  blue: [
    "bg-gdc-blue-lightest",
    "bg-gdc-blue-lighter",
    "bg-gdc-blue-light",
    "bg-gdc-blue",
    "bg-gdc-blue-dark",
    "bg-gdc-blue-darker",
    "bg-gdc-blue-darkest",
  ],
  "blue-warm": [
    "bg-gdc-blue-warm-lightest",
    "bg-gdc-blue-warm-lighter",
    "bg-gdc-blue-warm-light",
    "bg-gdc-blue-warm",
    "bg-gdc-blue-warm-dark",
    "bg-gdc-blue-warm-darker",
    "bg-gdc-blue-warm-darkest",
  ],
  cyan: [
    "bg-gdc-cyan-lightest",
    "bg-gdc-cyan-lighter",
    "bg-gdc-cyan-light",
    "bg-gdc-cyan",
    "bg-gdc-cyan-dark",
    "bg-gdc-cyan-darker",
    "bg-gdc-cyan-darkest",
  ],
  "cyan-vivid": [
    "bg-gdc-cyan-vivid-lightest",
    "bg-gdc-cyan-vivid-lighter",
    "bg-gdc-cyan-vivid-light",
    "bg-gdc-cyan-vivid",
    "bg-gdc-cyan-vivid-dark",
    "bg-gdc-cyan-vivid-darker",
    "bg-gdc-cyan-vivid-darkest",
  ],
};
const gdcSecondaryColors = {
  green: [
    "bg-gdc-green-lightest",
    "bg-gdc-green-lighter",
    "bg-gdc-green-light",
    "bg-gdc-green",
    "bg-gdc-green-dark",
    "bg-gdc-green-darker",
    "bg-gdc-green-darkest",
  ],
  indigo: [
    "bg-gdc-indigo-lightest",
    "bg-gdc-indigo-lighter",
    "bg-gdc-indigo-light",
    "bg-gdc-indigo",
    "bg-gdc-indigo-dark",
    "bg-gdc-indigo-darker",
    "bg-gdc-indigo-darkest",
  ],
  violet: [
    "bg-gdc-violet-lightest",
    "bg-gdc-violet-lighter",
    "bg-gdc-violet-light",
    "bg-gdc-violet",
    "bg-gdc-violet-dark",
    "bg-gdc-violet-darker",
    "bg-gdc-violet-darkest",
  ],
  orange: [
    "bg-gdc-orange-lightest",
    "bg-gdc-orange-lighter",
    "bg-gdc-orange-light",
    "bg-gdc-orange",
    "bg-gdc-orange-dark",
    "bg-gdc-orange-darker",
    "bg-gdc-orange-darkest",
  ],
  yellow: [
    "bg-gdc-yellow-lightest",
    "bg-gdc-yellow-lighter",
    "bg-gdc-yellow-light",
    "bg-gdc-yellow",
    "bg-gdc-yellow-dark",
    "bg-gdc-yellow-darker",
    "bg-gdc-yellow-darkest",
  ],
};
--- */
interface ColorStylePalletProps {
  readonly name: string;
  readonly colors: ReadonlyArray<string>;
}

interface ColorAndContrastStylePalletProps extends ColorStylePalletProps {
  readonly contrast?: ReadonlyArray<string>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ColorPalletLine = ({ name, colors }: ColorStylePalletProps) => {
  return (
    <div className="flex flex-row items-center font-montserrat">
      <div className="grid gap-12 grid-cols-11 grid-rows-1 my-1">
        <p className="col-span-3 font-medium w-24">{name}</p>
        {colors.map((x, i) => (
          <div key={`${x}-${i}`} className={`${x} p-4 px-8 mx-2 rounded`} />
        ))}
      </div>
    </div>
  );
};

const ColorAndcontrastPalletLine = ({
  name,
  colors,
  contrast = undefined,
}: ColorAndContrastStylePalletProps) => {
  return (
    <div className="flex flex-row items-center font-montserrat font-bold">
      <div className="grid gap-2 grid-cols-12 grid-rows-1 my-1">
        <p className="bg-base-max col-span-2 text-black ">{name}</p>
        {colors.map((x, i) => {
          const ext = x.split("-").slice(-1);
          return (
            <div
              key={`${x}-${i}`}
              className={`${x} ${contrast[i]} flex justify-center p-4 px-8 mx-2 rounded border text-sm border-black`}
            >
              {ext}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Colors: React.FC<void> = () => {
  return (
    <article className="prose font-montserrat bg-base-max text-base-contrast-lighter md:prose-md min-w-full">
      <p className="prose font-semibold text-2xl">Color Palettes</p>
      <div className="flex flex-col">
        <div>
          <p className="prose font-medium text-xl">Official NCI Colors</p>
          The following theme colors are used in the GDC Portal Version 2.
        </div>
        <Divider label="Portal theme color names" classNames={divider_style} />
        {Object.keys(portalV2Colors).map((name: string) => {
          return (
            <ColorAndcontrastPalletLine
              key={`${name}-pallet`}
              name={name}
              colors={portalV2Colors[name]}
              contrast={
                Object.keys(portalV2contrastColors).filter((element) =>
                  element.includes(name),
                ).length > 0
                  ? portalV2contrastColors[`${name}-contrast`]
                  : portalV2contrastColors["primary-contrast"]
              }
            />
          );
        })}
        <Divider label="USWDS theme color tokens" classNames={divider_style} />
        <Text>
          <p>
            <b>USWDS theme color tokens</b> are divided into five high-level
            role-based color families:{" "}
            <em>base, primary, secondary, accent-warm, and accent-cool.</em>
          </p>
          <b>Base</b> is a project’s neutral color, typically some tint of gray,
          and usually used as the text color throughout.
          <p>
            <b>Primary, secondary, and accent colors</b> can be thought of as
            falling into a proportional 60/30/10 relationship: about 60% of your
            site’s color would be the primary color family, about 30% would be
            the secondary color family, and about 10% would be the accent color
            families (accent-warm and accent-cool). Note that these proportions
            are for non-base colors. In many cases, the neutral base text color
            will be the predominant tone on your site.
          </p>
          <p>
            Each color family has seven possible lightness grades, from lightest
            to darkest, though not every family needs to include a color at each
            grade. Some grades may be set to false in your project’s theme
            settings. The default USWDS theme palette does not use every grade
            for every family. The primary and secondary families also have a
            vivid grade available.
          </p>
        </Text>
        {/*---
        <div>
          <p className="prose font-medium text-xl">Official NCI Colors</p>
          The following colors are based on the NCI digital design guide.
        </div>
        <Divider label="NCI Primary Colors" classNames={divider_style} />

        {Object.keys(nciPrimaryColors).map((name: string) => (
          <ColorPalletLine
            key={`${name}-pallet`}
            name={name}
            colors={nciPrimaryColors[name]}
          />
        ))}
        <Divider label="NCI Secondary Colors" classNames={divider_style} />
        {Object.keys(nciSecondaryColors).map((name: string) => (
          <ColorPalletLine
            key={`${name}-pallet`}
            name={name}
            colors={nciSecondaryColors[name]}
          />
        ))}
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
        <Divider label="GDC Primary Colors" classNames={divider_style} />
        {Object.keys(gdcPrimaryColors).map((name: string) => (
          <ColorPalletLine
            key={`${name}-pallet`}
            name={name}
            colors={gdcPrimaryColors[name]}
          />
        ))}
        <Divider label="GDC Secondary Colors" classNames={divider_style} />
        {Object.keys(gdcSecondaryColors).map((name: string) => (
          <ColorPalletLine
            key={`${name}-pallet`}
            name={name}
            colors={gdcSecondaryColors[name]}
          />
        ))}
              --- */}
      </div>
    </article>
  );
};

export default Colors;
