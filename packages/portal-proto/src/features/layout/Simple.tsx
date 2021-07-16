import Head from "next/head";
import Image from "next/image";
import { PropsWithChildren } from "react";

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
            objectFit="contain"
          />
        </div>
        <div className="flex-grow">{/* middle section of header */}</div>
        <div className="flex-none">{/* right section of header */}</div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex flex-col bg-gray-200 justify-center text-center">
        <div>Site Home | Policies | Accessibility | FOIA | Support</div>
        <div>
          U.S. Department of Health and Human Services | National Institutes of
          Health | National Cancer Institute | USA.gov
        </div>
        <div>NIH... Turning Discovery Into Health ®</div>
      </div>
    </footer>
  );
};
