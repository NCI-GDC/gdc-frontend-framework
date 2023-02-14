type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }
  | JSX.Element;

export interface JSONObject {
  [k: string]: JSONValue;
}
export type JSONArray = Array<JSONValue>;

export interface DocumentWithWebkit extends Document {
  readonly webkitExitFullscreen: () => void;
  readonly webkitFullscreenElement: Element;
}
