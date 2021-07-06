import { ComponentType } from "react";

/**
 * A registry for the GDC Apps.  
 * 
 * These references to React components cannot live in the redux store
 * because they are complex objects. This registry is a workaround.
 */
export const REGISTRY: Record<string, ComponentType> = {};

export const registerGdcApp = (id: string, gdcApp: ComponentType) => {
  REGISTRY[id] = gdcApp;
};

export const lookupGdcApp = (id: string) => {
  return REGISTRY[id];
}