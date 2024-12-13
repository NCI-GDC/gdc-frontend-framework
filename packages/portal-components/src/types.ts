export interface DataFetchingResult<T> {
  readonly data: T;
  readonly isSuccess: boolean;
  readonly isFetching: boolean;
}

export type DataFetchingHook<T> = () => DataFetchingResult<T>;

export type ImageComponentType = React.ComponentType<
  React.HTMLProps<HTMLImageElement>
>;
export type LinkComponentType = React.ComponentType<
  React.HTMLProps<HTMLAnchorElement>
>;
