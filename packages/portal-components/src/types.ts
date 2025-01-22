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
  Omit<React.HTMLProps<HTMLAnchorElement>, "href"> & { href: any }
>;

/*
export interface AppRegistrationEntry {
  readonly id: string;
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
  readonly icon?: React.ReactNode;
  readonly hasDemo?: boolean;
  readonly demoMode?: boolean;
  readonly description?: string;
  readonly iconSize?: {
    readonly width: number;
    readonly height: number;
  };
  readonly countsField?: string;
  readonly hideCounts?: boolean;
  readonly optimizeRules?: ReadonlyArray<string>;
  readonly selectAdditionalCohort?: boolean;
  readonly noDataTooltip?: string;
  readonly rightComponent?: React.FC;
  readonly selectionScreen?: React.FC;
}
  */
