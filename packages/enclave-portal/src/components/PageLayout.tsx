import React, { PropsWithChildren } from "react";
import { Footer } from "@gff/portal-components";
import Header from "@/components/Header";

interface PageLayoutProps extends PropsWithChildren {}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
}: PageLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer
        useVersionInfoDetailsHook={() => ({ data: {}, isSuccess: true })}
        linkColData={[]}
        linkCloud={[]}
        appInfo={{}}
      />
    </>
  );
};

export default PageLayout;
