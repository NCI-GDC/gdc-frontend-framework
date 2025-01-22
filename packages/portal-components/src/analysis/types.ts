export interface IconSize {
  readonly width: number;
  readonly height: number;
}

export interface AppRegistrationEntry {
  readonly id: string;
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
  readonly icon?: React.ReactNode;
  readonly hasDemo?: boolean;
  readonly demoMode?: boolean;
  readonly description?: string;
  readonly iconSize?: IconSize;
  readonly countsField?: string;
  readonly hideCounts?: boolean;
  readonly optimizeRules?: ReadonlyArray<string>;
  readonly selectAdditionalCohort?: boolean;
  readonly noDataTooltip?: string;
  readonly rightComponent?: React.FC;
  readonly selectionScreen?: React.FC;
}
