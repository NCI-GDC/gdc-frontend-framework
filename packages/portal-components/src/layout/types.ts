interface BaseHeaderItem {
  readonly customDataTestID: string;
  readonly text: React.ReactNode;
  readonly image: React.ReactNode;
}

export interface HeaderLinkItem extends BaseHeaderItem {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: "default" | "menu" | "drawer";
  readonly type?: "link";
}

export interface HeaderButtonItem extends BaseHeaderItem {
  readonly type: "button";
  readonly onClick: () => void;
}

export type HeaderItem = HeaderLinkItem | HeaderButtonItem;
