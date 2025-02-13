import React, { useContext, useMemo } from "react";
import { AppContext } from "src/context";
import { HeaderLinkItem } from "./types";

const VARIANT_STYLES = {
  drawer: "px-1 py-4",
  menu: "px-4 py-2",
  default: "px-1 py-1",
} as const;

type HeaderLinkProps = Omit<HeaderLinkItem, "type">;

const HeaderLink = ({
  children,
  customDataTestID,
  href,
  image,
  text,
  isExternal = false,
  variant = "default",
}: HeaderLinkProps) => {
  const { Link, path } = useContext(AppContext);

  const linkProps = useMemo(
    () => ({
      ...(isExternal
        ? {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {
            href,
          }),
      "data-testid": customDataTestID,
    }),
    [href, isExternal, customDataTestID],
  );

  const linkClasses = useMemo(() => {
    const baseClasses = "flex items-center rounded-md gap-1 text-sm my-1";
    const variantClasses = VARIANT_STYLES[variant];
    const activeClasses =
      !isExternal && path === href
        ? "bg-secondary !text-base-max"
        : "hover:bg-primary-lightest text-primary-darkest";

    return `${baseClasses} ${variantClasses} ${activeClasses}`.trim();
  }, [variant, isExternal, path, href]);

  return (
    <Link {...linkProps} className={linkClasses}>
      {image}
      {text}
      {children}
    </Link>
  );
};

export default HeaderLink;
