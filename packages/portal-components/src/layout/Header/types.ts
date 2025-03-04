interface BaseHeaderItem {
  readonly customDataTestID: string;
  readonly text: React.ReactNode;
  readonly image: React.ReactNode;
  readonly type?: "link" | "button";
  readonly children?: React.ReactNode;
}

export interface HeaderLinkItem extends BaseHeaderItem {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: "default" | "menu" | "drawer";
}

export interface HeaderButtonItem extends BaseHeaderItem {
  readonly type: "button";
  readonly onClick: () => void;
  readonly variant?: "default" | "drawer";
}

export type HeaderItem = HeaderLinkItem | HeaderButtonItem;
