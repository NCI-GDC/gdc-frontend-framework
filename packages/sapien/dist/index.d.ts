interface TConfig {
    caseCountKey?: string;
    clickHandler?: (e: any) => void;
    mouseOverHandler?: (e: any) => void;
    mouseOutHandler?: (e: any) => void;
    data?: any;
    fileCountKey?: string;
    height?: number;
    labelSize?: string;
    offsetLeft?: number;
    offsetTop?: number;
    primarySiteKey?: string;
    selector?: any;
    width?: number;
    tickInterval?: number;
    title?: string;
}

declare type TCreateHumanBody = (c: TConfig) => void;
declare const createHumanBody: TCreateHumanBody;

export { TConfig, createHumanBody };
