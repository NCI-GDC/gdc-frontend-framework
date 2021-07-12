import { ReactNode } from "react";

/**
 * A registry for the GDC Apps.  
 * 
 * These references to React components cannot live in the redux store
 * because they are complex objects. This registry is a workaround.
 */
export const REGISTRY: Record<string, ReactNode> = {};

export const registerGdcApp = (id: string, gdcApp: ReactNode) => {
  REGISTRY[id] = gdcApp;
};

export const lookupGdcApp = (id: string) => {
  return REGISTRY[id];
}