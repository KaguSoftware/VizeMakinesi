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

/** One row of the mobile menu: either a plain link or a collapsible group
 *  that mirrors a desktop mega-menu panel (columns + their items). */
export type MobileNavEntry =
  | { kind: 'link'; to: string; label: string }
  | { kind: 'group'; label: string; to: string };
