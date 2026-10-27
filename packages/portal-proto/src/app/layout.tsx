import Head from "next/head";
import { ColorSchemeScript } from "@mantine/core";

import "@nci-gdc/sapien/dist/bodyplot.css";
import "../styles/globals.css";
import "../styles/survivalplot.css";
import AppProvider from "./app_provider";

import Banners from "@/features/layout/Banners";
import { Header } from "@/features/layout/Header";
import { Footer } from "@/features/layout/Footer";
import GlobalModals from "@/features/layout/GlobalModals";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html suppressHydrationWarning lang="en">
    <Head>
      <ColorSchemeScript defaultColorScheme="auto" />
    </Head>
    <body>
      <div id="__next">
        <AppProvider>
          <div className="flex flex-col min-h-screen min-w-full bg-base-max">
            <header
              className="flex-none bg-base-max sticky top-0 shadow-lg z-header"
              id="global-header"
            >
              <Banners />
              <Header />
            </header>
            {children}
            <GlobalModals />
            <Footer />
          </div>
        </AppProvider>
      </div>
    </body>
  </html>
);

export default RootLayout;
