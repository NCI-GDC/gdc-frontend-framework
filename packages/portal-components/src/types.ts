export interface DataFetchingResult<T> extends DataFetchingStatus {
  readonly data: T;
}

export interface DataFetchingStatus {
  readonly isSuccess?: boolean;
  readonly isFetching?: boolean;
  readonly isError?: boolean;
}

export type DataFetchingHook<T> = () => DataFetchingResult<T>;

export type ImageComponentType = React.ComponentType<
  React.HTMLProps<HTMLImageElement> & { layout: string }
>;

export type LinkComponentType = React.ComponentType<
  Omit<React.HTMLProps<HTMLAnchorElement>, "href"> & { href: any }
>;
