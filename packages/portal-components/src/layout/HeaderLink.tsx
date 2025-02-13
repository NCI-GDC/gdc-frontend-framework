import React, { useContext } from "react";
import { AppContext } from "src/context";
import { HeaderLinkItem } from "./types";

const HeaderLink = ({
  customDataTestID,
  href,
  image,
  text,
  isExternal = false,
  variant = "default",
}: Omit<HeaderLinkItem, "type">) => {
  // omit type
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  const { Link, path } = useContext(AppContext);

  const activeStyle =
    !isExternal && path === href ? "bg-secondary !text-base-max" : "";

  return (
    <Link
      {...linkProps}
      data-testid={customDataTestID}
      className={`flex items-center rounded-md gap-1 ${
        variant === "drawer"
          ? "px-1 py-4"
          : variant === "menu"
          ? "px-4 py-2"
          : "px-1 py-1"
      } my-1
      hover:bg-primary-lightest hover:rounded-md text-primary-darkest text-sm ${activeStyle}`}
    >
      <>
        {image}
        {text}
      </>
    </Link>
  );
};

export default HeaderLink;
