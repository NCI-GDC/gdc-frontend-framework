import { Center } from "@mantine/core";
import Link from "next/link";
import { Image } from "@/components/Image";

interface GDCAppLinkProps {
  href: string;
  icon: string;
  text: string;
  isexternal?: boolean;
}

const GDCAppLink = ({
  href,
  icon,
  text,
  isexternal = true,
}: GDCAppLinkProps) => {
  const linkProps = isexternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Link
      {...linkProps}
      className="flex py-2 px-4 hover:bg-primary-lightest hover:rounded-md"
    >
      <Center className="gap-2">
        <Image src={`/user-flow/icons/${icon}`} width={30} height={30} alt="" />
        {text}
      </Center>
    </Link>
  );
};

export default GDCAppLink;
