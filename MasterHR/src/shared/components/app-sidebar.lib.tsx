import type { SVGComponent } from '@/shared/interface';

type ChildMenuItem = {
  title?: string;
  to: string;
  permissions?: Undefinable<string>[];
  icon?: SVGComponent;
  dataId?: string;
};

type ParentMenuItem = ChildMenuItem & {
  items: ChildMenuItem[];
};

export type MenuItem = ParentMenuItem | ChildMenuItem;

export const isAccordionItemGuard = (item: ChildMenuItem): item is ParentMenuItem => 'items' in item;
