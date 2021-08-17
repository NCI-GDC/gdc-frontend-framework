import { PropsWithChildren } from "react";
import RSSelect, { Theme, Props, GroupTypeBase } from "react-select";

const theme = (theme: Theme): Theme => {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#2378c3", // outline for select box when focused. also, selected item when not-multi. gdc-blue
      primary75: "#4C9AFF", // not used
      primary50: "#73b3e7", // option while being selected (mouse down), gdc-blue-light
      primary25: "#d9e8f6", // option hover, gdc-blue-lighter
      danger: "#000000", // tag 'X' hover, black
      dangerLight: "#fd8ba0", // tag [X] box hover, gdc-red-light
      neutral0: "#ffffff", // input and dropdown background, white
      neutral5: "#404040", // ?? maybe when disabled
      neutral10: "#73b3e7", // tag background, gdc-blue-light
      neutral20: "#757575", // divider between input X and v, gdc-grey
      neutral30: "#757575", // border hover, gdc-grey
      neutral40: "#2e2e2e", // X and v text, hover, gdc-grey-darkest
      neutral50: "#757575", // placeholder text, gdc-grey
      neutral60: "#757575", // X and v text (non-hover)
      neutral70: "#F5F5F5", // not used
      neutral80: "#000000", // cursor and tag text
      neutral90: "#FFFFFF", // not used
    },
  };
};

export interface Option {
  readonly value: string;
  readonly label: string;
}

// NOTE: The IsMulti generic in the react-select typings is odd, as it enforces a values, not a type.
// We may want to abstract this by creating MultiSelect and SingleSelect components.

export interface SelectProps<O, M extends boolean, G extends GroupTypeBase<O>>
  extends Props<O, M, G> {
  // inputId is required to make ssr work correctly.  otherwise, react-select will generate a random id
  readonly inputId: string;
  readonly isMulti: M;
}

/**
 * A themed version of react-select
 */
export const Select = <O, M extends boolean, G extends GroupTypeBase<O>>(
  props: PropsWithChildren<SelectProps<O, M, G>>,
): JSX.Element => {
  return <RSSelect<O, M, G> {...{ theme, ...props }} />;
};
