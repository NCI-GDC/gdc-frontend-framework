import React from "react";
import HeaderButton from "./HeaderButton";
import HeaderLink from "./HeaderLink";
import { HeaderButtonItem, HeaderItem } from "./types";

export const isHeaderButtonItem = (
  item: HeaderItem,
): item is HeaderButtonItem => {
  return item.type === "button";
};

export const createHeaderItem = (item: HeaderItem): React.ReactElement => {
  if (isHeaderButtonItem(item)) {
    return <HeaderButton {...item} />;
  }
  return <HeaderLink {...item} />;
};
