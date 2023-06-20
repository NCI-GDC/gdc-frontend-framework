import Head from "next/head";
import { Image } from "@/components/Image";
import { PropsWithChildren } from "react";
import { Footer } from "./Footer";
/**
 * This file represents a simple layout for the prototype. This is just to make things look nice.
 * Once we settle on a user flow, we can update these.
 */

/**
 * Top-level layout for GDC pages. This can be used to wrap every page.
 * @returns
 */
export const SimpleLayout: React.FC<unknown> = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <Head>
        <title>GDC Portal Prototype</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header>
      <div className="flex flex-row bg-gray-200 gap-x-4">
        <div className="flex-none w-64 h-12 relative">
          <Image
            src="/NIH_GDC_DataPortal-logo.svg"
            layout="fill"
            style={{ objectFit: "contain" }}
            alt="NCI GDC Data Portal logo"
          />
        </div>
        <div className="flex-grow">{/* middle section of header */}</div>
        <div className="flex-none">{/* right section of header */}</div>
      </div>
    </header>
  );
};
