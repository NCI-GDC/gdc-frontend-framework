import { useRouter } from "next/router";
import Link from "next/link";
import IconWrapper from "@/components/IconWrapper";

interface NavLinkWithIconProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  isExternal?: boolean;
  activeStyle?: string;
  className?: string;
  [key: string]: any;
}

const NavLinkWithIcon: React.FC<NavLinkWithIconProps> = ({
  href,
  icon,
  text,
  isExternal = false,
  activeStyle,
  className = "",
  children,
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
      className={`flex items-center py-4 px-1 gap-1 rounded-md hover:bg-primary-lightest text-primary-darkest text-sm ${className}`}
    >
      <IconWrapper icon={icon} text={text} />
      {children}
    </a>
  ) : (
    <Link
      {...linkProps}
      className={`flex items-center py-4 px-1 gap-1 rounded-md text-primary-darkest text-sm ${
        isActive ? activeStyle : "hover:bg-primary-lightest"
      } ${className}`}
      {...props}
    >
      <IconWrapper icon={icon} text={text} isActive={isActive} />
      {children}
    </Link>
  );

  return component;
};

export default NavLinkWithIcon;
