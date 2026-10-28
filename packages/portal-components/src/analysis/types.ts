export interface IconSize {
  readonly width: number;
  readonly height: number;
}

export interface AppStatus {
  /** Text shown in place of the case count, e.g. "Not Available". */
  readonly label: string;
  /** Optional tooltip text shown next to the label. */
  readonly details?: string;
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
  /**
   * When set, the card renders this status in place of the case count and is
   * forced into the inactive (disabled) state. Use it to flag a tool as
   * unavailable without changing any count logic.
   */
  readonly status?: AppStatus;
  readonly rightComponent?: React.FC;
  readonly selectionScreen?: React.FC;
}
