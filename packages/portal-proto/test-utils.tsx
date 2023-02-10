import React, { ComponentType, ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { CoreProvider } from "@gff/core";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { SummaryModalContext, URLContext } from "src/pages/_app";
import { NotificationsProvider } from "@mantine/notifications";
import store from "@/app/store";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CoreProvider>
      <Provider store={store}>
        <MantineProvider>
          <URLContext.Provider value={{ prevPath: "", currentPath: "" }}>
            <NotificationsProvider position="top-center" zIndex={400}>
              <SummaryModalContext.Provider
                value={{
                  entityMetadata: {
                    entity_type: null,
                    entity_id: null,
                    entity_name: null,
                  },
                  setEntityMetadata: jest.fn(),
                }}
              >
                {children}
              </SummaryModalContext.Provider>
            </NotificationsProvider>
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
