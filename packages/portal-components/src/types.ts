export interface DataFetchingResult<T> {
  readonly data: T;
  readonly isSuccess: boolean;
  readonly isFetching: boolean;
}

export type DataFetchingHook<T> = () => DataFetchingResult<T>;
