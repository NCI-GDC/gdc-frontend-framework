import React from "react";
import HeaderButton from "./HeaderButton";
import HeaderLink from "./HeaderLink";
import { HeaderButtonItem, HeaderItem } from "./types";

export const isHeaderButtonItem = (
  item: HeaderItem,
): item is HeaderButtonItem => {
  return (item.type ?? "link") === "button";
};

export const createHeaderItem = (item: HeaderItem): React.ReactElement => {
  if (isHeaderButtonItem(item)) {
    return <HeaderButton {...item} key={`button-${item.customDataTestID}`} />;
  }
  return <HeaderLink {...item} key={`link-${item.customDataTestID}`} />;
};
