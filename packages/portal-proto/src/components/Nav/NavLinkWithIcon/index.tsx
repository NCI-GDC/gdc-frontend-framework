import { useRouter } from "next/router";
import Link from "next/link";
import IconWrapper from "@/components/IconWrapper";

interface NavLinkWithIconProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  isExternal?: boolean;
  activeStyle?: string;
  overwriteClassName?: string;
  iconStyle?: string;
  children?: React.ReactNode;
  customDataTestID?: string;
}

const NavLinkWithIcon: React.FC<NavLinkWithIconProps> = ({
  href,
  icon,
  text,
  isExternal = false,
  activeStyle,
  overwriteClassName = "",
  iconStyle,
  children,
  customDataTestID,
  ...props
}) => {
  const router = useRouter();
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  const isActive = router.pathname === href && activeStyle ? true : false;

  const component = isExternal ? (
    <a
      {...linkProps}
      className={`flex items-center py-4 px-1 my-1 gap-1 rounded-md hover:bg-primary-lightest text-primary-darkest text-sm ${overwriteClassName}`}
    >
      <IconWrapper icon={icon} text={text} iconStyle={iconStyle} />
      {children}
    </a>
  ) : (
    <Link
      data-testid={customDataTestID}
      {...linkProps}
      className={`flex items-center py-4 px-1 my-1 gap-1 rounded-md text-sm ${
        isActive
          ? activeStyle
          : "text-primary-darkest hover:bg-primary-lightest"
      } ${overwriteClassName}`}
      {...props}
    >
      <IconWrapper icon={icon} text={text} iconStyle={iconStyle} />
      {children}
    </Link>
  );

  return component;
};

export default NavLinkWithIcon;
