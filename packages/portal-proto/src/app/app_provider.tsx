"use client";

import "@/features/genomic/registerApp";
// import gdc apps here.
// their default exports will trigger registration.
import "@/features/projectsCenter/registerApp";
import "@/features/repositoryApp/registerApp";
import { datadogRum } from "@datadog/browser-rum";
import {
  CoreProvider,
  PUBLIC_APP_INFO,
  registerDefaultCountsHooks,
} from "@gff/core";
import { MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import "@nci-gdc/sapien/dist/bodyplot.css";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  entityMetadataType,
  SummaryModalContext,
  URLContext,
} from "src/utils/contexts";
import { Notifications } from "@mantine/notifications";
import { AppContext, CohortNotificationProvider } from "@gff/portal-components";
import type {
  ImageComponentType,
  LinkComponentType,
} from "@gff/portal-components";
import { useSetActiveCohort } from "@/features/cohortBuilder/CohortManager/cohortActionHooks";
import theme, { cssVariablesResolver } from "src/styles/mantineTheme";

// Adds axe accessibility plugin in development/testing environments
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactDOM = require("react-dom");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axe = require("@axe-core/react");
  axe(React, ReactDOM, 1000);
}

if (process.env.NEXT_PUBLIC_DD_ENABLED) {
  datadogRum.init({
    applicationId: "3faf9c0a-311f-4935-a596-3347666ef35d",
    clientToken: "pub9f7e31eaacd4afa71ac5161cbd5b0c11",
    site: "datadoghq.com",
    service: "portal2",
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    trackViewsManually: true,
    defaultPrivacyLevel: "mask",
    version: `v${PUBLIC_APP_INFO?.version}-${PUBLIC_APP_INFO?.hash}`,
    allowedTracingUrls: [
      "https://gdc.cancer.gov",
      // Matches any subdomain of cancer.gov, such as https://portal.gdc.cancer.gov
      /^https:\/\/[^]+\.cancer\.gov/,
    ],
  });
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const asPath = searchString ? `${path}?${searchString}` : path;
  const [prevPath, setPrevPath] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [localStorageTheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "default",
  });

  useEffect(() => {
    setPrevPath(currentPath);
    setCurrentPath(asPath);
  }, [currentPath, asPath]);

  useEffect(() => {
    registerDefaultCountsHooks();
  }, []);

  const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
    entity_type: null,
    entity_id: null,
  });

  return (
    <CoreProvider>
      <MantineProvider
        theme={theme}
        cssVariablesResolver={cssVariablesResolver}
      >
        <div
          className={`${
            localStorageTheme !== "default" ? localStorageTheme : ""
          } color-transition duration-500`}
        >
          <URLContext.Provider value={{ prevPath, currentPath }}>
            <SummaryModalContext.Provider
              value={{
                entityMetadata,
                setEntityMetadata,
              }}
            >
              <AppContext.Provider
                value={{
                  appName: "GDC",
                  Link: Link as LinkComponentType,
                  Image: Image as ImageComponentType,
                  path,
                  theme,
                }}
              >
                <CohortNotificationProvider
                  useSetActiveCohort={useSetActiveCohort}
                >
                  <Notifications position="top-center" />
                  {children}
                </CohortNotificationProvider>
              </AppContext.Provider>
            </SummaryModalContext.Provider>
          </URLContext.Provider>
        </div>
      </MantineProvider>
    </CoreProvider>
  );
};

export default AppProvider;
