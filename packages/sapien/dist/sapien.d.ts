import { TConfig } from "./types";
export declare type BodyplotDataEntry = Record<string, string | number>;
declare type TCreateHumanBody = (c: TConfig) => void;
export declare const createHumanBody: TCreateHumanBody;
export {};
