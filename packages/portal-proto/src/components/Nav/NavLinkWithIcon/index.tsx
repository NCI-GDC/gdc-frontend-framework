import { useRouter } from "next/router";
import IconWrapper from "../../IconWrapper";
import Link from "next/link";

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
      className={`flex items-center py-4 px-1 gap-2 rounded-md hover:bg-primary-lightest ${className}`}
    >
      <IconWrapper icon={icon} text={text} />
    </a>
  ) : (
    <Link
      {...linkProps}
      className={`flex items-center py-4 px-1 gap-2 rounded-md ${
        isActive ? activeStyle : "hover:bg-primary-lightest"
      } ${className}`}
      {...props}
    >
      <IconWrapper icon={icon} text={text} isActive={isActive} />
    </Link>
  );

  return component;
};

export default NavLinkWithIcon;
