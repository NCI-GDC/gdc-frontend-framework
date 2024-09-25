import { Center } from "@mantine/core";
import Link from "next/link";
import { Image } from "@/components/Image";

interface GDCAppLinkProps {
  href: string;
  icon: string;
  text: string;
  isexternal?: boolean;
  customDataTestID?: string;
}

const GDCAppLink = ({
  href,
  icon,
  text,
  isexternal = true,
  customDataTestID,
}: GDCAppLinkProps) => {
  const linkProps = isexternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Link
      {...linkProps}
      data-testid={customDataTestID}
      className="flex py-2 px-4 hover:bg-primary-lightest hover:rounded-md text-primary-darkest text-sm"
    >
      <Center className="gap-2">
        <Image src={`/user-flow/icons/${icon}`} width={30} height={30} alt="" />
        {text}
      </Center>
    </Link>
  );
};

export default GDCAppLink;
