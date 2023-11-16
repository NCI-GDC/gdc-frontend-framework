import React, { ComponentType, ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { CoreProvider } from "@gff/core";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import {
  SummaryModalContext,
  URLContext,
  DashboardDownloadContext,
} from "src/utils/contexts";
import store from "@/app/store";
import tailwindConfig from "tailwind.config";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const themeColors = Object.fromEntries(
    Object.entries(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme.extend.colors,
    ).map(([key, values]) => [key, Object.values(values)]),
  ) as any;

  return (
    <CoreProvider>
      <Provider store={store}>
        <MantineProvider theme={{ colors: themeColors }}>
          <URLContext.Provider value={{ prevPath: "", currentPath: "" }}>
            <SummaryModalContext.Provider
              value={{
                entityMetadata: {
                  entity_type: null,
                  entity_id: null,
                },
                setEntityMetadata: jest.fn(),
              }}
            >
              <DashboardDownloadContext.Provider
                value={{ state: [], dispatch: jest.fn() }}
              >
                {children}
              </DashboardDownloadContext.Provider>
            </SummaryModalContext.Provider>
          </URLContext.Provider>
        </MantineProvider>
      </Provider>
    </CoreProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult =>
  render(ui, { wrapper: AllTheProviders as ComponentType, ...options });

export * from "@testing-library/react";
export { customRender as render };
