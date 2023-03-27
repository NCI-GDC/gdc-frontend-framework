import React, { ComponentType, ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { CoreProvider } from "@gff/core";
import { Provider } from "react-redux";
import { SummaryModalContext, URLContext } from "src/utils/contexts";
import store from "@/app/store";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CoreProvider>
      <Provider store={store}>
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
            {children}
          </SummaryModalContext.Provider>
        </URLContext.Provider>
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
