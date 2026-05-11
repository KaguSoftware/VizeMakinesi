export interface NavItem {
  to: string;
  label: string;
  flag?: string;
  desc?: string;
}

export interface RegionButton {
  label: string;
  to: string;
  flag?: string;
}

export interface MegaColumn {
  kind?: 'feature' | 'region-group';
  title?: string;
  items?: NavItem[];
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    to: string;
  };
  regions?: RegionButton[];
}

export interface MegaMenuGroup {
  label: string;
  columns: MegaColumn[];
}

export interface MobileLink {
  to: string;
  label: string;
  end?: boolean;
}
